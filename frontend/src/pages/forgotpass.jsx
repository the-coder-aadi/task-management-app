import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Forgotpass() {
  const [email, setemail] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setLoaded(true);
  }, []);

  async function forgotpass() {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setError("");

    try {
      setLoading(true);

      const api = await fetch(
        "https://task-management-app-qd5u.onrender.com/forgotpass",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const res = await api.json();

      console.log(res);

      // Email not found
      if (!res.success) {
        setError(res.msg || "Email does not exist");
        return;
      }

      // Success
      setSuccessMsg(
        "Reset link sent successfully 📩 Please check your email."
      );

      setemail("");

      setTimeout(() => {
        setSuccessMsg("");
      }, 4000);
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">

      {/* Success Popup */}
{successMsg && (
  <div
    className="
    fixed
    top-4
    right-4
    left-4
    sm:left-auto
    sm:right-5
    sm:top-5
    z-50
    animate-toastIn
    "
  >
    <div
      className="
      w-full
      sm:w-[380px]
      rounded-2xl
      border
      border-green-200
      bg-white/90
      backdrop-blur-xl
      shadow-[0_20px_50px_rgba(0,0,0,0.12)]
      p-3
      flex
      items-start
      gap-3
      "
    >
      {/* Icon */}
      <div
        className="
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-green-100
        text-green-600
        text-lg
        "
      >
        ✓
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-semibold text-slate-800">
          Reset Link Sent
        </h3>

        <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-500 break-words">
          password reset link sended to your email. Please check.
        </p>
      </div>
    </div>
  </div>
)}

      <div
        className={`w-full max-w-md bg-white rounded-3xl shadow-xl p-8
        transition-all duration-500 ease-out
        ${
          loaded
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2"
        }`}
      >
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-3xl">
            🔒
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-slate-800">
          Forgot Password?
        </h1>

        <p className="text-center text-slate-500 mt-3 leading-relaxed">
          Enter your email address and we'll send you a secure reset link.
        </p>

        {/* Input */}
        <div className="mt-8">
          <input
            onChange={(e) => {
              setemail(e.target.value);
              if (error) setError("");
            }}
            value={email}
            type="email"
            placeholder="Enter your email"
            className={`w-full border rounded-xl px-4 py-3 outline-none transition-all
            ${
              error
                ? "border-red-400 bg-red-50 focus:ring-4 focus:ring-red-100"
                : "border-slate-300 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500"
            }`}
          />

          {/* Error below input */}
          {error && (
            <p className="mt-2 text-sm text-red-500 font-medium animate-pulse">
              {error}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          disabled={loading}
          onClick={forgotpass}
          className="
          w-full
          mt-5
          bg-indigo-600
          text-white
          py-3
          rounded-xl
          font-semibold
          transition-all
          duration-300
          hover:bg-indigo-700
          disabled:bg-indigo-400
          disabled:cursor-not-allowed
          "
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div
                className="
                h-5
                w-5
                rounded-full
                border-2
                border-white/30
                border-t-white
                animate-spin
                "
              />
              <span>Sending Reset Link...</span>
            </div>
          ) : (
            "Send Reset Link"
          )}
        </button>

        {/* Back */}
        <p
          onClick={() => navigate("/login")}
          className="
          text-center
          mt-5
          text-indigo-600
          font-medium
          cursor-pointer
          hover:text-indigo-800
          transition-all
          "
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}

export default Forgotpass;