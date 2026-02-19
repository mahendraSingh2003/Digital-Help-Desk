import { useState } from "react";
import SessionItem from "./SessionItem";

export default function AdminSidebar({ sessions, setSessions }) {

  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <div className="w-[280px] bg-[#1f2024] border-r border-gray-700 p-4 text-gray-200">

      <div className="font-bold mb-3 text-gray-200">Session Title</div>

      <input
        className="w-full bg-black text-white rounded-full px-4 py-2 mb-4 outline-none placeholder-gray-400"
        placeholder="Search bar....."
      />

      {sessions.map(s => (
        <SessionItem
          key={s.id}
          session={s}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          setSessions={setSessions}
        />
      ))}

    </div>
  );
}
