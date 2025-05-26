import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children, allowedRoles }) => {
    const isAuthenticated = localStorage.getItem("valid") === "true";
    const userRole = localStorage.getItem("role");

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/404" />;
    }
    return children
}

export default PrivateRoute;