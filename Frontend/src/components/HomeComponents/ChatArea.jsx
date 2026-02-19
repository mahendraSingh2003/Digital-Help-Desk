import MessageBubble from "./MessageBubble";

export default function ChatArea({ messages, bottomRef }) {

  return (
    <div className="flex-1 overflow-y-auto px-6 pt-6 text-white">

      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-gray-300 text-3xl font-semibold gap-3">
          👋 Welcome
          <span className="text-lg font-normal">Ask anything</span>
        </div>

      )}

      {messages.map((m, i) => (
        <MessageBubble key={i} message={m} />
      ))}

      <div ref={bottomRef} />

    </div>
  );
}
