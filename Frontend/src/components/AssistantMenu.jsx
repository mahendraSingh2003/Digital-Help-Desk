import { useEffect, useRef, useState } from "react";
import API from "../api";

export default function AssistantMenu({ onClose, message }) {
  const ref = useRef();
  const [openUp, setOpenUp] = useState(false);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Detect overflow and flip menu
  useEffect(() => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // If bottom overflows → open upward
    if (rect.bottom > viewportHeight - 20) {
      setOpenUp(true);
    }
  }, []);

  const handleAction = async (type) => {
    try {
      await API.post("/chat/actions", {
        action: type,
        content: message,
      });

      onClose();
    } catch {
      alert("Something went wrong");
    }
  };

  return (
    <div
      ref={ref}
      className={`absolute right-0 ${
        openUp ? "bottom-full mb-2" : "top-full mt-2"
      } bg-[#2f303a] rounded-lg shadow-xl w-48 z-30`}
    >
      <MenuItem label="Not satisfied" />

      <MenuItem label="Ask Human" onClick={() => handleAction("ask-human")} />

      <MenuItem
        label="Book Appointment"
        onClick={() => handleAction("book-appointment")}
      />

      <MenuItem
        label="Raise Issue"
        onClick={() => handleAction("raise-issue")}
      />
    </div>
  );
}

function MenuItem({ label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="px-4 py-2 text-sm text-gray-200 hover:bg-[#40414F] cursor-pointer"
    >
      {label}
    </div>
  );
}
