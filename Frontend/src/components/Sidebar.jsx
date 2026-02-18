export default function Sidebar({ open, setOpen, chats, newChat, loadChat }) {

  return (
   <div className={`bg-[#1f2024] text-white ${open ? "w-64" : "w-16"} p-4 shrink-0`}>


      <button onClick={() => setOpen(!open)} className="mb-4 bg-[#40414F] p-2 rounded w-full">
        {open ? "Collapse" : "☰"}
      </button>

      {open && (
        <>
          <button onClick={newChat} className="border rounded p-2 w-full mb-3 hover:bg-[#40414F]">
            + New Chat
          </button>

          {chats.map(c => (
            <div key={c.id} onClick={() => loadChat(c)}
              className="text-sm p-2 rounded truncate cursor-pointer text-gray-200 hover:bg-[#40414F]">
              {c.title}
            </div>
          ))}
        </>
      )}

    </div>
  );
}
