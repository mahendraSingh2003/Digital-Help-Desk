export default function AdminMain({ draftText = "" }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 text-gray-200">

      <div
        className="
          bg-[#1f2024]
          rounded-3xl
          p-6
          mb-10
          text-gray-300
          whitespace-pre-wrap
          break-words
          min-h-[120px]
          max-h-[300px]
          overflow-y-auto
        "
      >
        {draftText ? draftText : "Draft will appear here..."}
      </div>

    </div>
  );
}
