import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { trpc } from "./lib/trpc";
import { getPublicBrandConfig } from "./lib/brandAssets";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import About from "./pages/About";
import AdminPanel from "./pages/AdminPanel";
import OrderConfirmation from "./pages/OrderConfirmation";
import DomainManagement from "./pages/DomainManagement";
import ProductDetail from "./pages/ProductDetail";
import Blog from "./pages/Blog";
import BlogPostDetail from "./pages/BlogPostDetail";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/product/:id"} component={ProductDetail} />
      <Route path={"/blog/:slug"} component={BlogPostDetail} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/admin"} component={AdminPanel} />
      <Route path={"/order-confirmation"} component={OrderConfirmation} />
      <Route path={"/admin/domain"} component={DomainManagement} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function BrandFavicon() {
  const { data: brandAssets } = trpc.brand.get.useQuery();

  useEffect(() => {
    const publicBrand = getPublicBrandConfig(brandAssets);
    document.title = publicBrand.siteTitle;

    const faviconUrl = publicBrand.favicon;
    if (!faviconUrl) return;

    let favicon = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = faviconUrl;
  }, [brandAssets]);

  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <BrandFavicon />
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
