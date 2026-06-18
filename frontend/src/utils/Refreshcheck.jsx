async function Refreshtokenverification() {
    try {
        const api = await fetch(
            "http://task-management-app-qd5u.onrender.com/refreshtokenverification",
            {
                method: "POST",
                credentials: "include",
            }
        );

        const res = await api.json();

        if (res.success) {
            localStorage.setItem("token", res.token);
            return true;
        }

        return false;
    } catch (error) {
        return false;
    }
}

export default Refreshtokenverification;