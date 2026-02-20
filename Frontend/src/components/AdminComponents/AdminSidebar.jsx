import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineBars3,
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlineBookOpen
} from "react-icons/hi2";

export default function AdminSidebar({
  sessions,
  setSessions,
  newSession,
  activeSession,
  setActiveSession
}) {

  const [open, setOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const ref = useRef();

  useEffect(() => {
    const close = e => {
      if (ref.current && !ref.current.contains(e.target)) setActiveMenu(null);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <div className={`bg-[#1f2024] text-white ${open ? "w-64" : "w-16"} p-3 flex flex-col justify-between  transition-all duration-300`}>

      <div>

        <button
          onClick={() => setOpen(!open)}
          className="mb-4 w-full bg-[#40414F] rounded p-2 flex justify-center gap-2"
        >
          <HiOutlineBars3 size={20} />
          {open && "Collapse"}
        </button>

        {open ? (
          <input className="w-full mb-4 bg-black rounded-full px-4 py-2" placeholder="Search..." />
        ) : (
          <div className="flex justify-center mb-4">
            <HiOutlineMagnifyingGlass size={20} />
          </div>
        )}

        <button
          onClick={newSession}
          className="w-full mb-4 bg-[#40414F] rounded-xl py-2 flex justify-center gap-2"
        >
          <HiOutlinePlus size={18} />
          {open && "New Session"}
        </button>

        {open && sessions.map(session => (
          <div key={session.id} className="relative mb-2">

            <div
              onClick={() => setActiveSession(session)}
              className={`border rounded-full px-4 py-2 flex justify-between items-center cursor-pointer
              ${activeSession?.id === session.id ? "bg-[#303030] border-blue-500" : "border-gray-600 hover:bg-[#303030]"}`}
            >

              {editingId === session.id ? (
                <input
                  autoFocus
                  defaultValue={session.name}
                  onBlur={e => {
                    setSessions(p =>
                      p.map(s => s.id === session.id ? { ...s, name: e.target.value } : s)
                    );
                    setEditingId(null);
                  }}
                  className="bg-transparent outline-none w-full"
                />
              ) : session.name}

              <span
                onClick={e => {
                  e.stopPropagation();
                  setActiveMenu(session.id);
                }}
                className="px-2"
              >
                ⋮
              </span>
            </div>

            {activeMenu === session.id && (
              <div ref={ref} className="absolute mt-2 w-[140px] bg-[#181a1f] border rounded-xl">

                <Menu label="Rename" onClick={() => {
                  setEditingId(session.id);
                  setActiveMenu(null);
                }} />

                <Menu label="Delete" danger onClick={() =>
                  setSessions(p => p.filter(s => s.id !== session.id))
                } />

              </div>
            )}

          </div>
        ))}

      </div>

      <button onClick={() => navigate("/Knowledgebase")}
        className="w-full p-2 hover:bg-[#40414F] rounded flex justify-center items-center gap-2" >
        <HiOutlineBookOpen size={18} />
        {open && "Knowledgebase"} </button>
    </div>
  );
}

const Menu = ({ label, onClick, danger }) => (
  <div onClick={onClick} className={`px-4 py-2 cursor-pointer ${danger ? "text-red-400" : ""}`}>
    {label}
  </div>
);
