import { useState, useRef, useEffect } from "react";
import {
    HiOutlineEllipsisVertical,
    HiOutlinePlus,
    HiOutlineBookOpen
} from "react-icons/hi2";
// import API from "../../api";

export default function KnowledgeBase() {
    const [docs, setDocs] = useState([]);
    const [openMenu, setOpenMenu] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const fileRef = useRef();
    const menuRef = useRef(null);

    /* CLOSE MENU ON OUTSIDE CLICK */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.addEventListener("mousedown", handleClickOutside);
    }, []);

    /* ADD FILE */
    const addFile = (file) => {
        setDocs((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                title: file.name,
                file,
                fileName: file.name,
                size: (file.size / 1024).toFixed(1),
                saved: false,
            },
        ]);
    };

    /* FILE PICKER */
    const handleFile = (e) => {
        Array.from(e.target.files).forEach(addFile);
        e.target.value = null;
    };

    /* DRAG DROP MULTIPLE */
    const handleDrop = (e) => {
        e.preventDefault();
        Array.from(e.dataTransfer.files).forEach(addFile);
    };

    /* SAVE SINGLE DOCUMENT (UPLOAD) */
    const saveDoc = async (doc) => {
        try {
            const form = new FormData();
            form.append("document_id", doc.id);
            form.append("title", doc.title);
            form.append("file", doc.file);

            //   await API.post("/admin/knowledge/upload", form);

            setDocs((d) =>
                d.map((x) =>
                    x.id === doc.id ? { ...x, saved: true } : x
                )
            );

            setOpenMenu(null);
        } catch (err) {
            console.error(err);
        }
    };

    /* DISABLE DOCUMENT (DELETE BACKEND) */
    const disableDoc = async (doc) => {
        try {
            //   await API.post("/admin/knowledge/delete", {
            //     document_id: doc.id,
            //   });

            setDocs((d) =>
                d.map((x) =>
                    x.id === doc.id ? { ...x, saved: false } : x
                )
            );

            setOpenMenu(null);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-[#303030]">
            {/* HEADER */}
            <div className="h-11 flex items-center justify-between px-6 border-b border-gray-700">

                {/* Back to Home */}
                <button
                    onClick={() => window.history.back()}
                    className="text-sm text-gray-300 hover:text-white"
                >
                    ← Back to Panel
                </button>

                {/* Title */}
                <div className="text-lg font-semibold flex gap-2  items-center text-gray-100">
                  <HiOutlineBookOpen size={18} />  KnowledgeBase 
                </div>

                {/* Spacer for center alignment */}
                <div className="w-10"></div>
            </div>
            {/* CONTENT */}
            <div
                className="flex-1 overflow-y-auto text-gray-200 p-6 relative"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >

                <div className="space-y-4">
                    {docs.map((doc) => (
                        <div
                            key={doc.id}
                            className="bg-[#1f2024] rounded-2xl px-6 py-4 relative shadow-lg hover:bg-[#26272c] transition"
                        >
                            <div className="flex items-center justify-between">

                                {editingId === doc.id ? (
                                    <input
                                        value={doc.title}
                                        onChange={(e) =>
                                            setDocs((d) =>
                                                d.map((x) =>
                                                    x.id === doc.id
                                                        ? { ...x, title: e.target.value }
                                                        : x
                                                )
                                            )
                                        }
                                        onBlur={() => setEditingId(null)}
                                        autoFocus
                                        className="bg-transparent outline-none"
                                    />
                                ) : (
                                    <span>{doc.title}</span>
                                )}

                                <div className="mr-10 text-sm text-right flex items-center gap-3">
                                    <div>{doc.fileName}</div>
                                    <div>{doc.size} KB</div>

                                    <div className="text-xs mt-1">
                                        {doc.saved ? (
                                            <span className="text-green-400">Saved</span>
                                        ) : (
                                            <span className="text-yellow-400">Not Saved</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* MENU BUTTON */}
                            <button
                                className="absolute top-5 right-4"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={() =>
                                    setOpenMenu(openMenu === doc.id ? null : doc.id)
                                }
                            >
                                <HiOutlineEllipsisVertical size={20} />
                            </button>

                            {/* DROPDOWN */}
                            {openMenu === doc.id && (
                                <div
                                    ref={menuRef}
                                    className="absolute right-4 top-10 bg-[#2a2b30] rounded-xl overflow-hidden z-50"
                                >
                                    <button
                                        onClick={() => {
                                            setEditingId(doc.id);
                                            setOpenMenu(null);
                                        }}
                                        className="block px-5 py-2 hover:bg-[#34353b] w-full text-left"
                                    >
                                        Rename
                                    </button>

                                    {!doc.saved ? (
                                        <button
                                            onClick={() => saveDoc(doc)}
                                            className="block px-5 py-2 hover:bg-[#34353b] w-full text-left text-green-400"
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => disableDoc(doc)}
                                            className="block px-5 py-2 hover:bg-[#34353b] w-full text-left text-orange-400"
                                        >
                                            Disable
                                        </button>
                                    )}

                                    <button
                                        onClick={() => {
                                            setDocs((d) => d.filter((x) => x.id !== doc.id));
                                            setOpenMenu(null);
                                        }}
                                        className="block px-5 py-2 text-red-400 hover:bg-[#34353b] w-full text-left"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* FILE INPUT */}
                <input
                    ref={fileRef}
                    hidden
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFile}
                />

                {/* FLOATING ADD BUTTON */}
                <button
                    onClick={() => fileRef.current.click()}
                    className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-black flex items-center justify-center hover:bg-[#1f2024]"
                >
                    <HiOutlinePlus size={28} />
                </button>
            </div>
        </div>
    );
}