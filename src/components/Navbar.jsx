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
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-purple-400">
          🎮 GameHub
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {/* Home */}
          <Link
            to="/"
            className="hover:text-purple-400 transition"
          >
            Home
          </Link>

          {/* If Logged In */}
          {user ? (
            <>
              <span className="text-sm text-gray-300">
                {user.email}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="hover:text-blue-400 transition"
              >
                Login
              </Link>

              {/* Signup */}
              <Link
                to="/signup"
                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
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