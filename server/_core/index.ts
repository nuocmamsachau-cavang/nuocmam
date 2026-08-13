import "dotenv/config";
import express from "express";
import { createServer, type Server } from "http";
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

type AppOptions = {
  vercel?: boolean;
  server?: Server;
};

export async function createApp(options: AppOptions = {}) {
  const app = express();
  const server = options.server;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);

  app.post('/api/publish', async (req, res) => {
    try {
      console.log('Publishing website...');
      const { getSessionId } = await import('../db.js');
      const taskId = await getSessionId();
      if (!taskId) return res.status(400).json({ success: false, message: 'Session ID not configured. Please set it in Admin Panel.' });

      const forgeApiUrl = 'https://api.manus.ai';
      const forgeApiKey = process.env.BUILT_IN_FORGE_API_KEY;
      if (!forgeApiKey) return res.status(500).json({ success: false, message: 'API key not configured' });

      const publishResponse = await fetch(`${forgeApiUrl}/v2/website.publish`, {
        method: 'POST',
        headers: { 'x-manus-api-key': forgeApiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId }),
      });
      if (!publishResponse.ok) {
        const error = await publishResponse.text();
        return res.status(publishResponse.status).json({ success: false, message: `Manus API error: ${error}` });
      }

      const publishData = await publishResponse.json();
      let publishStatus = 'publishing';
      let attempts = 0;
      const maxAttempts = 30;
      while (publishStatus === 'publishing' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const statusResponse = await fetch(`${forgeApiUrl}/v2/website.status?website_id=${publishData.website_id || publishData.id}`, { headers: { 'x-manus-api-key': forgeApiKey } });
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          publishStatus = statusData.publish_status;
          attempts++;
        }
      }

      if (publishStatus === 'published') return res.json({ success: true, message: 'Website đã được publish thành công!', website_id: publishData.website_id, version_id: publishData.version_id });
      if (publishStatus === 'failed') return res.status(500).json({ success: false, message: 'Deployment failed. Please try again.' });
      return res.json({ success: true, message: 'Deployment in progress. Please check the website in a moment.', website_id: publishData.website_id });
    } catch (error) {
      return res.status(500).json({ success: false, message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  });

  app.post('/api/scheduled/publish-website', async (_req, res) => {
    try {
      const { getSessionId } = await import('../db.js');
      const taskId = await getSessionId();
      if (!taskId) return res.status(200).json({ ok: true, skipped: 'Session ID not configured' });

      const forgeApiKey = process.env.BUILT_IN_FORGE_API_KEY;
      if (!forgeApiKey) return res.status(200).json({ ok: true, skipped: 'API key not configured' });
      const publishResponse = await fetch('https://api.manus.ai/v2/website.publish', {
        method: 'POST',
        headers: { 'x-manus-api-key': forgeApiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId }),
      });
      if (!publishResponse.ok) return res.status(200).json({ ok: true, error: `API returned ${publishResponse.status}` });
      const publishData = await publishResponse.json();
      return res.json({ ok: true, message: 'Website published successfully', website_id: publishData.website_id });
    } catch (error) {
      return res.status(200).json({ ok: true, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.use('/api/trpc', createExpressMiddleware({ router: appRouter, createContext }));

  if (!options.vercel && process.env.NODE_ENV === 'development' && server) {
    await setupVite(app, server);
  } else if (!options.vercel) {
    serveStatic(app);
  }

  return app;
}

export async function startServer() {
  const server = createServer();
  const app = await createApp({ server });
  server.on('request', app);

  const preferredPort = parseInt(process.env.PORT || '3000');
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  server.listen(port, () => console.log(`Server running on http://localhost:${port}/`));
}

if (!process.env.VERCEL) {
  startServer().catch(console.error);
}
