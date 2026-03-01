import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminHeader({ theme, setTheme }) {
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // demo admin info (replace with real data if needed)
  const adminName = "Admin";
  const adminEmail = "admin@gmail.com";

  // LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove auth token
    localStorage.removeItem("admin"); // optional

    setShowProfile(false);

    navigate("/login"); // redirect to login page
  };

  return (
    <div className="flex justify-between p-4 border-b border-gray-700 relative">

      {/* TITLE */}
      <div className="text-lg font-semibold text-white">
        Admin Panel
      </div>

      <div className="flex gap-4">

        {/* PROFILE */}
        <div
          className="relative"
          onMouseEnter={() => {
            setShowProfile(true);
            setShowSettings(false);
          }}
          onMouseLeave={() => setShowProfile(false)}
        >
          <div className="bg-[#40414F] px-3 py-1 rounded cursor-pointer text-white">
            👤
          </div>

          {showProfile && (
            <div className="absolute right-0 top-full pt-2 z-50">
              <div className="bg-[#40414F] p-3 rounded min-w-[200px] text-white shadow-lg space-y-2">

                {/* ADMIN NAME */}
                <div className="font-semibold text-sm">
                  {adminName}
                </div>

                {/* EMAIL */}
                <div className="text-xs text-gray-300">
                  {adminEmail}
                </div>

                <hr className="border-gray-600" />

                {/* LOGOUT BUTTON */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-400 hover:text-red-500"
                >
                  Logout
                </button>

              </div>
            </div>
          )}
        </div>

        {/* SETTINGS */}
        <div
          className="relative"
          onMouseEnter={() => {
            setShowSettings(true);
            setShowProfile(false);
          }}
          onMouseLeave={() => setShowSettings(false)}
        >
          <div className="bg-[#40414F] px-3 py-1 rounded cursor-pointer text-white">
            ⚙️
          </div>

          {showSettings && (
            <div className="absolute right-0 top-full pt-2 z-50">
              <div className="bg-[#40414F] p-3 rounded space-y-2 min-w-[170px] text-white shadow-lg">

                <div
                  onClick={() => navigate("/QaDashboard")}
                  className="cursor-pointer hover:text-green-400"
                >
                  Q/A Requests
                </div>

                <div
                  onClick={() => navigate("/Knowledgebase")}
                  className="cursor-pointer hover:text-green-400"
                >
                  Knowledgebase
                </div>

                <div
                  onClick={() => navigate("/appointment")}
                  className="cursor-pointer hover:text-green-400"
                >
                  Appointment Sec.
                </div>

              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}