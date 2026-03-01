import { useNavigate } from "react-router-dom";
import {
  HiOutlineBars3,
  HiOutlinePlus,
  HiOutlineUserCircle
} from "react-icons/hi2";

export default function Sidebar({ open, setOpen, chats, newChat, loadChat }) {

  const navigate = useNavigate();

  return (
    <div
      className={`bg-[#1f2024] text-white ${open ? "w-64" : "w-16"
        } h-full p-3 flex flex-col justify-between transition-all duration-300`}
    >
      {/* TOP SECTION */}
      <div>
        {/* Toggle Button */}
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

        {/* Chat List (only when open) */}
        {open &&
          chats.map((c) => (
            <div
              key={c._id}
              onClick={() => loadChat(c)}
              className="text-sm p-2 rounded truncate cursor-pointer text-gray-200 hover:bg-[#40414F]"
            >
            {c.question.slice(0, 40)}
            </div>
          ))}
      </div>

      {/* FOOTER SECTION */}
      <div>
        <button
          onClick={() => navigate("/login")}
          className="w-full p-2 rounded hover:bg-[#40414F] flex items-center justify-center"
        >
          <HiOutlineUserCircle size={16} />
          {open && <span className="ml-2">Admin Login</span>}
        </button>
      </div>
    </div>
  );
}
