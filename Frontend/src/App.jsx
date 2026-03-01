import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPages";
import AppointmentPage from "./pages/AppointmentPage";
import KnowledgeBase from "./pages/KnowledgeBase";
import QaDashboard from "./pages/QaDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/knowledgeBase" element={<KnowledgeBase />} />
      <Route path="/qaDashboard" element={<QaDashboard />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/appointment" element={<AppointmentPage />} />
    </Routes>
  );
}
