import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Get base path from import.meta.env (set by Vite) or default to "/"
// Ensure it ends with a slash for proper routing
let basePath = import.meta.env.BASE_URL || "/";
if (!basePath.endsWith('/')) {
  basePath += '/';
}

// Debug logging (remove in production if needed)
console.log('Base path:', basePath);
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
      <BrowserRouter basename={basePath}>
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
