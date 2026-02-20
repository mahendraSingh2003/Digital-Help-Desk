import { useState, useEffect } from "react";
import AdminBottomBar from "../AdminComponents/AdminBottomBar";
import API from "../../api";

export default function AdminMain({ sessions, activeSession }) {

  const hasSession = sessions.length > 0;

  const [refinedText, setRefinedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* 🔹 LOAD DRAFT WHEN SESSION CHANGES */
  useEffect(() => {
    if (!activeSession?.id) return;

    setLoading(true);

    // instant restore from local cache
    const cached = localStorage.getItem(`draft-${activeSession.id}`);
    setRefinedText(cached || "");

    const fetchDraft = async () => {
      try {
        const res = await API.get(`/admin/session/${activeSession.id}`);
        const draft = res.data.draft || "";
        setRefinedText(draft);
        localStorage.setItem(`draft-${activeSession.id}`, draft);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDraft();
  }, [activeSession]);

  /* 🔹 LOCAL AUTO SAVE ONLY */
  useEffect(() => {
    if (!activeSession?.id) return;

    localStorage.setItem(`draft-${activeSession.id}`, refinedText);

  }, [refinedText, activeSession]);

  /* 🔹 MANUAL BACKEND SAVE */
  const handleSave = async () => {
    if (!activeSession?.id) return;
    console.log(activeSession.id)
    setSaving(true);

    try {
      await API.put(`/admin/session/${activeSession.id}`, {
        draft: refinedText
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 text-gray-200">

      {!hasSession && (
        <div className="h-full flex items-center justify-center text-gray-400 text-2xl">
          👋 Welcome Admin — Create a New Session to Start
        </div>
      )}

      {hasSession && activeSession && (
        <>
          {/* STATUS BAR */}
          <div className="text-sm text-gray-400 mb-2">
            {loading ? "Loading…" : saving ? "Saving…" : "Local Saved"}
          </div>

          <textarea
            value={refinedText}
            onChange={e => setRefinedText(e.target.value)}
            placeholder="Start typing your draft..."
            disabled={loading}
            className="
              w-full bg-[#1f2024] rounded-3xl p-6 mb-4 text-gray-300 resize-none
              min-h-[200px] max-h-[400px] overflow-y-auto outline-none
              focus:ring-2 focus:ring-blue-500 disabled:opacity-50
            "
          />

          {/* SAVE BUTTON */}
          <div className="flex justify-end mb-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="
                bg-[#505055] hover:bg-[#4a4a50] px-6 py-2 rounded-xl
                text-white transition disabled:opacity-50
              "
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>

          <AdminBottomBar
            refinedText={refinedText}
            setRefinedText={setRefinedText}
            activeSession={activeSession}

          />
        </>
      )}

    </div>
  );
}
