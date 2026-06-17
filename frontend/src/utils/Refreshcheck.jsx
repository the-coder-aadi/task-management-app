async function Refreshtokenverification() {
    try {
        const api = await fetch(
            "http://localhost:5000/refreshtokenverification",
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