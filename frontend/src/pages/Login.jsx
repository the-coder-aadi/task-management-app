import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";

function Login() {
    const navigate = useNavigate()
    const [loaded, setLoaded] = useState(false)
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [data, setdata] = useState({
        name:"",
        email:"",
        pass:""
    })
useEffect(() => {
  setLoaded(true);
}, []);

function validateForm() {

    const newErrors = {};

    if (!data.email.trim()) {
        newErrors.email = "Email is required";
    } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)
    ) {
        newErrors.email = "Enter a valid email address";
    }

    if (!data.pass.trim()) {
        newErrors.pass = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
}

    async function loginhandle() {
        if (!validateForm()) return;
        setLoading(true);
        try {
            const api = await fetch("http://localhost:5000/login",{
                method:"POST",
                credentials:"include",
                headers:{
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(data)
            })
            const res = await api.json()
            if (!res.success) {

    // express-validator errors
    if (res.error) {
setLoading(false);
        const backendErrors = {};

        res.error.forEach((err) => {
            backendErrors[err.path] = err.msg;
        });

        setErrors(backendErrors);
        return;
    }

    // user not found / wrong password
    setErrors({
        general: res.msg,
    });

    return;
}
             console.log(res)
            if (res.success) {
                navigate("/home")
                localStorage.setItem("token", res.token)
                return
            }
           
        } catch (error) {
            console.log(error, "error aa raha hai login par")
        }finally {
        setLoading(false);
    }
    }
 function handleform(e) {

    const { name, value } = e.target;

    setdata({
        ...data,
        [name]: value,
    });

    setErrors((prev) => ({
        ...prev,
        [name]: "",
        general: "",
    }));
}
    function google() {
      window.location.href = "http://localhost:5000/auth/google"
    }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">

       <div
    className={`w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-8
    transition-all duration-500 ease-out
    ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
  >

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Welcome Back
          </h1>

          <p className="text-slate-500 mt-2">
            Login to continue to your account
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-slate-700">
            Email Address
          </label>

          <input
          name="email"
          onChange={handleform}
            type="email"
            placeholder="Enter your email"
            className={`w-full px-4 py-3 border rounded-xl outline-none transition
${
    errors.email
        ? "border-red-400 bg-red-50 focus:ring-red-100"
        : "border-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
}`}
          />
          {errors.email && (
    <p className="mt-2 text-sm text-red-500">
        {errors.email}
    </p>
)}
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-slate-700">
            Password
          </label>

          <input
          name="pass"
          onChange={handleform}
            type="password"
            placeholder="Enter your password"
           className={`w-full px-4 py-3 border rounded-xl outline-none transition
${
    errors.pass
        ? "border-red-400 bg-red-50 focus:ring-red-100"
        : "border-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
}`}
          />
          {errors.pass && (
    <p className="mt-2 text-sm text-red-500">
        {errors.pass}
    </p>
)}
        </div>

        {/* Forgot */}
        <div className="flex justify-end mb-6">
          <button onClick={()=> navigate("/forgot-pass")} className="text-sm cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
            Forgot Password?
          </button>
        </div>

        {errors.general && (
    <div
        className="
        mb-4
        rounded-2xl
        border
        border-red-200
        bg-red-50
        px-4
        py-3
        text-sm
        text-red-600
        animate-pulse
        "
    >
        {errors.general}
    </div>
)}

        {/* Button */}
 <button
    onClick={loginhandle}
    disabled={loading}
    className={`
    group
    relative
    w-full
    overflow-hidden
    rounded-xl
    py-3
    font-semibold
    text-white
    transition-all
    duration-300
    ${
        loading
            ? "bg-slate-900 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-200"
    }
    `}
>
    <div className="relative z-10 flex items-center justify-center gap-3">

        {loading && (
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
        )}

        <span>
            {loading ? "Signing You In..." : "Login"}
        </span>

    </div>

    {!loading && (
        <div
            className="
            absolute
            inset-0
            -translate-x-full
            bg-gradient-to-r
            from-transparent
            via-white/20
            to-transparent
            transition-transform
            duration-1000
            group-hover:translate-x-full
            "
        />
    )}
</button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-slate-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* Google */}
        <button onClick={google} className="w-full border border-slate-300 py-3 rounded-xl hover:bg-slate-50 font-medium transition">
          Continue with Google
        </button>

        {/* Footer */}
        <p onClick={()=> navigate("/")} className="text-center text-slate-600 mt-8">
          Don’t have an account?
          <span className="text-blue-600 font-semibold ml-2 cursor-pointer hover:text-blue-700">
            Sign Up
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;