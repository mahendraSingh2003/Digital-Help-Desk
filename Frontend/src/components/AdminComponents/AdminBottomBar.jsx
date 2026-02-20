import { useState, useRef, useEffect } from "react";
import { HiOutlineMicrophone } from "react-icons/hi2";
import API from "../../api";

export default function AdminBottomBar({ refinedText, setRefinedText ,activeSession }) {
  const [loading, setLoading] = useState(null);

  const [preprocessing, setPreprocessing] = useState(false);
  const [storing, setStoring] = useState(false);

  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  // const [sessionName, setSessionName] = useState("");
  const [file, setFile] = useState(null);


  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const allChunksRef = useRef([]);

  const timerRef = useRef(null);

  const [audioURL, setAudioURL] = useState(null);


  /* ⏱ TIMER */
  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [recording]);

  /* 🎤 TOGGLE RECORDING (pause/resume style) */
  const toggleRecording = async () => {
    if (!mediaRecorderRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          allChunksRef.current.push(e.data);

          // live preview
          const blob = new Blob(allChunksRef.current, { type: "audio/wav" });
          setAudioURL(URL.createObjectURL(blob));
        }
      };

      mediaRecorder.start();
      setRecording(true);
      return;
    }

    if (mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setRecording(false);
    } else if (mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setRecording(true);
    }
  };



  /* 🚀 UPLOAD */
  const handleFileUpload = async () => {
    if (recording) return alert("Stop recording first");

    if (!file && !allChunksRef.current.length) {
      alert("Press Set/Reset Button First");
      return;
    }


    setPreprocessing(true);

    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;


    let uploadFile = file;

    if (!uploadFile) {
      const blob = new Blob(allChunksRef.current, { type: "audio/wav" });
      uploadFile = new File([blob], `${activeSession.id}.wav`);
    }

    const formData = new FormData();
    formData.append("file", uploadFile);


    try {
      const res = await API.post("/admin/preprocess", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setRefinedText(res.data.original);
      setFile(null);

      // new session starts fresh
      allChunksRef.current = [];
      setDuration(0);
      setAudioURL(null);

    } catch {
      alert("Processing failed");
    } finally {
      setPreprocessing(false);
    }
  };

  /* 💾 SAVE */
  const handleStore = async () => {
    if (!refinedText) return alert("No text");

    setStoring(true);
    setLoading("save");

    try {
      await API.post("/admin/confirm", {
        text: refinedText
      });

      setRefinedText("");
      setSessionName("");

      alert("Saved");
    } finally {
      setStoring(false);
      setLoading(null);
    }
  };

  /* 🔁 RESET */
  const handleReset = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;

    streamRef.current?.getTracks().forEach((t) => t.stop());

    allChunksRef.current = [];
    setDuration(0);
    setRefinedText("");
    setAudioURL(null);
    setFile(null);
  };



  /* 🕒 FORMAT */
  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  return (
    <div className="bg-[#303030] py-6 flex flex-col items-center gap-4">


      {/* TIMER BADGE */}
      <div className="text-sm text-green-400 ">{fmt(duration)}</div>
      {/* Filename preview */}
      {file && (
        <span className="text-xs text-gray-400 truncate max-w-[130px]">
          {file.name}
        </span>
      )}

      {audioURL && (
        <div className="w-full flex justify-center">
          <audio
            controls
            src={audioURL}
            className="w-[320px] h-8"
          />
        </div>
      )}


      <div className="flex gap-4">
        <div className="flex items-center gap-3">

          {/* Hidden native input */}
          <input
            type="file"
            id="adminFile"
            accept=".pdf,.mp3,.wav,.txt"
            disabled={recording}
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />

          {/* Styled upload button */}
          <label
            htmlFor="adminFile"
            className={`flex items-center gap-2 px-6 h-12 rounded-full text-white transition-all
  ${recording
                ? "bg-[#2a2a2a] opacity-40 cursor-not-allowed"
                : "bg-[#404045] hover:bg-[#4a4a50] cursor-pointer active:scale-95"
              }`}
          >
            📁
            <span>Select File</span>
          </label>



        </div>

        {/* MIC */}
        <button
          onClick={toggleRecording}
          className={`flex items-center gap-2 px-6 h-12 rounded-full text-white transition-all active:scale-95 ${recording
            ? "bg-red-500 hover:bg-red-600 shadow-lg"
            : "bg-[#404045] hover:bg-[#4a4a50]"
            }`}
        >
          <HiOutlineMicrophone size={22} />
          {recording ? "Pause" : "Record"}
        </button>

        {/* UPLOAD */}
        <button
          disabled={preprocessing || recording}
          onClick={handleFileUpload}
          className={`px-6 h-12 rounded-full text-white transition
  ${recording
              ? "bg-[#2a2a2a] opacity-40 cursor-not-allowed"
              : "bg-[#404045] hover:bg-[#4a4a50]"
            }`}
        >
          {preprocessing ? "Processing..." : "Upload/Process"}
        </button>


        {/* RESET */}
        <button
          disabled={recording}
          onClick={handleReset}
          className={`px-6 h-12 rounded-full text-white transition
  ${recording
              ? "bg-[#2a2a2a] opacity-40 cursor-not-allowed"
              : "bg-[#505055] hover:bg-[#5a5a60]"
            }`}
        >
          Set/Reset
        </button>

      </div>

      {/* SAVE */}
      <button
        onClick={handleStore}
        disabled={storing || recording}
        className={`px-10 h-12 rounded-full text-white transition
  ${recording
            ? "bg-[#2a2a2a] opacity-40 cursor-not-allowed"
            : "bg-[#505055] hover:bg-[#5a5a60]"
          }`}
      >
        {storing ? "Saving..." : "Save to Knowledgebase"}
      </button>

    </div>
  );
}
