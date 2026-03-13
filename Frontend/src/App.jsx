import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPages";
import AppointmentPage from "./pages/AppointmentPage";
import KnowledgeBase from "./pages/KnowledgeBase";
import QaDashboard from "./pages/QaDashboard";
import SignUp from "./pages/SignUp";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/adminDashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/knowledgeBase" element={<KnowledgeBase />} />
      <Route path="/qaDashboard" element={<QaDashboard />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/appointment" element={<AppointmentPage />} />
    </Routes>
  );
}
