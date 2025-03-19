import { useState } from "react";
import { Outlet, Navigate } from "react-router";

const CORRECT_PASSWORD = "yourpassword"; // Set your predefined password

const ProtectedRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    if (!isAuthenticated) {
        const enteredPassword = prompt("Enter Password:");
        if (enteredPassword === CORRECT_PASSWORD) {
            setIsAuthenticated(true);
        } else {
            return <Navigate to="/about" />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoutes;
