import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ theme, setTheme }) {

  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex justify-between p-4 border-b border-gray-700 relative">

      {/* TITLE */}
      <div className="text-lg font-semibold text-white">
        Digital Help Desk
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
              <div className="bg-[#40414F] p-3 rounded space-y-1 min-w-[150px] text-white shadow-lg">

                <div
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer hover:text-green-400"
                >
                  Profile
                </div>

                <div>Email</div>
                <div>Daily Limit</div>

                <div className="cursor-pointer hover:text-red-400">
                  Logout
                </div>

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
              <div className="bg-[#40414F] p-3 rounded space-y-1 min-w-[170px] text-white shadow-lg">

                <div
                  onClick={() => navigate("/settings")}
                  className="cursor-pointer hover:text-green-400"
                >
                  Q/A Interface
                </div>

                <div
                  onClick={() => navigate("/appointment")}
                  className="cursor-pointer hover:text-green-400"
                >
                  Book Appointment
                </div>

                <hr className="border-gray-600 my-2" />

                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-full border border-gray-500 rounded p-1"
                >
                  {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
                </button>

              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
