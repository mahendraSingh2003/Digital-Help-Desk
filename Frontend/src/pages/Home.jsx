import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ChatArea from "../components/ChatArea";
import ChatInput from "../components/ChatInput";
import API from "../api";

export default function Home() {

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const bottomRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const makeTitle = (text) =>
    text.split(" ").slice(0, 5).join(" ");

  const newChat = () => {
    setMessages([]);
    setActiveChat(null);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const text = input;     // capture current input
    setInput("");          // clear UI instantly

    let chatId = activeChat;

    if (!chatId) {
      chatId = Date.now();
      setChats(p => [{ id: chatId, title: makeTitle(text), messages: [] }, ...p]);
      setActiveChat(chatId);
    }

    const userMsg = { role: "user", content: text };
    setMessages(p => [...p, userMsg]);

    try {
      const res = await API.post("/api/chat", { message: text });

      const bot = {
        role: "assistant",
        content: res.data.reply || "Backend response here."
      };

      setMessages(p => [...p, bot]);

      setChats(prev =>
        prev.map(c =>
          c.id === chatId
            ? { ...c, messages: [...c.messages, userMsg, bot] }
            : c
        )
      );

    } catch {
      setMessages(p => [...p, { role: "assistant", content: "⚠ Backend not connected yet." }]);
    }
  };


  return (
    <div className="h-screen flex overflow-hidden" style={{ background: theme === "dark" ? "#303030" : "#c5ccdb" }}>

      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        chats={chats}
        newChat={newChat}
        loadChat={(c) => {
          setActiveChat(c.id);
          setMessages(c.messages);
        }}
      />

      <div className="flex-1 flex flex-col">

        <Header theme={theme} setTheme={setTheme} />

        <ChatArea messages={messages} bottomRef={bottomRef} />

        <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} />

      </div>
    </div>
  );
}
