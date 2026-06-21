import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Resetpass() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [pass, setpass] = useState("");
  const [confirmpass, setconfirmpass] = useState("");

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setLoaded(true);
  }, []);

  function validateForm() {
    const newErrors = {};

    if (!pass.trim()) {
      newErrors.pass = "Password is required";
    } else if (pass.length < 8) {
      newErrors.pass = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/.test(pass)
    ) {
      newErrors.pass =
        "Use uppercase, lowercase, number and special character";
    }

    if (!confirmpass.trim()) {
      newErrors.confirmpass = "Confirm password is required";
    }

    if (pass && confirmpass && pass !== confirmpass) {
      newErrors.confirmpass = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function passwordreset() {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const api = await fetch(
        "https://task-management-app-qd5u.onrender.com/resetpass",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pass,
            confirmpass,
            token,
          }),
        }
      );

      const res = await api.json();

      if (!res.success) {
        if (res.error) {
          const backendErrors = {};

          res.error.forEach((err) => {
            backendErrors[err.path] = err.msg;
          });

          setErrors(backendErrors);
        } else {
          setErrors({
            general: res.msg,
          });
        }
        return;
      }

      setSuccessMsg("Password reset successfully ✅");

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (error) {
      console.log(error);

      setErrors({
        general: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-6">

      {/* Success Popup */}
      {successMsg && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-5 z-50 animate-toastIn">
          <div className="w-full sm:w-[360px] rounded-2xl border border-green-200 bg-white shadow-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              ✓
            </div>

            <div>
              <h3 className="font-semibold text-slate-800">
                Password Updated
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Your password has been changed successfully.
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className={`w-full max-w-md bg-white rounded-3xl shadow-xl p-8 transition-all duration-500 ease-out ${
          loaded
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2"
        }`}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-3xl">
            🔐
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-slate-800">
          Reset Password
        </h1>

        <p className="text-center text-slate-500 mt-2 text-sm leading-relaxed">
          Create a strong new password for your account
        </p>

        {/* Inputs */}
        <div className="mt-8 space-y-4">

          {/* Password */}
          <div>
            <input
              value={pass}
              onChange={(e) => {
                setpass(e.target.value);
                setErrors((prev) => ({ ...prev, pass: "", general: "" }));
              }}
              type="password"
              placeholder="New Password"
              className={`w-full border rounded-xl px-4 py-3 outline-none transition
              ${
                errors.pass
                  ? "border-red-400 bg-red-50 focus:ring-red-100"
                  : "border-slate-300 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
              }`}
            />

            {errors.pass && (
              <p className="mt-2 text-sm text-red-500">
                {errors.pass}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              value={confirmpass}
              onChange={(e) => {
                setconfirmpass(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  confirmpass: "",
                  general: "",
                }));
              }}
              type="password"
              placeholder="Confirm Password"
              className={`w-full border rounded-xl px-4 py-3 outline-none transition
              ${
                errors.confirmpass
                  ? "border-red-400 bg-red-50 focus:ring-red-100"
                  : "border-slate-300 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
              }`}
            />

            {errors.confirmpass && (
              <p className="mt-2 text-sm text-red-500">
                {errors.confirmpass}
              </p>
            )}
          </div>
        </div>

        {/* General backend error */}
        {errors.general && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errors.general}
          </div>
        )}

        {/* Button */}
        <button
          disabled={loading}
          onClick={passwordreset}
          className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>Resetting Password...</span>
            </div>
          ) : (
            "Reset Password"
          )}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-5 leading-relaxed">
          Make sure your password is strong and secure
        </p>
      </div>
    </div>
  );
}

export default Resetpass;