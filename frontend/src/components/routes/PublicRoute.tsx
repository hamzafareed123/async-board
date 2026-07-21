import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth-store";
import Spinner from "../ui/Spinner";
 
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isCheckingAuth, authUser } = useAuthStore();

    if (isCheckingAuth) return <Spinner />;
    if (authUser) return <Navigate to="/dashboard" replace />;

    return <>{children}</>;
};

export default PublicRoute