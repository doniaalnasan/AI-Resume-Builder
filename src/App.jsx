import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import CreateCV from "./pages/CreateCV";
import Dashboard from "./pages/Dashboard";
import AiSuggestion from "./pages/AISuggestions";


import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/create-cv" element={<CreateCV />} />

      <Route path="/ai-suggestions" element={<AiSuggestion />} />
    </Routes>
  );
}

export default App;