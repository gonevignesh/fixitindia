import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { Loader2 } from "lucide-react";

// Lazy load pages for performance
const Index = lazy(() => import("./pages/Index"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Login = lazy(() => import("./pages/Login"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const CustomerDashboard = lazy(() => import("./pages/CustomerDashboard"));
const TechnicianDashboard = lazy(() => import("./pages/TechnicianDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Simple loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh] w-full">
    <Loader2 className="w-10 h-10 text-primary animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<MainLayout showFooter={false}><Login /></MainLayout>} />

              {/* Public Pages */}
              <Route path="/" element={<MainLayout isHome={true}><Index /></MainLayout>} />
              <Route path="/services" element={<MainLayout><Services /></MainLayout>} />
              <Route path="/services/:id" element={<MainLayout><ServiceDetail /></MainLayout>} />
              <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
              <Route path="/about" element={<MainLayout><About /></MainLayout>} />

              {/* Protected Dashboards */}
              <Route
                path="/customer-dashboard"
                element={
                  <ProtectedRoute allowedRole="customer">
                    <MainLayout><CustomerDashboard /></MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/technician-dashboard"
                element={
                  <ProtectedRoute allowedRole="technician">
                    <MainLayout><TechnicianDashboard /></MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <MainLayout><AdminDashboard /></MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<MainLayout showFooter={false}><NotFound /></MainLayout>} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
