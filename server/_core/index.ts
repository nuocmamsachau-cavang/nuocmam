import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  
  // Publish endpoint - trigger website deployment via Manus API
  app.post('/api/publish', async (req, res) => {
    try {
      console.log('📤 Publishing website...');
      
      // Import database functions
      const { getSessionId } = await import('../db.js');
      
      // Get Session ID from database
      const taskId = await getSessionId();
      
      if (!taskId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Session ID not configured. Please set it in Admin Panel.' 
        });
      }
      
      const forgeApiUrl = 'https://api.manus.ai';
      const forgeApiKey = process.env.BUILT_IN_FORGE_API_KEY;
      
      if (!forgeApiKey) {
        return res.status(500).json({ 
          success: false, 
          message: 'API key not configured' 
        });
      }
      
      // Call Manus website.publish API
      const publishResponse = await fetch(`${forgeApiUrl}/v2/website.publish`, {
        method: 'POST',
        headers: {
          'x-manus-api-key': forgeApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_id: taskId,
        }),
      });
      
      if (!publishResponse.ok) {
        const error = await publishResponse.text();
        console.error('Manus API error:', error);
        return res.status(publishResponse.status).json({ 
          success: false, 
          message: `Manus API error: ${error}` 
        });
      }
      
      const publishData = await publishResponse.json();
      console.log('✅ Publish request sent to Manus:', publishData);
      
      // Poll for deployment status
      let publishStatus = 'publishing';
      let attempts = 0;
      const maxAttempts = 30; // 60 seconds max (2 second intervals)
      
      while (publishStatus === 'publishing' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        
        const statusResponse = await fetch(
          `${forgeApiUrl}/v2/website.status?website_id=${publishData.website_id || publishData.id}`,
          {
            headers: {
              'x-manus-api-key': forgeApiKey,
            },
          }
        );
        
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          publishStatus = statusData.publish_status;
          console.log(`📊 Deployment status: ${publishStatus}`);
          attempts++;
        }
      }
      
      if (publishStatus === 'published') {
        res.json({ 
          success: true, 
          message: '✅ Website đã được publish thành công! 🎉',
          website_id: publishData.website_id,
          version_id: publishData.version_id,
        });
      } else if (publishStatus === 'failed') {
        res.status(500).json({ 
          success: false, 
          message: '❌ Deployment failed. Please try again.' 
        });
      } else {
        res.json({ 
          success: true, 
          message: '⏳ Deployment in progress. Please check the website in a moment.',
          website_id: publishData.website_id,
        });
      }
    } catch (error) {
      console.error('Publish error:', error);
      res.status(500).json({ 
        success: false, 
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  });
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
