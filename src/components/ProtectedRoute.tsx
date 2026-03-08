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
        // Redirect to their respective dashboard if they try to access a role-protected route
        if (role === 'admin') return <Navigate to="/admin-dashboard" replace />;
        if (role === 'technician') return <Navigate to="/technician-dashboard" replace />;
        return <Navigate to="/customer-dashboard" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
