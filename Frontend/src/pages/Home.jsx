import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/HomeComponents/Sidebar";
import Header from "../components/HomeComponents/Header";
import ChatArea from "../components/HomeComponents/ChatArea";
import ChatInput from "../components/HomeComponents/ChatInput";
import API from "../api";

// 🔥 DEMO DATA FOR TESTING
const demoQuestions = [
  {
    _id: "1",
    question: "What is React useRef used for?",
    answer: "Not answered yet.",
    status: "pending",
  },
  {
    _id: "2",
    question: "Explain JWT authentication flow",
    answer: "JWT is used for stateless authentication between client and server.",
    status: "ai_response",
  },
];

export default function Home() {

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [questions, setQuestions] = useState(demoQuestions);
  const [activeQuestionId, setActiveQuestionId] = useState(null);

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
    setActiveQuestionId(null);
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const text = input;
    setInput("");

    // 🔥 Every new input = NEW QUESTION
    const newQuestion = {
      _id: Date.now().toString(), // unique id
      question: text,
      answer: "Not answered yet.",
      status: "pending",
    };

    setQuestions(prev => [newQuestion, ...prev]);
    setActiveQuestionId(newQuestion._id);

    // Show only 1 Question + 1 Answer in ChatArea
    setMessages([
      { role: "user", content: text }
    ]);

    try {
      // 🔥 BACKEND CALL (AI)
      // const res = await API.post("/ask", {
      //   question: text,
      // });

      const aiReply = "Backend response here.";

      const botMessage = {
        role: "assistant",
        content: aiReply,
      };

      setMessages(prev => [...prev, botMessage]);

      // 🔥 Update question object with AI response
      setQuestions(prev =>
        prev.map(q =>
          q._id === newQuestion._id
            ? { ...q, answer: aiReply, status: "ai_response" }
            : q
        )
      );

      // 🔥 OPTIONAL: SAVE TO DATABASE
      // await API.post("/api/questions", {
      //   ...newQuestion,
      //   answer: aiReply,
      //   status: "ai_response"
      // });

    } catch {
      // If AI quota full or error
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "⚠ AI quota full. Please ask human." }
      ]);
    }
  };


  return (
    <div className="h-screen flex overflow-hidden" style={{ background: theme === "dark" ? "#303030" : "#c5ccdb" }}>

      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        chats={questions}
        newChat={newChat}
        loadChat={(q) => {
          setActiveQuestionId(q._id);

          setMessages([
            { role: "user", content: q.question },
            {
              role: "assistant",
              content:
                q.status === "ai_response"
                  ? q.answer
                  : "Not answered yet.",
            },
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

        <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} />

      </div>
    </div>
  );
}
