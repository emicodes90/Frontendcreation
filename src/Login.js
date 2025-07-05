import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ setToken }) {
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (username, password) => {
    setAuthLoading(true);
    setAuthError("");

    try {
      const response = await fetch(
        "todolist-production-9637.up.railway.app/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();
      setAuthLoading(false);

      if (data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setAuthError(data.message || "Login failed");
      }
    } catch (err) {
      setAuthLoading(false);
      setAuthError("Incomplete. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg border border-pink-200 shadow-md">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-pink-600">
        Login
      </h2>

      {authError && (
        <div className="mb-3 text-center text-red-600 font-semibold">
          {authError}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          login(username, password);
        }}
      >
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-3 border-2 border-yellow-300 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 border-2 border-yellow-300 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Password"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-yellow-500 hover:bg-pink-600 text-white rounded w-full transition-colors"
        >
          {authLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-5 text-center text-gray-700">
        Don’t have an account?{" "}
        <Link to="/signup">
          <span className="text-blue-500 hover:underline font-semibold">
            Signup
          </span>
        </Link>
      </div>
    </div>
  );
}
