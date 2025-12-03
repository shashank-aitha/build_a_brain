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
// But we need to match exactly what's in the URL
let routerBasename = basePath.slice(0, -1) || "/";

// Special handling: if basePath is just "/", keep basename as "/"
// Otherwise ensure basename matches the pathname format
if (basePath === "/") {
  routerBasename = "/";
} else {
  // Ensure basename doesn't have trailing slash for React Router
  routerBasename = routerBasename || "/";
}

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

// If we're at the root path, ensure we can match it
// GitHub Pages serves /build_a_brain/ as the root
const currentPath = window.location.pathname;
const normalizedCurrentPath = currentPath.endsWith('/') ? currentPath : currentPath + '/';

if (normalizedCurrentPath === basePath && currentPath !== '/') {
  console.log('At base path, should match root route');
  // If pathname exactly matches basePath, React Router should strip it and match "/"
  // But if it's not matching, we might need to handle it differently
}

// Component to debug routing and handle edge cases
const RouteDebugger = () => {
  const location = useLocation();
  useEffect(() => {
    console.log('=== Inside Router Context ===');
    console.log('Router location.pathname:', location.pathname);
    console.log('Window location.pathname:', window.location.pathname);
    console.log('Router basename:', routerBasename);
    
    // If we're showing NotFound but we're at what should be the root,
    // try to redirect to ensure proper matching
    if (location.pathname !== '/' && window.location.pathname === basePath) {
      console.warn('Pathname mismatch detected - attempting to fix');
      // This shouldn't be necessary, but helps debug
    }
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
            {/* Explicitly handle empty string and root */}
            <Route path="" element={<Index />} />
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
