import { useRef, useEffect } from "react";

export default function SessionItem({ session, activeMenu, setActiveMenu, setSessions }) {

  const ref = useRef();

  useEffect(() => {
    const close = e => {
      if (ref.current && !ref.current.contains(e.target)) setActiveMenu(null);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <div className="relative mb-3">

      {/* SESSION ROW */}
      <div
        className="border border-gray-600 rounded-full px-4 py-2 flex justify-between items-center
                   cursor-pointer text-gray-200 hover:bg-[#303030] transition"
      >

        {session.name}

        <span
          onClick={(e) => {
            e.stopPropagation();
            setActiveMenu(session.id);
          }}
          className="px-2 rounded hover:bg-[#444] transition"
        >
          ⋮
        </span>

      </div>

      {/* DROPDOWN */}
      {activeMenu === session.id && (
        <div
          ref={ref}
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 mt-2 w-[140px]
           bg-[#181a1f] border border-gray-700
           rounded-xl overflow-hidden shadow-xl
           text-gray-200 animate-dropdown z-50"
        >

          <Menu label="View" />

          <Menu
            label="Rename"
            onClick={() => {
              const name = prompt("Rename");
              if (name)
                setSessions(p =>
                  p.map(s => s.id === session.id ? { ...s, name } : s)
                );
            }}
          />

          <Menu
            label="Delete"
            danger
            onClick={() =>
              setSessions(p => p.filter(s => s.id !== session.id))
            }
          />

        </div>
      )}

    </div>
  );
}

const Menu = ({ label, onClick, danger }) => (
  <div
    onClick={onClick}
    className={`px-4 py-2 cursor-pointer transition
      ${danger ? "hover:bg-red-500/20 text-red-400" : "hover:bg-[#303030]"}
    `}
  >
    {label}
  </div>
);
