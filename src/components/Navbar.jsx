import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">

        <Link to="/" className="text-2xl font-bold text-purple-400">
          🎮 GameHub
        </Link>

        <div className="flex items-center gap-6 text-sm">

          <Link to="/" className="hover:text-purple-400 transition">
            Home
          </Link>

          {user ? (
            <>
              <span className="text-gray-300">{user.email}</span>

              <button
                onClick={handleLogout}
                className="bg-red-500/80 hover:bg-red-600 px-4 py-1 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-400 transition">
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-green-500/80 hover:bg-green-600 px-4 py-1 rounded-lg transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}