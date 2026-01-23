import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PrivateRoute } from "@/components/PrivateRoute";
import { AppLayout } from "@/components/layout/AppLayout";

// Public Pages
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";

// Protected Pages
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import ManagerSchools from "@/pages/ManagerSchools";
import TeacherTrails from "@/pages/TeacherTrails";
import Students from "@/pages/Students";
import Professors from "@/pages/Professors";
import Explore from "@/pages/Explore";
import Notifications from "@/pages/Notifications";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes with Layout */}
            <Route
              element={
                <PrivateRoute>
                  <AppLayout />
                </PrivateRoute>
              }
            >
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              
              {/* Gestor Routes */}
              <Route
                path="/manager-schools"
                element={
                  <PrivateRoute allowedRoles={['gestor']}>
                    <ManagerSchools />
                  </PrivateRoute>
                }
              />

              {/* Professor Routes */}
              <Route
                path="/teacher-trails"
                element={
                  <PrivateRoute allowedRoles={['professor']}>
                    <TeacherTrails />
                  </PrivateRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <PrivateRoute allowedRoles={['professor']}>
                    <Students />
                  </PrivateRoute>
                }
              />

              {/* Aluno Routes */}
              <Route
                path="/explore"
                element={
                  <PrivateRoute allowedRoles={['aluno']}>
                    <Explore />
                  </PrivateRoute>
                }
              />

              {/* Gestor Additional Routes */}
              <Route
                path="/professors"
                element={
                  <PrivateRoute allowedRoles={['gestor']}>
                    <Professors />
                  </PrivateRoute>
                }
              />
            </Route>

            

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
