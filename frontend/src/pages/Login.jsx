import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    const success = login(identifier, password);

    if (!success) {
      alert("Invalid credentials");
      return;
    }

    navigate("/");
  }

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="bg-white/10 backdrop-blur p-6 rounded-xl w-80">

        <h1 className="text-2xl mb-4 text-center">Login</h1>

        <input
          placeholder="Email or Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-black/30"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-black/30"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded"
        >
          Login
        </button>

        <p
          onClick={() => navigate("/signup")}
          className="text-sm mt-3 text-center cursor-pointer text-green-400"
        >
          Create account
        </p>
      </div>
    </div>
  );
}