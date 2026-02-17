import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-[#2f3037] text-white p-10">
      <button onClick={() => navigate("/")}>← Back</button>
      <h1 className="text-2xl mt-6">Profile Page</h1>
    </div>
  );
}
