import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }) {
    const navigate = useNavigate()
    const [isauth, setisauth] = useState(false)
    const [loading, setloading] = useState(true)

    useEffect(() => {
        accesstokenverification()
    }, [])

    async function accesstokenverification() {
        console.log("access token ke liye checking")
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                return refreshtokenverification()
            }
            const api = await fetch("http://localhost:5000/accesstokenverification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                }
            })
            const res = await api.json()
            console.log(res)
            if (res.success) {
                setisauth(true)
                setloading(false)
                return
            }
            else {

                localStorage.removeItem("token")
                return refreshtokenverification()
            }

        } catch (error) {
            console.log(error, "error aa raha hai accesstokenverification mai")
        }
    }

     async function refreshtokenverification() {
        console.log("refresh token ke liye checking")
        try {
            const api = await fetch("http://localhost:5000/refreshtokenverification", {
                method: "POST",
                credentials: "include"
            })
            const res = await api.json()
            console.log(res)
            if (res.success) {
                localStorage.setItem("token", res.token)
                accesstokenverification()
                return
            }
            else {
                setisauth(false)
                setloading(false)
                return
            }

        } catch (error) {
            console.log(error, "error aa raha hai refreshtokenverification mai");

        }
    }

    if (loading) {
        return <h1>Loading...</h1>
    }
    if (!isauth) {
        return <Navigate to="/" />
    }
    return children


}
export default ProtectedRoute