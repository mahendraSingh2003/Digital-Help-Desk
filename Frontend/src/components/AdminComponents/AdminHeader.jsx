import { useState ,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineUserCircle
} from "react-icons/hi2";

export default function AdminHeader({ theme, setTheme }) {
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove auth token
    localStorage.removeItem("admin"); // optional
    setUser(null);
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