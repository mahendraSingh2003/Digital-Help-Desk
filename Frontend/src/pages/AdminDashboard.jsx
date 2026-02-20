import { useState } from "react";
import AdminSidebar from "../components/AdminComponents/AdminSidebar";
import AdminHeader from "../components/AdminComponents/AdminHeader";
import AdminMain from "../components/AdminComponents/AdminMain";

export default function AdminDashboard() {

  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);

  const newSession = () => {
    const session = {
      id: Date.now().toString(),
      name: "New Session"
    };

    setSessions(prev => [...prev, session]);
    setActiveSession(session);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#303030]">

      <AdminSidebar
        sessions={sessions}
        setSessions={setSessions}
        newSession={newSession}
        activeSession={activeSession}
        setActiveSession={setActiveSession}
      />

      <div className="flex-1 flex flex-col">

        <AdminHeader />

        <AdminMain
          sessions={sessions}
          activeSession={activeSession}
        />

      </div>

    </div>
  );
}
