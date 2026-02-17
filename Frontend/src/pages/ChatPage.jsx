import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineMicrophone } from "react-icons/hi2";
import API from "../api";

export default function ChatPage() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);

    try {
      const response = await API.post("/api/chat", { message: input });
      const data = response.data;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Backend response here." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠ Backend not connected yet." },
      ]);
    }

    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "25px"; // reset to single line
    }
  };

  return (
    <div className="h-screen bg-[#2f3037] text-white flex overflow-hidden">

      {/* SIDEBAR */}
      <div className={`bg-[#1f2024] ${sidebarOpen ? "w-64" : "w-16"} p-4`}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mb-4 bg-[#40414F] p-2 rounded w-full"
        >
          {sidebarOpen ? "Collapse" : "☰"}
        </button>

        {sidebarOpen && (
          <button className="border rounded p-2 w-full hover:bg-[#40414F]">
            + New Chat
          </button>
        )}
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="flex justify-between p-4 border-b border-gray-700 relative">

          <div className="text-lg font-semibold">Digital Help Desk</div>

          <div className="flex gap-4">

            {/* PROFILE */}
            <div
              className="relative"
              onMouseEnter={() => {
                setShowProfile(true);
                setShowSettings(false);
              }}
              onMouseLeave={() => setShowProfile(false)}
            >
              <div className="bg-[#40414F] px-3 py-1 rounded cursor-pointer">👤</div>

              {showProfile && (
                <div className="absolute right-0 top-full pt-2">
                  <div className="bg-[#40414F] p-3 rounded space-y-1 min-w-[150px]">
                    <div onClick={() => navigate("/profile")} className="cursor-pointer hover:text-green-400">
                      Profile
                    </div>
                    <div>Email</div>
                    <div>Logout</div>
                  </div>
                </div>
              )}
            </div>

            {/* SETTINGS */}
            <div
              className="relative"
              onMouseEnter={() => {
                setShowSettings(true);
                setShowProfile(false);
              }}
              onMouseLeave={() => setShowSettings(false)}
            >
              <div className="bg-[#40414F] px-3 py-1 rounded cursor-pointer">⚙️</div>

              {showSettings && (
                <div className="absolute right-0 top-full pt-2">
                  <div className="bg-[#40414F] p-3 rounded space-y-1 min-w-[170px]">
                    <div onClick={() => navigate("/settings")} className="cursor-pointer hover:text-green-400">
                      Q/A Interface
                    </div>
                    <div onClick={() => navigate("/appointment")} className="cursor-pointer hover:text-green-400">
                      Book Appointment
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* CHAT */}
        <div className="flex-1 p-6 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : "text-center"}>
              <div className="bg-[#40414F] inline-block p-3 rounded m-2">
                {m.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="p-6 relative">
          <div className="max-w-[620px] mx-auto relative -top-6">

            <div
              className={`relative bg-[#2f3037] px-4 py-3 shadow-2xl border border-[#3f4046] transition-all duration-200 ${
                input.length > 40 ? "rounded-2xl" : "rounded-full"
              }`}
            >

              <button className="absolute left-4 bottom-4 text-gray-400 hover:text-white text-xl">
                +
              </button>

              <textarea
                ref={textareaRef}
                value={input}
                rows={1}
                onChange={(e) => {
                  setInput(e.target.value);
                  textareaRef.current.style.height = "8px";
                  textareaRef.current.style.height =
                    Math.min(textareaRef.current.scrollHeight, 160) + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask anything"
                className="w-full bg-transparent outline-none text-white placeholder-gray-400 resize-none overflow-y-auto pl-8 pr-20 leading-normal"
                style={{ minHeight: "8px" }}
              />

              <div className="absolute right-4 bottom-4 flex items-center gap-3">

                <button className="text-gray-400 hover:text-white transition">
                  <HiOutlineMicrophone size={22} />
                </button>

                {input.trim() && (
                  <button
                    onClick={sendMessage}
                    className="bg-white text-black w-7 h-7 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition"
                  >
                    ➤
                  </button>
                )}

              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
