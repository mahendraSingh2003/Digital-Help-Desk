import { useState, useEffect } from "react";
import {
  HiOutlineBars3,
  HiOutlinePlus,
  HiOutlineEllipsisHorizontal,
  HiOutlineTrash
} from "react-icons/hi2";

export default function Sidebar({
  open,
  setOpen,
  chats,
  newChat,
  loadChat,
  deleteChat
}) {

  const [menuOpen, setMenuOpen] = useState(null);

  // close menu when clicking outside
  useEffect(() => {

    const handleClickOutside = (e) => {
      if (!e.target.closest(".menu-container")) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  return (
    <div
      className={`bg-[#1f2024] text-white ${open ? "w-64" : "w-16"}
      h-full p-3 flex flex-col transition-all duration-300`}
    >

      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="mb-4 bg-[#40414F] p-2 rounded w-full flex items-center justify-center hover:bg-[#50515f]"
      >
        <HiOutlineBars3 size={20} />
        {open && <span className="ml-2">Collapse</span>}
      </button>

      {/* New Chat */}
      <button
        onClick={newChat}
        className="border rounded p-2 w-full mb-3 hover:bg-[#40414F] flex items-center justify-center"
      >
        <HiOutlinePlus size={20} />
        {open && <span className="ml-2">New Question</span>}
      </button>

      {/* Chat List */}
      {open && (
        <div className="overflow-y-auto h-[75vh] space-y-1 pr-1">

          {chats.map((c) => (
            <div
              key={c._id}
              className="flex items-center justify-between text-sm p-2 rounded hover:bg-[#40414F] group"
            >

              {/* Question */}
              <div
                onClick={() => loadChat(c)}
                className="truncate cursor-pointer flex-1 text-gray-200"
              >
                {c.question.slice(0, 40)}
              </div>

              {/* Menu */}
              <div className="relative menu-container">

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(menuOpen === c._id ? null : c._id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition"
                >
                  <HiOutlineEllipsisHorizontal size={18} />
                </button>

                {menuOpen === c._id && (
                  <div className="absolute right-0 top-6 bg-[#2a2b31] rounded shadow-lg text-sm z-50">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(c._id);
                        setMenuOpen(null);
                      }}
                      className="flex items-center px-3 py-2 hover:bg-[#3a3b41] w-full"
                    >
                      <HiOutlineTrash className="mr-2" />
                      Delete
                    </button>

                  </div>
                )}

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}