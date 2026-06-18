import { useRef, useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Otp() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [resendLoading, setResendLoading] = useState(false);
const [successMsg, setSuccessMsg] = useState("");

const [timer, setTimer] = useState(60);

useEffect(() => {

    if (timer <= 0) return;

    const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);

}, [timer]);
  const inputsRef = useRef([]);

  const finalOtp = otp.join("");
  useEffect(() => {
    inputsRef.current[0]?.focus();
}, []);


  const handleChange = (value, index) => {
    if (error) {
    setError("");
}
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;

    const arr = pasted.split("");
    const newOtp = [...otp];

    arr.forEach((val, i) => {
      newOtp[i] = val;
    });

    setOtp(newOtp);

    const next = arr.length < 6 ? arr.length : 5;
    inputsRef.current[next]?.focus();
  };


 async function otphandle() {

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
        setError("Please enter all 6 digits");
        return;
    }

    setError("");
    setLoading(true);

    try {

        const api = await fetch("http://task-management-app-qd5u.onrender.com/otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                otp: finalOtp
            })
        });

        const res = await api.json();

        if (res.success) {
            navigate("/login");
            return;
        }

        setError(
            res.msg ||
            "Invalid or expired OTP"
        );

    } catch (error) {

        setError(
            "Something went wrong. Please try again."
        );

    } finally {
        setLoading(false);
    }
}


async function resendotp() {
    const email = localStorage.getItem("email");

    try {
        setResendLoading(true);
        const api = await fetch("http://task-management-app-qd5u.onrender.com/resendotp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const res = await api.json();

        if (res.success) {
            setTimer(60); // timer restart
                setSuccessMsg("OTP sent successfully ✅");

    setTimeout(() => {
        setSuccessMsg("");
    }, 3000);
        }

        console.log(res);

    } catch (error) {
        console.log(
            error,
            "error aa raha hai resend otp par frontend mai"
        );
    } finally {

        setResendLoading(false);

    }
}
  

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-md p-6 sm:p-8 text-center">
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Enter OTP
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          We sent a 6-digit code to your number
        </p>
{successMsg && (
  <div
    className="
    fixed
    top-5
    right-5
    bg-green-600
    text-white
    px-5
    py-3
    rounded-xl
    shadow-xl
    animate-bounce
    z-50
    "
  >
    {successMsg}
  </div>
)}
   {/* OTP BOXES */}
        <div className="flex justify-between gap-2 sm:gap-3 w-full mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
             className={`
flex-1
min-w-0
aspect-square
text-center
text-lg
sm:text-xl
font-semibold
border
rounded-xl
outline-none
transition-all
duration-300

${error
    ? "border-red-400 bg-red-50"
    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
}
`}
            />
            
          ))}
   
        </div>
               {error && (
    <div
        className="
        mb-5
        rounded-xl
        border
        border-red-200
        bg-red-50
        px-4
        py-3
        text-sm
        font-medium
        text-red-600
        animate-[shake_.35s_ease]
        "
    >
        {error}
    </div>
)}

    <button
    disabled={loading}
    onClick={otphandle}
    className="
    w-full
    h-12
    rounded-xl
    bg-blue-600
    text-white
    font-semibold
    transition-all
    duration-300
    hover:bg-blue-700
    disabled:cursor-not-allowed
    disabled:bg-blue-500
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

            <span>
                Verifying OTP...
            </span>

        </div>
    ) : (
        "Verify OTP"
    )}
</button>

     <p className="text-sm text-gray-500 mt-4">
  Didn’t receive code?{" "}
<span
    onClick={() => {
        if (timer <= 0 && !resendLoading) {
            resendotp();
        }
    }}
    className={`font-medium transition
        ${
            timer > 0 || resendLoading
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 cursor-pointer hover:underline"
        }
    `}
>
    {resendLoading ? "Sending OTP..." : "Resend"}
</span>
</p>
         <div className="mt-4 text-sm">

    {timer > 0 ? (

        <p className="text-slate-500">

            OTP expires in

            <span className="ml-1 font-semibold text-red-500">
                {timer}s
            </span>

        </p>

    ) : (

        <p
            className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            font-medium
            text-red-600
            animate-pulse
            "
        >
            OTP expired. Please resend a new OTP.
        </p>

    )}

</div>
      </div>

    </div>
  );
}

export default Otp;