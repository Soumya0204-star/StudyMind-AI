import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import StudySetup from "./pages/StudySetup";
import Techniques from "./pages/Techniques";
import ActiveRecall from "./pages/ActiveRecall";
import FeynmanTechnique from "./pages/FeynmanTechnique";
import BlurtingMethod from "./pages/BlurtingMethod";
import Performance from "./pages/Performance";
import NotFound from "./pages/NotFound";
import CareerSimulator from "./pages/CareerSimulator";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Index />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/setup"
              element={
                <ProtectedRoute>
                  <StudySetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/techniques"
              element={
                <ProtectedRoute>
                  <Techniques />
                </ProtectedRoute>
              }
            />
            <Route
              path="/techniques/active-recall"
              element={
                <ProtectedRoute>
                  <ActiveRecall />
                </ProtectedRoute>
              }
            />
            <Route
              path="/techniques/feynman"
              element={
                <ProtectedRoute>
                  <FeynmanTechnique />
                </ProtectedRoute>
              }
            />
            <Route
              path="/techniques/blurting"
              element={
                <ProtectedRoute>
                  <BlurtingMethod />
                </ProtectedRoute>
              }
            />
            <Route
              path="/performance"
              element={
                <ProtectedRoute>
                  <Performance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/simulator"
              element={
                <ProtectedRoute>
                  <CareerSimulator />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
