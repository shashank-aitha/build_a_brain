import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Get base path from import.meta.env (set by Vite) or default to "/"
// React Router basename should NOT have a trailing slash
let basePath = import.meta.env.BASE_URL || "/";
// Remove trailing slash for React Router basename
const routerBasename = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;

// Debug logging (remove in production if needed)
console.log('Vite base path:', basePath);
console.log('Router basename:', routerBasename);
console.log('Current pathname:', window.location.pathname);

// Handle GitHub Pages 404.html redirect pattern
// Redirects from /repo/?/path to /repo/path
if (window.location.search.includes('?/')) {
  const search = window.location.search.replace(/[?&]\/.*$/, '');
  const path = window.location.search.match(/\?\/?(.*)$/)?.[1]?.replace(/~and~/g, '&') || '';
  const hash = window.location.hash;
  const newPath = basePath + path + hash;
  window.history.replaceState({}, '', newPath);
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={routerBasename}>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
