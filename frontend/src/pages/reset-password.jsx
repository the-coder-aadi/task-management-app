import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
function Resetpass() {
  const navigate = useNavigate()
    const { token } = useParams();
    const [pass, setpass] = useState("")
    const [confirmpass, setconfirmpass] = useState("")

    async function passwordreset() {
        try {
            const api = await fetch("https://task-management-app-qd5u.onrender.com/resetpass",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({pass:pass, confirmpass:confirmpass, token:token})
            })
            const res = await api.json()
            console.log(res);
            if (res.success) {
              navigate("/login")
              return
            }
            
        } catch (error) {
            console.log(error, "error aa rha hai password reset karne pad")
        }
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-3xl">
            🔐
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Reset Password
        </h1>

        <p className="text-center text-gray-500 mt-2 text-sm">
          Enter your new password to continue
        </p>

        {/* Inputs */}
        <div className="mt-8 space-y-4">

          <input
          value={pass}
          onChange={(e)=> setpass(e.target.value)}
            type="password"
            placeholder="New Password"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition"
          />

          <input
          value={confirmpass}
          onChange={(e)=> setconfirmpass(e.target.value)}
            type="password"
            placeholder="Confirm Password"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition"
          />

        </div>

        {/* Button */}
        <button onClick={passwordreset} className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-300">
          Reset Password
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-blue-800 mt-5">
          Make sure your password is strong & secure
        </p>

      </div>
    </div>
  );
}

export default Resetpass;