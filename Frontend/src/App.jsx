import { useState, useRef, useEffect } from "react";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello 👋 How can I help you today?" },
  ]);

  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: input },
      { role: "assistant", text: "This will be connected to FastAPI later." },
    ]);

    setInput("");
  };

  return (
    <div className="h-screen flex bg-[#343541] text-white">

      {/* Sidebar */}
      <div className="w-64 bg-[#202123] p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Digital Help Desk</h2>

        <button className="bg-[#40414F] rounded p-2 text-sm mb-2">
          + New Chat
        </button>

        <div className="flex-1 text-gray-400 text-sm mt-4">
          Chat history coming soon...
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-2xl ${
                msg.role === "user"
                  ? "ml-auto bg-green-600"
                  : "mr-auto bg-[#40414F]"
              } rounded-xl p-3`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>

        {/* Input */}
        <div className="border-t border-gray-700 p-4">
          <div className="max-w-3xl mx-auto flex bg-[#40414F] rounded-xl p-2">
            <input
              className="flex-1 bg-transparent outline-none text-white px-2"
              placeholder="Send a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-green-500 hover:bg-green-600 px-4 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
