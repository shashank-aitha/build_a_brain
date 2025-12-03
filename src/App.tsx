import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Get base path from import.meta.env (set by Vite) or default to "/"
let basePath = import.meta.env.BASE_URL || "/";

// Normalize base path - ensure it starts with / and ends with /
if (!basePath.startsWith('/')) basePath = '/' + basePath;
if (!basePath.endsWith('/')) basePath = basePath + '/';

// React Router basename should NOT have a trailing slash
const routerBasename = basePath.slice(0, -1) || "/";

// Debug logging
console.log('=== Routing Debug ===');
console.log('Vite BASE_URL:', import.meta.env.BASE_URL);
console.log('Normalized base path:', basePath);
console.log('Router basename:', routerBasename);
console.log('Current pathname:', window.location.pathname);
console.log('Current search:', window.location.search);
console.log('Current hash:', window.location.hash);

// Handle GitHub Pages 404.html redirect pattern
// Redirects from /repo/?/path to /repo/path
if (window.location.search.includes('?/')) {
  const search = window.location.search.replace(/[?&]\/.*$/, '');
  const path = window.location.search.match(/\?\/?(.*)$/)?.[1]?.replace(/~and~/g, '&') || '';
  const hash = window.location.hash;
  const newPath = basePath + path + hash;
  console.log('Redirecting from 404.html pattern to:', newPath);
  window.history.replaceState({}, '', newPath);
}

// If we're at the root path with trailing slash, ensure React Router can match it
// GitHub Pages serves /build_a_brain/ as the root, but React Router needs exact match
const currentPath = window.location.pathname;
if (currentPath === basePath && currentPath !== '/') {
  // We're at the exact base path - this should match "/" route
  console.log('At base path, should match root route');
}

// Component to debug routing inside the router context
const RouteDebugger = () => {
  const location = useLocation();
  useEffect(() => {
    console.log('=== Inside Router Context ===');
    console.log('Router location.pathname:', location.pathname);
    console.log('Window location.pathname:', window.location.pathname);
    console.log('Router basename:', routerBasename);
  }, [location]);
  return null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={routerBasename}>
          <RouteDebugger />
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
