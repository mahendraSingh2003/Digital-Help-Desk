import { useState, useRef, useEffect } from "react";
import {
    HiOutlineClipboard,
    HiOutlineHandThumbUp,
    HiOutlineHandThumbDown,
    HiOutlineArrowPath,
    HiOutlineEllipsisHorizontal
} from "react-icons/hi2";

import API from "../../api";

export default function MessageBubble({ message, questionId, questionText }) {
    const [open, setOpen] = useState(false);
    const [openUp, setOpenUp] = useState(false);
    const menuRef = useRef();

    // USER MESSAGE
    if (message.role === "user") {
        return (
            <div className="flex justify-end mb-3">
                <div className="bg-[#3a3a3f] text-gray-100 px-4 py-2 rounded-xl max-w-[70%] whitespace-pre-wrap break-all shadow-sm">
                    {message.content}
                </div>
            </div>
        );
    }

    // Close menu on outside click
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Detect overflow → flip menu
    useEffect(() => {
        if (!menuRef.current) return;

        const rect = menuRef.current.getBoundingClientRect();
        if (rect.bottom > window.innerHeight - 20) setOpenUp(true);
    }, [open]);

    async function handleFeedback(type) {
        try {
            await API.post("/chat/feedback", {
                type,
                content: message.content,
                questionId
            });
        } catch {
            console.log("Feedback failed");
        }
    }

    async function handleRegenerate() {
        try {
            await API.post("/chat/regenerate", {
                content: message.content,
                questionId
            });
        } catch {
            console.log("Regenerate failed");
        }
    }

    // 🔥 ASK HUMAN (Moved from Home.jsx)
    async function askHuman() {
        try {
            await API.post("/chat/ask-human", {
                _id: questionId,
                question: questionText,
                answer: message.content,
                status: "pending"
            });

            setOpen(false);
        } catch {
            alert("Ask human failed");
        }
    }

    return (
        <div className="text-center mb-10">
            <div className="inline-block max-w-[80%] text-left">

                <div className="text-gray-200 whitespace-pre-wrap break-all max-h-[60vh] overflow-y-auto pr-2">
                    {message.content}
                </div>

                <div className="flex items-center gap-4 mt-3">

                    <ActionIcon
                        icon={<HiOutlineClipboard size={18} />}
                        onClick={() => navigator.clipboard.writeText(message.content)}
                    />

                    <ActionIcon
                        icon={<HiOutlineHandThumbUp size={18} />}
                        onClick={() => handleFeedback("like")}
                    />

                    <ActionIcon
                        icon={<HiOutlineHandThumbDown size={18} />}
                        onClick={() => handleFeedback("dislike")}
                    />

                    <ActionIcon
                        icon={<HiOutlineArrowPath size={18} />}
                        onClick={handleRegenerate}
                    />

                    <div className="relative" ref={menuRef}>
                        <ActionIcon
                            icon={<HiOutlineEllipsisHorizontal size={20} />}
                            onClick={() => setOpen(p => !p)}
                        />

                        {open && (
                            <div
                                className={`absolute right-0 ${openUp ? "bottom-full mb-2" : "top-full mt-2"
                                    } bg-[#2f303a] rounded-lg shadow-xl w-48 z-30`}
                            >
                                <MenuItem label="Not satisfied" />

                                <MenuItem label="Ask Human" onClick={askHuman} />

                                <MenuItem label="Book Appointment" />

                                <MenuItem label="Raise Issue" />
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

function ActionIcon({ icon, onClick }) {
    return (
        <button onClick={onClick} className="hover:text-gray-300 transition">
            {icon}
        </button>
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