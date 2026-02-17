import { Routes, Route } from "react-router-dom";

import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPages";
import AppointmentPage from "./pages/AppointmentPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/appointment" element={<AppointmentPage />} />
    </Routes>
  );
}
