import { Routes, Route } from "react-router-dom";

import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPages";
import AppointmentPage from "./pages/AppointmentPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/AdminDashboard" element={<AdminDashboard />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/appointment" element={<AppointmentPage />} />
    </Routes>
  );
}
