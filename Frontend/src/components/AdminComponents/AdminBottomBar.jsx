import { useState, useRef } from "react";
import API from "../../api";

export default function AdminBottomBar() {
  const [loading, setLoading] = useState(null);

  const [file, setFile] = useState(null);
  const [refinedText, setRefinedText] = useState("");

  const [preprocessing, setPreprocessing] = useState(false);
  const [storing, setStoring] = useState(false);

  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [recording, setRecording] = useState(false);

  // 🎤 START MIC
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });

        const audioFile = new File([audioBlob], "mic-audio.wav", {
          type: "audio/wav",
        });

        setFile(audioFile);

        // Close mic completely
        streamRef.current.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      alert("Microphone access denied");
    }
  };

  // ⏹ STOP MIC
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // 🚀 UPLOAD & PREPROCESS
  const handleFileUpload = async () => {
    if (!file) {
      alert("Please record or select a file first");
      return;
    }

    setPreprocessing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await API.post("/admin/preprocess", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setRefinedText(response.data.original);
    } catch (error) {
      alert("Error preprocessing file");
    } finally {
      setPreprocessing(false);
    }
  };

  // 💾 SAVE TO KNOWLEDGE BASE
  const handleStore = async () => {
    if (!refinedText) {
      alert("No text to store");
      return;
    }

    setStoring(true);
    setLoading("save");

    try {
      await API.post("/admin/confirm", { text: refinedText });

      alert("Text stored successfully!");
      setRefinedText("");
      setFile(null);
    } catch (error) {
      alert("Error storing text");
    } finally {
      setStoring(false);
      setLoading(null);
    }
  };

  return (
    <div className="bg-[#303030] py-6 flex flex-col items-center gap-4">

      <div className="flex gap-4">

        {/* 🎤 MIC BUTTON */}
        {!recording ? (
          <button
            onClick={startRecording}
            className="bg-white px-5 py-2 rounded-full hover:bg-gray-200"
          >
            🎤 Start Mic
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600"
          >
            ⏹ Stop Mic
          </button>
        )}

        {/* 🚀 UPLOAD BUTTON */}
        <button
          onClick={handleFileUpload}
          disabled={preprocessing}
          className="bg-white px-5 py-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
        >
          {preprocessing ? "Processing..." : "🚀 Upload & Process"}
        </button>
      </div>

      {/* 💾 SAVE BUTTON */}
      <button
           onClick={handleStore}
          disabled={preprocessing}
          className="bg-white px-5 py-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
        >
          {preprocessing ? "Processing..." : "SAVE TO KNOWLEDGEBASE"}
        </button>
    </div>
  );
}

