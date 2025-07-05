import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [signupError, setSignupError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError("");

    if (formData.password !== formData.confirmPassword) {
      setSignupError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      // Replace with your real signup endpoint:
      const response = await fetch("https://your-api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        navigate("/login");
      } else {
        setSignupError(data.message || "Signup failed.");
      }
    } catch (err) {
      setLoading(false);
      setSignupError("Incomplete form. Try again later.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg border border-orange-200 shadow-md">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-pink-600">
        Sign Up
      </h2>

      {signupError && (
        <div className="mb-3 text-center text-red-600 font-semibold">
          {signupError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="p-3 border-2 border-orange-300 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="p-3 border-2 border-orange-300 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <input
          name="phone"
          type="tel"
          placeholder="Phone (e.g. +92xxxxxxxxxx)"
          value={formData.phone}
          onChange={handleChange}
          className="p-3 border-2 border-orange-300 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <input
          name="username"
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="p-3 border-2 border-orange-300 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="p-3 border-2 border-orange-300 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="p-3 border-2 border-orange-300 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-pink-500 hover:bg-blue-600 text-white rounded w-full transition-colors"
        >
          {loading ? "Signing up..." : "Create Account"}
        </button>
      </form>

      <div className="mt-5 text-center text-gray-700">
        Already have an account?{" "}
        <Link to="/login">
          <span className="text-orange-500 hover:underline font-semibold">
            Login
          </span>
        </Link>
      </div>
    </div>
  );
}
