import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignup() {
    const success = signup(email, password);

    if (!success) return alert("User already exists");

    alert("Account created!");
    navigate("/login");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-gray-800 p-6 rounded-xl w-80">
        <h1 className="text-2xl mb-4 text-center">Sign Up</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-gray-700"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-gray-700"
        />

        <button
          onClick={handleSignup}
          className="w-full bg-green-600 p-2 rounded"
        >
          Sign Up
        </button>

        <p
          onClick={() => navigate("/login")}
          className="text-sm mt-3 text-center cursor-pointer text-blue-400"
        >
          Already have an account?
        </p>
      </div>
    </div>
  );
}