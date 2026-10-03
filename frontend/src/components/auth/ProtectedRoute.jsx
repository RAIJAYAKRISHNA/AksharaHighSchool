import { Navigate } from "react-router-dom";

import Loading from "../common/Loading.jsx";
import { getDashboardPath, useAuth } from "../../context/AuthContext.jsx";

function ProtectedRoute({ role, children }) {
    const { user, initializing } = useAuth();

    if (initializing) {
        return <Loading fullPage text="Checking your session..." />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        return <Navigate to={getDashboardPath(user.role)} replace />;
    }

    return children;
}

export default ProtectedRoute;