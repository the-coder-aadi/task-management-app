import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
function SignUp() {
    const navigate = useNavigate()
    const [loaded, setLoaded] = useState(false);
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

    if (!data.name.trim()) {
        newErrors.name = "Full name is required";
    }
    else if (data.name.trim().length < 3) {
        newErrors.name = "Name must be at least 3 characters";
    }

    if (!data.email.trim()) {
        newErrors.email = "Email is required";
    }
    else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)
    ) {
        newErrors.email = "Enter a valid email address";
    }

    if (!data.pass.trim()) {
        newErrors.pass = "Password is required";
    }
    else if (data.pass.length < 6) {
        newErrors.pass = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
}

function handleform(e) {

    const { name, value } = e.target;

    setdata({
        ...data,
        [name]: value
    });

    setErrors((prev) => ({
        ...prev,
        [name]: "",
        general: ""
    }));
}

    async function Signup() {
          if (!validateForm()) return;

    setLoading(true);
        try {
            const api = await fetch("http://task-management-app-qd5u.onrender.com/signup",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(data)
            })
            const res = await api.json()
            if (!res.success) {

    if (res.error) {

        const backendErrors = {};

        res.error.forEach((err) => {
            backendErrors[err.path] = err.msg;
        });

        setErrors(backendErrors);
    }
    else {

        setErrors({
            general: res.msg
        });
    }

    setLoading(false);
    return;
}
            if (res.success) {
              navigate("/otp")
              localStorage.setItem("email", res.email)
            }
            console.log(res)
        } catch (error) {
            console.log(error, "error aa raha hai ye signup karne par")
        }finally {
    setLoading(false);
}
    }
       function google() {
      window.location.href = "http://task-management-app-qd5u.onrender.com/auth/google"
    }
    
  return (
<div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-6 overflow-x-hidden">

  <div
    className={`w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-8
    transition-all duration-500 ease-out
    ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
  >

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Create Account
          </h1>

          <p className="text-slate-500 mt-2">
            Welcome! Create your account to continue.
          </p>
        </div>

        {/* Name */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-slate-700">
            Full Name
          </label>

          <input
          onChange={handleform}
            type="text"
            name="name"
            placeholder="Enter your full name"
         className={`w-full px-4 py-3 border rounded-xl outline-none transition
${
errors.name
? "border-red-400 bg-red-50 focus:ring-red-100"
: "border-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
}`}
          />
          {errors.name && (
    <p className="mt-2 text-sm text-red-500">
        {errors.name}
    </p>
)}
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-slate-700">
            Email Address
          </label>

          <input
          onChange={handleform}
          name="email"
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
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-slate-700">
            Password
          </label>

          <input
          onChange={handleform}
          name="pass"
            type="password"
            placeholder="Create password"
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
        "
    >
        {errors.general}
    </div>
)}

        {/* Button */}
<button
    onClick={Signup}
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
            {loading ? "Creating Account..." : "Sign Up"}
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

          <span className="text-slate-400 text-sm">
            OR
          </span>

          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* Google */}
        <button
        onClick={google}
          className="
          w-full
          border
          border-slate-300
          py-3
          rounded-xl
          hover:bg-slate-50
          font-medium
          transition
        "
        >
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-center text-slate-600 mt-8">
          Already have an account?
          <span onClick={()=>navigate("/login")} className="text-blue-600 font-semibold ml-2 cursor-pointer hover:text-blue-700">
            Login
          </span>
        </p>

      </div>

    </div>
  );
}
export default SignUp