import { useEffect, useState, useRef } from "react";
import { HiOutlineEllipsisVertical } from "react-icons/hi2";
import { FiSearch } from "react-icons/fi";
// import API from "../api"; // your axios instance

export default function QaDashboard() {

    const [questions, setQuestions] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [searchTag, setSearchTag] = useState("");
    const [openMenu, setOpenMenu] = useState(null);

    const [activeQ, setActiveQ] = useState(null);
    const [mode, setMode] = useState("view"); // view | edit | reply
    const [editText, setEditText] = useState("");
    const [humanReply, setHumanReply] = useState("");

    /* ---------------- DEMO DATA ---------------- */
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
        {
            _id: "3",
            question: "How to upload files in React?",
            answer: "Using FormData and input type file.",
            status: "human_response",
        },
        {
            _id: "4",
            question: "Difference between useState and useEffect",
            answer: "useState manages state, useEffect handles side effects.",
            status: "pending",
        },
        {
            _id: "5",
            question: "MongoDB aggregation example",
            answer: "Aggregation pipelines process documents through stages.",
            status: "ai_response",
        },
        {
            _id: "6",
            question: "Express middleware explanation",
            answer: "Middleware functions run between request and response.",
            status: "human_response",
        },
    ];

    /* ---------------- FETCH QUESTIONS ---------------- */
    const fetchQuestions = async () => {
        try {
            // const res = await API.get("/qa");
            // setQuestions(res.data);
            // setFiltered(res.data);

            // DEMO MODE
            setQuestions(demoQuestions);
            setFiltered(demoQuestions);

        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    /* ---------------- SEARCH ---------------- */
    useEffect(() => {
        if (!searchTag) setFiltered(questions);
        else setFiltered(
            questions.filter(q =>
                q.status.toLowerCase().includes(searchTag.toLowerCase())
            )
        );
    }, [searchTag, questions]);

    /* ---------------- DELETE QUESTION ---------------- */
    const handleDelete = async (id) => {
        try {
            // await API.delete(`/qa/${id}`);
            // fetchQuestions();

            // DEMO UPDATE
            const updated = questions.filter(q => q._id !== id);
            setQuestions(updated);
            setFiltered(updated);
            if (activeQ?._id === id) setActiveQ(null);

        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    /* ---------------- EDIT QUESTION ---------------- */
    const handleEditSave = async () => {
        try {
            // await API.put(`/qa/${activeQ._id}`, {
            //     question: editText,
            // });
            // fetchQuestions();

            // DEMO UPDATE
            const updated = questions.map(q =>
                q._id === activeQ._id
                    ? { ...q, answer: editText }
                    : q
            );

            setQuestions(updated);
            setFiltered(updated);
            setActiveQ({ ...activeQ, answer: editText });
            setMode("view");

        } catch (err) {
            console.error("Edit error:", err);
        }
    };

    /* ---------------- HUMAN REPLY ---------------- */
    const handleHumanReply = async () => {
        try {
            // await API.put(`/qa/${activeQ._id}/reply`, {
            //     human_reply: humanReply,
            //     status: "human_response",
            // });
            // fetchQuestions();

            // DEMO UPDATE
            const updated = questions.map(q =>
                q._id === activeQ._id
                    ? { ...q, answer: humanReply, status: "human_response" }
                    : q
            );

            setQuestions(updated);
            setFiltered(updated);
            setActiveQ({ ...activeQ, answer: humanReply, status: "human_response" });
            setHumanReply("");
            setMode("view");

        } catch (err) {
            console.error("Reply error:", err);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-[#303030] text-white overflow-hidden">
            {/* HEADER */}
            <div className="h-11 flex items-center justify-between px-6 border-b border-gray-700 bg-[#303030] sticky top-0 z-50">

                {/* Back to Home */}
                < button
                    onClick={() => window.history.back()
                    }
                    className="text-sm text-gray-300 hover:text-white"
                >
                    ← Back to Panel
                </button >

                {/* Title */}
                < div className="text-lg font-semibold flex gap-2  items-center text-gray-100" >
                    Q/A Dashboard
                </div >

                {/* Spacer for center alignment */}
                < div className="w-10" ></div >
            </div >

            <div className="flex-1 p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 overflow-hidden">

                {/* LEFT PANEL */}
                <div className="md:col-span-1 space-y-4 overflow-y-auto pr-2">

                    <div className="flex items-center bg-[#3d3d3d] rounded-xl px-4 py-3">
                        <select
                            value={searchTag}
                            onChange={(e) => setSearchTag(e.target.value)}
                            className="bg-[#3d3d3d] text-white text-sm outline-none flex-1 cursor-pointer appearance-none"
                        >
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="ai_response">AI</option>
                            <option value="human_response">Human</option>
                        </select>
                        <FiSearch />
                    </div>

                    {filtered.map(q => (
                        <div key={q._id} className="bg-[#3a3a3a] p-4 rounded-xl flex justify-between">

                            <div
                                onClick={() => {
                                    setActiveQ(q);
                                    setMode("view");
                                    setOpenMenu(null);
                                }}
                                className="cursor-pointer"
                            >
                                <p className="text-sm">{q.question}</p>
                                <p className="text-xs text-gray-400">{q.status}</p>
                            </div>

                        </div>
                    ))}
                </div>

                {/* RIGHT PANEL */}
                <div className="md:col-span-2 bg-[#3a3a3a] rounded-xl p-4 md:p-6 flex flex-col justify-between overflow-y-auto">

                    <div>
                        {!activeQ && <p>Select a question</p>}

                        {activeQ && mode === "view" && (
                            <>
                                <h2 className="mb-4 text-lg">Question</h2>
                                <p className="mb-4">{activeQ.question}</p>

                                <p className="text-sm text-gray-300">
                                    Answer:
                                </p>

                                <p className="mt-1">{activeQ.answer || "No answer yet."}</p>
                                <p className="mt-3 text-sm text-gray-400">
                                    Status: {activeQ.status}
                                </p>
                            </>
                        )}

                        {activeQ && mode === "edit" && (
                            <>
                                <h2 className="mb-4 text-lg">Edit Question</h2>
                                <textarea
                                    rows={6}
                                    className="w-full bg-[#2c2c2c] p-3 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                />

                                <button
                                    onClick={handleEditSave}
                                    className="mt-4 bg-blue-600 px-4 py-2 rounded"
                                >
                                    Save
                                </button>
                            </>
                        )}

                        {activeQ && mode === "reply" && (
                            <>
                                <h2 className="mb-4 text-lg">Human Reply</h2>
                                <textarea
                                    rows={6}
                                    className="w-full bg-[#2c2c2c] p-3 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={humanReply}
                                    onChange={(e) => setHumanReply(e.target.value)}
                                />

                                <button
                                    onClick={handleHumanReply}
                                    className="mt-4 bg-blue-600 px-4 py-2 rounded"
                                >
                                    Submit
                                </button>
                            </>
                        )}
                    </div>

                    {/* ACTION BUTTONS */}
                    {activeQ && mode === "view" && (
                        <div className="flex justify-end gap-4 mt-6 border-t border-gray-600 pt-4">

                            <button
                                onClick={() => {
                                    setEditText(activeQ.answer || "");
                                    setMode("edit");
                                }}
                                className="bg-gray-600 px-4 py-2 rounded"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => setMode("reply")}
                                className="bg-gray-600 px-4 py-2 rounded"
                            >
                                Human Reply
                            </button>
                            <button
                                onClick={() => setMode("makepublic")}
                                className="bg-gray-600 px-4 py-2 rounded"
                            >
                                Make Public
                            </button>

                            <button
                                onClick={() => handleDelete(activeQ._id)}
                                className="bg-red-600 px-4 py-2 rounded"
                            >
                                Delete
                            </button>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}