import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRole?: string;
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
    const { user, role, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRole && role !== allowedRole) {
        // If role is still null even after loading is finished, it means the user has no role assigned yet
        if (role === null && user) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                    <h2 className="text-xl font-bold mb-2 text-slate-900">Account Setup in Progress</h2>
                    <p className="text-slate-500 mb-6">We're finalizing your account permissions. This usually takes a few seconds.</p>
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            );
        }

        if (role === 'admin') return <Navigate to="/admin-dashboard" replace />;
        if (role === 'technician') return <Navigate to="/technician-dashboard" replace />;
        return <Navigate to="/customer-dashboard" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
