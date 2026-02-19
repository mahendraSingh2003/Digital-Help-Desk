import { useState } from "react";
import AdminSidebar from "../components/AdminComponents/AdminSidebar";
import AdminHeader from "../components/AdminComponents/AdminHeader";
import AdminMain from "../components/AdminComponents/AdminMain";
import AdminBottomBar from "../components/AdminComponents/AdminBottomBar";

export default function AdminDashboard() {

  const [sessions, setSessions] = useState([
    { id: 1, name: "Present Session" },
    { id: 2, name: "Previous Session" }
  ]);

  return (
    <div className="h-screen flex overflow-hidden bg-[#303030]">

      <AdminSidebar sessions={sessions} setSessions={setSessions} />

      <div className="flex-1 flex flex-col">

        <AdminHeader />

        <AdminMain />

        <AdminBottomBar />

      </div>

    </div>
  );
}
