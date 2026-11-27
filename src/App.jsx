import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Settings from "./pages/Settings";
import ChangePassword from "./pages/ChangePassword";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CVPreview from "./pages/CVPreview";

import CreateCV from "./pages/CreateCV";
import Dashboard from "./pages/Dashboard";

import { tokenStore } from "./api/client";

import "./App.css";

function ProtectedRoute() {
    return tokenStore.get()
        ? <Outlet />
        : <Navigate to="/login" replace />;
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/shared-cv/:shareToken" element={<CVPreview />} />
            
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-cv" element={<CreateCV />} />
                <Route path="/create-cv/:id" element={<CreateCV />} />                
                <Route path="/cv/:id" element={<CVPreview />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/change-password" element={<ChangePassword />} /> 
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} /> 
        </Routes>
    );
}

export default App;
