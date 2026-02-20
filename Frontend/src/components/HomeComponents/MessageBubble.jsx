import { useState } from "react";
import {
    HiOutlineClipboard,
    HiOutlineHandThumbUp,
    HiOutlineHandThumbDown,
    HiOutlineArrowPath,
    HiOutlineEllipsisHorizontal
} from "react-icons/hi2";


import AssistantMenu from "./AssistantMenu";
import API from "../../api";

export default function MessageBubble({ message }) {
    const [open, setOpen] = useState(false);

    // USER MESSAGE
    if (message.role === "user") {
        return (
            <div className="flex justify-end mb-3">
                <div
                    className="
    bg-[#3a3a3f]
    text-gray-100
    px-4 py-2
    rounded-xl
    max-w-[70%]
    whitespace-pre-wrap
    break-all
    shadow-sm
  "
                >
                    {message.content}
                </div>

            </div>
        );
    }


    // ASSISTANT MESSAGE
    return (
        <div className="text-center mb-10">

            <div className="inline-block max-w-[80%] text-left">

                {/* Message */}
                <div className="text-gray-200 whitespace-pre-wrap break-all max-h-[60vh] overflow-y-auto pr-2">
                    {message.content}
                </div>


                {/* Action bar BELOW message */}
                <div className="flex items-center gap-4 mt-3 text-white-500">

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
                        onClick={() => handleFeedback("like")}
                    />

                    <ActionIcon
                        icon={<HiOutlineArrowPath size={18} />}
                        onClick={handleRegenerate}
                    />

                    <div className="relative">
                        <ActionIcon
                            icon={<HiOutlineEllipsisHorizontal size={20} />}
                            onClick={() => setOpen(!open)}
                        />

                        {open && (
                            <AssistantMenu
                                message={message.content}
                                onClose={() => setOpen(false)}
                            />
                        )}
                    </div>

                </div>

            </div>
        </div>
    );

    // API handlers
    async function handleFeedback(type) {
        try {
            await API.post("/chat/feedback", {
                type,
                content: message.content
            });
        } catch {
            console.log("Feedback failed");
        }
    }

    async function handleRegenerate() {
        try {
            await API.post("/chat/regenerate", {
                content: message.content
            });
        } catch {
            console.log("Regenerate failed");
        }
    }
}

function ActionIcon({ icon, onClick }) {
    return (
        <button
            onClick={onClick}
            className="hover:text-gray-300 transition"
        >
            {icon}
        </button>
    );
}
