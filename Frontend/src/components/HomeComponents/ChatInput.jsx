import { useRef, useEffect } from "react";
import { HiOutlineMicrophone } from "react-icons/hi2";

export default function ChatInput({ input, setInput, sendMessage }) {

  const ref = useRef(null);

  // 🔥 RESET textarea height when input clears
  useEffect(() => {
    if (input === "" && ref.current) {
      ref.current.style.height = "25px";
    }
  }, [input]);

  const handleVoiceInput = () => {
    console.log("Voice button clicked");
  };

  return (
    <div className="p-6 border-t border-[#3f4046]">

      <div className="max-w-[620px] mx-auto">

        <div className="relative bg-[#303033] px-4 py-3 border border-[#3f4046] rounded-2xl">

          <textarea
            ref={ref}
            value={input}
            rows={1}
            onChange={(e) => {
              setInput(e.target.value);

              ref.current.style.height = "25px";
              ref.current.style.height =
                Math.min(ref.current.scrollHeight, 160) + "px";
            }}

            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}

            className="w-full bg-transparent outline-none text-gray-100 resize-none pr-20"
            placeholder="Ask anything"
          />

          <div className="absolute right-4 bottom-2 flex gap-3">

            <button
              type="button"
              onClick={handleVoiceInput}
              className="flex items-center justify-center w-8 h-8 rounded-full 
  bg-[#404045] hover:bg-[#4a4a50] text-white transition"
            >
              <HiOutlineMicrophone size={20} className="text-white" />
            </button>


            {input.trim() && (
              <button
                onClick={sendMessage}
                className="bg-white text-black w-7 h-7 rounded-full"
              >
                ➤
              </button>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
