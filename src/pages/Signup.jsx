import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSignup() {
    const result = signup(form);

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert("Account created!");
    navigate("/login");
  }

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="bg-white/10 backdrop-blur p-6 rounded-xl w-80">

        <h1 className="text-2xl mb-4 text-center">Sign Up</h1>

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-black/30"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-black/30"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-black/30"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-black/30"
        />

        <button
          onClick={handleSignup}
          className="w-full bg-green-500 hover:bg-green-600 p-2 rounded"
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