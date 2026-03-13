import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/HomeComponents/Sidebar";
import Header from "../components/HomeComponents/Header";
import ChatArea from "../components/HomeComponents/ChatArea";
import ChatInput from "../components/HomeComponents/ChatInput";
import API from "../api";

const GUEST_LIMIT = 3;

export default function Home() {

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [questions, setQuestions] = useState([]);
  const [activeQuestionId, setActiveQuestionId] = useState(null);

  const bottomRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const newChat = () => {
    setActiveQuestionId(null);
    setMessages([]);
  };

  // guest question count
  const getGuestCount = () =>
    parseInt(localStorage.getItem("guest_questions") || "0", 10);

  const increaseGuestCount = () =>
    localStorage.setItem("guest_questions", getGuestCount() + 1);

  const sendMessage = async () => {

    if (!input.trim()) return;

    const token = localStorage.getItem("token");
    const loggedIn = !!token;

    // guest limit check
    if (!loggedIn && getGuestCount() >= GUEST_LIMIT) {

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "🔒 Free limit reached. Please login to continue."
        }
      ]);

      return;
    }

    const text = input;
    setInput("");

    const qid = Date.now().toString();

    setMessages([{ role: "user", content: text }]);

    setQuestions(prev => [
      { _id: qid, question: text, answer: "", status: "pending" },
      ...prev
    ]);

    setActiveQuestionId(qid);

    try {

      const res = await API.post("/ask", { text, user_id: 1 });

      const answer = res.data.answer;

      // increase guest usage ONLY after success
      if (!loggedIn) increaseGuestCount();

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: answer }
      ]);

      setQuestions(prev =>
        prev.map(q =>
          q._id === qid
            ? { ...q, answer: answer, status: "ai_response" }
            : q
        )
      );

    } catch {

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "⚠ Server error. Try again." }
      ]);

    }
  };
  const deleteChat = (id) => {
    setQuestions(prev => {
      const updated = prev.filter(q => q._id !== id);

      // if deleted question was active
      if (activeQuestionId === id) {

        if (updated.length > 0) {
          const next = updated[0];

          setActiveQuestionId(next._id);

          setMessages([
            { role: "user", content: next.question },
            { role: "assistant", content: next.answer }
          ]);

        } else {

          setActiveQuestionId(null);
          setMessages([]);

        }
      }

      return updated;
    });
  };
  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ background: theme === "dark" ? "#303030" : "#c5ccdb" }}
    >

      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        chats={questions}
        newChat={newChat}
        deleteChat={deleteChat}
        loadChat={(q) => {
          setActiveQuestionId(q._id);
          setMessages([
            { role: "user", content: q.question },
            { role: "assistant", content: q.answer || "Not answered yet." }
          ]);
        }}
      />

      <div className="flex-1 flex flex-col">

        <Header theme={theme} setTheme={setTheme} />

        <ChatArea
          messages={messages}
          bottomRef={bottomRef}
          activeQuestionId={activeQuestionId}
          questions={questions}
        />

        <ChatInput
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
        />

      </div>
    </div>
  );
}