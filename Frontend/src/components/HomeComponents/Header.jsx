import { useState, useEffect } from "react";
import {
  HiOutlineUserCircle
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";


export default function Header({ theme, setTheme }) {

  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [user, setUser] = useState(null); // 🔥 store logged user

  // ✅ Check if already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

 

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");   // ✅ ADD THIS
    setUser(null);
    navigate("/");
  };

  return (
    <div className="flex justify-between p-4 border-b border-gray-700 relative">

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

          {/* 🔥 IF NOT LOGGED IN → SHOW GOOGLE LOGIN */}
          {!user ? (
            <div>
              <button
                onClick={() => navigate("/login")}
                className="w-full p-2 rounded hover:bg-[#40414F] flex items-center justify-center text-white"
              >
                <HiOutlineUserCircle size={16} />
                {open && <span className="ml-2 ">Sign In</span>}
              </button>
            </div>

          ) : (
            /* 🔥 IF LOGGED IN → SHOW PROFILE IMAGE */
            <img
              src={user.picture}
              alt="profile"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-white/20 hover:border-green-400 transition"
            />
          )}

          {/* 🔥 DROPDOWN IF LOGGED IN */}
          {showProfile && user && (
            <div className="absolute right-0 top-full pt-3 z-50">
              <div className="w-72 bg-[#2F3136] rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-fadeIn">

                {/* 🔥 Profile Header */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500/10 to-transparent">
                  <img
                    src={user.picture}
                    alt="profile"
                    className="w-14 h-14 rounded-full border-2 border-green-400"
                  />
                  <div className="flex flex-col">
                    <span className="text-white font-semibold text-sm">
                      {user.username}
                    </span>
                    <span className="text-gray-400 text-xs break-all">
                      {user.email}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10" />

                {/* Info Section */}
                <div className="p-4 space-y-3 text-sm">

                  <div className="flex justify-between text-gray-400">
                    <span>Daily Limit</span>
                    <span className="text-green-400 font-medium">10</span>
                  </div>

                  <div
                    onClick={() => navigate("/profile")}
                    className="cursor-pointer px-3 py-2 rounded-lg hover:bg-white/5 transition text-gray-300 hover:text-green-400"
                  >
                    View Profile
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full mt-2 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-500 transition font-medium"
                  >
                    Logout
                  </button>

                </div>
              </div>
            </div>
          )}
        </div>

        {/* SETTINGS (UNCHANGED) */}
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