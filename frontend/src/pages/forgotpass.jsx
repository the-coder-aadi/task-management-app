import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Forgotpass() {
const [email, setemail] = useState("")
const navigate = useNavigate()
  async function forgotpass() {
    try {
      const api = await fetch("http://localhost:5000/forgotpass",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({email})
      })
      const res = await api.json()
       console.log(res)
    } catch (error) {
      console.log(error, "error aa raha hai bahi kuch forgot pass req bhejne par")
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-3xl">
            🔒
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-slate-800">
          Forgot Password?
        </h1>

        <p className="text-center text-slate-500 mt-3 leading-relaxed">
          Enter your email address and we'll send you a secure link to reset your password.
        </p>

        <div className="mt-8">
          <input
          onChange={(e)=> setemail(e.target.value)}
          value={email}
            type="email"
            placeholder="Enter your email"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
          />
        </div>

        <button
        onClick={forgotpass}
          className="w-full mt-5 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300"
        >
          Send Reset Link
        </button>

        <p onClick={()=> navigate("/login")} className="text-center mt-5 text-indigo-600 font-medium cursor-pointer hover:text-indigo-800 transition-all">
          Back to Login
        </p>

      </div>

    </div>
  );
}

export default Forgotpass;