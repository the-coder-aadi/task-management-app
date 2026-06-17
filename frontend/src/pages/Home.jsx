import {
    FiLogOut,
    FiPlus,
    FiSearch,
    FiCheckCircle,
    FiClock,
    FiAlertCircle,
    FiMenu,
    FiChevronLeft,
    FiChevronRight,
    FiCalendar,
    FiFlag,
    FiTag,
    FiLayers,
    FiChevronDown
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Refreshtokenverification from "../utils/Refreshcheck";

function Home() {
    const navigate = useNavigate();
    const [taskpopup, settaskpop] = useState(false);
    const [alltasks, setalltasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showAllTasks, setShowAllTasks] = useState(false);
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [selectedCategory, setSelectedCategory] = useState("");
    const [status, setstatus] = useState("")
    const [priority, setpriority] = useState("")
    const [menutoggle, setmenutoggle] = useState(false)
const [openSection, setOpenSection] = useState(null);
const [taskaddedmsg, settaskaddedmsg] = useState(false)
const location = useLocation();

const [taskDeletedMsg, setTaskDeletedMsg] = useState(false);
const [deletedTaskName, setDeletedTaskName] = useState("");
const [logoutPop, setLogoutPop] = useState(false);


useEffect(() => {
    if (location.state?.deletedTask) {

        setDeletedTaskName(location.state.deletedTask);
        setTaskDeletedMsg(true);

        window.history.replaceState({}, document.title);

        setTimeout(() => {
            setTaskDeletedMsg(false);
        }, 3000);
    }
}, [location]);


 const filteredTasks = alltasks.filter((task) => {

    const searchMatch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

    const categoryMatch =
        selectedCategory === "" ||
        task.category === selectedCategory;

         const statusmatch =
        status === "" ||
        task.status === status;

                 const prioritymatch =
        priority === "" ||
        task.priority === priority;

    return searchMatch && categoryMatch && statusmatch && prioritymatch;
});

    const displayedTasks = showAllTasks ? filteredTasks : filteredTasks.slice(0, 4);

    const [taskinfo, settaskinfo] = useState({
        title: "",
        description: "",
        priority: "",
        status: "",
        duedate: "",
        category: "",
    });

    useEffect(() => {
        if (taskpopup) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [taskpopup]);

    useEffect(() => {
    if (menutoggle) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }

    return () => {
        document.body.style.overflow = "auto";
    };
}, [menutoggle]);

    useEffect(() => {
        gettasks();
    }, []);

async function logout() {
    try {

        const api = await fetch(
            "http://localhost:5000/logout",
            {
                method: "POST",
                credentials: "include",
            }
        );

        const res = await api.json();

        if (res.success) {

            localStorage.removeItem("token");

            setLogoutPop(false);

            navigate("/login");
            return
        }

    } catch (error) {
        console.log(error);
    }
} 
    function taskhandle(e) {
        settaskinfo({ ...taskinfo, [e.target.name]: e.target.value });
    }

    async function createtask() {
        try {
            const token = localStorage.getItem("token");
            const api = await fetch("http://localhost:5000/createtask", {
                method: "POST",
                headers: { "Content-Type": "application/json", authorization: token },
                body: JSON.stringify(taskinfo),
            });
            if (api.status === 401) {
                const refreshed = await Refreshtokenverification();
                if (!refreshed) {
    navigate("/login");
    return;
}
         return createtask();
          
            }
            const res = await api.json();
            if (res.success) {
                gettasks();
                settaskpop(false);

 setTimeout(() => {

        settaskaddedmsg(true);

        setTimeout(() => {
            settaskaddedmsg(false);
        }, 4000);

    }, 250);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // async function refreshtokenverification() {
    //     try {
    //         const api = await fetch("http://localhost:5000/refreshtokenverification", {
    //             method: "POST",
    //             credentials: "include",
    //         });
    //         const res = await api.json();
    //         if (res.success) {
    //             localStorage.setItem("token", res.token);
    //             return true;
    //         }
    //         navigate("/login");
    //         return false;
    //     } catch (error) {
    //         navigate("/login");
    //         return false;
    //     }
    // }

    async function gettasks() {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const api = await fetch("http://localhost:5000/gettasks", {
                method: "POST",
                headers: { authorization: token },
            });
            if (api.status === 401) {
                const refreshed = await refreshtokenverification();
                if (refreshed) return gettasks();
                return;
            }
            const res = await api.json();
            if (res.success) setalltasks(res.tasks);
        } catch (error) {
            console.log(error);
        }finally {
        setLoading(false);
    }
    }

    function getDaysLeft(date) {
        const today = new Date();
        const due = new Date(date);
        const diff = due - today;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days < 0) return { label: "Overdue", color: "text-red-500" };
        if (days === 0) return { label: "Due Today", color: "text-orange-500" };
        if (days === 1) return { label: "1 Day Left", color: "text-yellow-600" };
        return { label: `${days} Days Left`, color: "text-slate-400" };
    }

    const completedTasks = alltasks.filter((t) => t.status.toLowerCase() === "completed").length;
    const pendingTasks = alltasks.filter((t) => t.status.toLowerCase() === "pending").length;
    const highPriorityTasks = alltasks.filter((t) => t.priority.toLowerCase() === "high").length;
    const totalTasks = alltasks.length;
    const username = localStorage.getItem("username") || "";

    useEffect(() => {
        findusername();
    }, []);

    async function findusername() {
        try {
            const api = await fetch("http://localhost:5000/me", {
                method: "POST",
                credentials: "include",
            });
            const res = await api.json();
            if (res.success) localStorage.setItem("username", res.username);
            else localStorage.setItem("username", "");
        } catch (error) {
            console.log(error);
        }
    }

    // ── Calendar Logic ─────────────────────────────────────────
    const taskDueDates = alltasks.map((t) => {
        const d = new Date(t.duedate);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    });

    function buildCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const cells = [];
        for (let i = 0; i < firstDay; i++) cells.push(null);
        for (let d = 1; d <= daysInMonth; d++) cells.push(d);
        return { cells, year, month };
    }

    const { cells, year, month } = buildCalendar(calendarDate);
    const monthNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December",
    ];
    const dayNames = ["Su","Mo","Tu","We","Th","Fr","Sa"];

    function isToday(d) {
        const t = new Date();
        return d === t.getDate() && month === t.getMonth() && year === t.getFullYear();
    }

    function hasTask(d) {
        return taskDueDates.includes(`${year}-${month}-${d}`);
    }

    const priorityConfig = {
        high: { border: "border-l-red-500", badge: "bg-red-50 text-red-600 ring-1 ring-red-200", dot: "bg-red-500" },
        medium: { border: "border-l-amber-400", badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", dot: "bg-amber-400" },
        low: { border: "border-l-emerald-500", badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
    };

    const statusConfig = {
        completed: "bg-green-100 text-green-700",
        pending: "bg-yellow-100 text-yellow-700",
        inprogress: "bg-blue-100 text-blue-700",
    };

    const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const showSidebarCards = displayedTasks.length >= 6;

    const hour = new Date().getHours();

let greeting = "Good Night";

if (hour >= 5 && hour < 12) {
    greeting = "Good Morning";
}
else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
}
else if (hour >= 17 && hour < 21) {
    greeting = "Good Evening";
}
else {
    greeting = "Good Night";
}


if (loading) {
    return (
        <div className="min-h-screen bg-[#f8f9fc] animate-pulse">

            {/* Navbar */}
            <div className="h-16 bg-white border-b border-slate-200 flex items-center px-8">
                <div className="h-10 w-10 rounded-xl bg-slate-200"></div>
                <div className="ml-3">
                    <div className="h-4 w-24 bg-slate-200 rounded"></div>
                    <div className="h-3 w-16 bg-slate-100 rounded mt-2"></div>
                </div>
            </div>

            <div className="max-w-screen-2xl mx-auto p-8">

                {/* Hero */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="h-10 w-72 bg-slate-200 rounded-xl"></div>
                        <div className="h-4 w-48 bg-slate-100 rounded mt-3"></div>
                    </div>

                    <div className="h-12 w-36 bg-slate-200 rounded-2xl"></div>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    {[1,2,3,4].map((item) => (
                        <div
                            key={item}
                            className="bg-white  rounded-2xl p-5 shadow-sm"
                        >
                            <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
                            <div className="h-8 w-16 bg-slate-200 rounded mt-4"></div>
                            <div className="h-4 w-24 bg-slate-100 rounded mt-2"></div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col xl:flex-row gap-6">

                    {/* Tasks */}
                    <div className="flex-1">
                        <div className="h-12 w-full bg-white rounded-2xl mb-5"></div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {[1,2,3,4,5,6].map((item) => (
                                <div
                                    key={item}
                                    className="bg-white rounded-2xl p-5 h-52"
                                >
                                    <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                                    <div className="h-5 w-40 bg-slate-200 rounded mt-4"></div>
                                    <div className="h-4 w-full bg-slate-100 rounded mt-3"></div>
                                    <div className="h-4 w-3/4 bg-slate-100 rounded mt-2"></div>

                                    <div className="flex justify-between mt-8">
                                        <div className="h-4 w-24 bg-slate-100 rounded"></div>
                                        <div className="h-8 w-20 bg-slate-200 rounded-xl"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full xl:w-[320px] space-y-5">
                        <div className="bg-white rounded-2xl h-[320px]"></div>
                        <div className="bg-white rounded-2xl h-[250px]"></div>
                        <div className="bg-white rounded-2xl h-[250px]"></div>
                    </div>
                </div>
            </div>
        </div>
    );

}

const categories = [...new Set(alltasks.map(task => task.category))];


    return (
        <div className="min-h-screen bg-[#f8f9fc]">

            {/* ── NAVBAR ─────────────────────────────────────────── */}
            <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl shadow-sm">
                <div className="mx-auto max-w-screen-2xl px-5 sm:px-10">
                    <div className="flex h-16 sm:h-[68px] items-center justify-between">

                        <div className="flex items-center gap-3">
                          <button
    onClick={() => {
        setmenutoggle(true)
         setOpenSection("")
    }}
    className="flex md:hidden items-center justify-center rounded-xl p-2 text-slate-600 hover:bg-slate-100 transition"
>
    <FiMenu size={23} />
</button>
                        <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffaa22] to-[#bf7600] text-white font-bold text-lg shadow-md shadow-blue-200">
                                T
                            </div>
                            <div className="hidden md:block">
                                <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">TaskForge</h1>
                                <p className="text-xs text-slate-400 font-medium">Task Management</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 cursor-pointer hover:border-slate-300 transition">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                                    {username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    {username.includes(" ") ? (
                                        <>
                                            <p className="text-sm font-semibold text-slate-800 leading-tight">{username.split(" ")[0]}</p>
                                            <p className="text-xs text-slate-400">{username.split(" ").slice(1).join(" ")}</p>
                                        </>
                                    ) : (
                                        <p className="text-sm font-semibold text-slate-800">{username}</p>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => setLogoutPop(true)}
                                className="hidden md:flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm text-white font-medium transition-all hover:bg-slate-700 hover:shadow-lg"
                            >
                                <FiLogOut size={15} />
                                Logout
                            </button>

                            <div className="flex h-9 w-9 md:hidden items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm">
                                {username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-12 py-8">

                {/* ── HERO ───────────────────────────────────────── */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                       
                      <h2 className="text-[28px] sm:text-4xl font-bold text-blue-900">
  {greeting},{" "}
  <span className="bg-gradient-to-r from-[#ff3333] to-[#ff1c91] bg-clip-text text-transparent">
    {username.split(" ")[0]}
  </span>{" "}
  👋
</h2>
                        <p className="mt-1.5 text-slate-500 text-[14px] sm:text-[16px]">
                            Here's what's on your plate today.
                        </p>
                    </div>

                    <button
                        onClick={() => settaskpop(true)}
                        className="flex w-full will-change-transform sm:w-auto items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 hover:scale-[1.02]"
                    >
                        <FiPlus size={18} />
                        New Task
                    </button>
                </div>

                {/* ── STAT CARDS ─────────────────────────────────── */}
                <div className="mb-8 grid gap-4 grid-cols-1 min-[450px]:grid-cols-2 md:grid-cols-4">
                    {[
                        { icon: <FiCheckCircle className="text-emerald-500" size={22} />, value: completedTasks, label: "Completed", accent: "bg-emerald-50", bar: "bg-emerald-400" },
                        { icon: <FiClock className="text-amber-500" size={22} />, value: pendingTasks, label: "Pending", accent: "bg-amber-50", bar: "bg-amber-400" },
                        { icon: <FiAlertCircle className="text-red-500" size={22} />, value: highPriorityTasks, label: "High Priority", accent: "bg-red-50", bar: "bg-red-400" },
                        { icon: <FiLayers className="text-blue-500" size={22} />, value: totalTasks, label: "Total Tasks", accent: "bg-blue-50", bar: "bg-blue-500" },
                    ].map((s, i) => (
                        <div key={i} className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300">
                            <div className={`mb-4 inline-flex rounded-xl p-2.5 ${s.accent}`}>
                                {s.icon}
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900">{s.value}</h3>
                            <p className="text-slate-500 text-sm mt-0.5">{s.label}</p>
                            <div className="mt-3 h-1 rounded-full bg-slate-100">
                                <div
                                    className={`h-1 rounded-full ${s.bar} transition-all duration-700`}
                                    style={{ width: totalTasks > 0 ? `${(s.value / totalTasks) * 100}%` : "0%" }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── MAIN LAYOUT ────────────────────────────────── */}
                <div className="flex flex-col mt-14 xl:flex-row gap-6">

                    {/* LEFT — Tasks */}
                    <div className="flex-1 min-w-0">

                        {/* Search + Header */}
                     {/* Search + Filters */}
<div id="tasks-section" className="mb-5 flex flex-col gap-3" >

    <div className="flex flex-col md:flex-row md:items-center gap-3">

        {/* Search */}
        <div className="relative flex-1 md:max-w-sm">
            <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
            />
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search tasks..."
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
            />
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:flex items-center gap-3">

      <div className="relative">
    <select
        value={status}
        onChange={(e)=> setstatus(e.target.value)}
        className="appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
    >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="inprogress">In Progress</option>
        <option value="completed">Completed</option>
    </select>

    <FiChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
    />
</div>

  <div className="relative">
            <select
            value={priority}
            onChange={(e)=> setpriority(e.target.value)}
                className="appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
                <option value="">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>
              <FiChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
    />
    </div>

 <div className="relative">
<select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
>
    <option value="">All Categories</option>

    {categories.map((category) => (
        <option key={category} value={category}>
            {category}
        </option>
    ))}
</select>
        <FiChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
    />
</div>

        </div>

    </div>

    {/* Header */}
    <div  className="flex items-center justify-between" >
        <h2 className="text-lg font-bold text-slate-900">
            Tasks
            <span className="ml-2 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5">
                {filteredTasks.length}
            </span>
        </h2>

        <button
            onClick={() => setShowAllTasks(!showAllTasks)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:border-slate-300"
        >
            {showAllTasks ? "Show Less" : "View All"}
        </button>
    </div>
</div>

                        {/* Task Grid */}
                        {loading ? (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
        {[...Array(6)].map((_, i) => (
            <TaskSkeleton key={i} />
        ))}
    </div>
) :displayedTasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center">
                                <div className="mb-3 text-4xl">📋</div>
                                <p className="font-semibold text-slate-700">No tasks found</p>
                                <p className="text-sm text-slate-400 mt-1">Try a different search or create a new task</p>
                            </div>
                        ) : (
                            <div  className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3" >
                                {displayedTasks.map((task) => {
                                    const pCfg = priorityConfig[task.priority] || priorityConfig.low;
                                    const sCfg = statusConfig[task.status?.toLowerCase()] || "bg-slate-100 text-slate-600";
                                    const due = getDaysLeft(task.duedate);
                                    return (
                                        <div
                                            key={task._id}
                                            className={`group relative flex flex-col rounded-2xl bg-white border border-slate-100 border-l-4 ${pCfg.border} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden`}
                                        >
                                            <div className="p-5 flex flex-col h-full">
                                                {/* Top row */}
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${pCfg.badge}`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${pCfg.dot}`} />
                                                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                                    </span>
                                                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${sCfg}`}>
                                                        {task.status === "inprogress" ? "In Progress" : task.status}
                                                    </span>
                                                </div>

                                                <h3 className="text-base font-bold text-slate-900 line-clamp-1">{task.title}</h3>
                                                <p className="mt-2 text-sm text-slate-500 line-clamp-2 flex-1">{task.description}</p>

                                                {task.category && (
                                                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                                                        <FiTag size={12} />
                                                        <span className="capitalize">{task.category}</span>
                                                    </div>
                                                )}

                                                <div className="mt-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 text-xs">
                                                        <FiCalendar size={12} className="text-slate-400" />
                                                        <span className={`font-medium ${due.color}`}>{due.label}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => navigate(`/task/${task._id}`)}
                                                        className="rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 transition-colors"
                                                    >
                                                        View →
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {!showSidebarCards && (
    <>
                              <div className="rounded-2xl mt-6 bg-white border border-slate-100 shadow-sm p-5">
                            <h3 className="text-sm font-bold text-slate-900 mb-1">Overall Progress</h3>
                            <p className="text-xs text-slate-400 mb-4">
                                {completedTasks} of {totalTasks} tasks completed
                            </p>

                            {/* Circular progress */}
                            <div className="flex items-center justify-center my-2">
                                <div className="relative h-28 w-28">
                                    <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                                        <circle
                                            cx="50" cy="50" r="42" fill="none"
                                            stroke="#2563eb" strokeWidth="10"
                                            strokeDasharray={`${2 * Math.PI * 42}`}
                                            strokeDashoffset={`${2 * Math.PI * 42 * (1 - completionPct / 100)}`}
                                            strokeLinecap="round"
                                            className="transition-all duration-700"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-bold text-slate-900">{completionPct}%</span>
                                        <span className="text-xs text-slate-400">Done</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 text-center">
                                {[
                                    { label: "Done", value: completedTasks, color: "text-emerald-600" },
                                    { label: "Pending", value: pendingTasks, color: "text-amber-600" },
                                    { label: "Urgent", value: highPriorityTasks, color: "text-red-500" },
                                ].map((s) => (
                                    <div key={s.label} className="px-2">
                                        <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── UPCOMING TASKS ───────────────────────── */}
                        <div className="rounded-2xl mt-6 bg-white border border-slate-100 shadow-sm p-5">
                            <h3 className="text-sm font-bold text-slate-900 mb-4">Upcoming Deadlines</h3>
                            <div className="flex flex-col gap-3">
                                {alltasks
                                    .filter((t) => {
                                        const diff = new Date(t.duedate) - new Date();
                                        return diff >= 0 && t.status.toLowerCase() !== "completed";
                                    })
                                    .sort((a, b) => new Date(a.duedate) - new Date(b.duedate))
                                    .slice(0, 4)
                                    .map((task) => {
                                        const pCfg = priorityConfig[task.priority] || priorityConfig.low;
                                        const due = getDaysLeft(task.duedate);
                                        return (
                                            <div
                                                key={task._id}
                                                onClick={() => navigate(`/task/${task._id}`)}
                                                className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50 transition cursor-pointer group"
                                            >
                                                <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${pCfg.dot}`} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-800 truncate">{task.title}</p>
                                                    <p className={`text-xs font-medium mt-0.5 ${due.color}`}>{due.label}</p>
                                                </div>
                                                <span className="text-slate-300 group-hover:text-slate-500 text-xs transition">→</span>
                                            </div>
                                        );
                                    })}
                                {alltasks.filter((t) => {
                                    const diff = new Date(t.duedate) - new Date();
                                    return diff >= 0 && t.status.toLowerCase() !== "completed";
                                }).length === 0 && (
                                    <p className="text-sm text-slate-400 text-center py-4">🎉 No upcoming deadlines</p>
                                )}
                            </div>
                        </div>
                            </>
)}
                    </div>

                    

                    {/* RIGHT SIDEBAR */}
                    <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-5">

                        {/* ── CALENDAR ─────────────────────────────── */}
                        <div className="rounded-2xl xl:mt-26 bg-white border border-slate-100 shadow-sm p-5">
                            {/* Month Nav */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-slate-900">
                                    {monthNames[month]} <span className="text-slate-400 font-medium">{year}</span>
                                </h3>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => setCalendarDate(new Date(year, month - 1, 1))}
                                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                                    >
                                        <FiChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={() => setCalendarDate(new Date(year, month + 1, 1))}
                                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                                    >
                                        <FiChevronRight size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Day headers */}
                            <div className="grid grid-cols-7 mb-2">
                                {dayNames.map((d) => (
                                    <div key={d} className="text-center text-[11px] font-semibold text-slate-400 py-1">{d}</div>
                                ))}
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-7 gap-y-1">
                                {cells.map((d, i) => (
                                    <div key={i} className="flex flex-col items-center justify-center py-0.5">
                                        {d ? (
                                            <div className="relative flex flex-col items-center">
                                                <span
                                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition-all cursor-default
                                                        ${isToday(d)
                                                            ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-200"
                                                            : "text-slate-700 hover:bg-slate-100 font-medium"
                                                        }`}
                                                >
                                                    {d}
                                                </span>
                                                {hasTask(d) && (
                                                    <span className={`mt-0.5 h-1.5 w-1.5 rounded-full ${isToday(d) ? "bg-[red]" : "bg-blue-500"}`} />
                                                )}
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>

                            {/* Legend */}
                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-red-600" /> Today
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-blue-500" /> Task due
                                </span>
                            </div>
                        </div>

                        {/* ── PROGRESS ─────────────────────────────── */}
                        {showSidebarCards && (
    <>


 <div className="rounded-2xl  bg-white border border-slate-100 shadow-sm p-5">
                            <h3 className="text-sm font-bold text-slate-900 mb-1">Overall Progress</h3>
                            <p className="text-xs text-slate-400 mb-4">
                                {completedTasks} of {totalTasks} tasks completed
                            </p>

                            {/* Circular progress */}
                            <div className="flex items-center justify-center my-2">
                                <div className="relative h-28 w-28">
                                    <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                                        <circle
                                            cx="50" cy="50" r="42" fill="none"
                                            stroke="#2563eb" strokeWidth="10"
                                            strokeDasharray={`${2 * Math.PI * 42}`}
                                            strokeDashoffset={`${2 * Math.PI * 42 * (1 - completionPct / 100)}`}
                                            strokeLinecap="round"
                                            className="transition-all duration-700"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-bold text-slate-900">{completionPct}%</span>
                                        <span className="text-xs text-slate-400">Done</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 text-center">
                                {[
                                    { label: "Done", value: completedTasks, color: "text-emerald-600" },
                                    { label: "Pending", value: pendingTasks, color: "text-amber-600" },
                                    { label: "Urgent", value: highPriorityTasks, color: "text-red-500" },
                                ].map((s) => (
                                    <div key={s.label} className="px-2">
                                        <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── UPCOMING TASKS ───────────────────────── */}
                        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
                            <h3 className="text-sm font-bold text-slate-900 mb-4">Upcoming Deadlines</h3>
                            <div className="flex flex-col gap-3">
                                {alltasks
                                    .filter((t) => {
                                        const diff = new Date(t.duedate) - new Date();
                                        return diff >= 0 && t.status.toLowerCase() !== "completed";
                                    })
                                    .sort((a, b) => new Date(a.duedate) - new Date(b.duedate))
                                    .slice(0, 4)
                                    .map((task) => {
                                        const pCfg = priorityConfig[task.priority] || priorityConfig.low;
                                        const due = getDaysLeft(task.duedate);
                                        return (
                                            <div
                                                key={task._id}
                                                onClick={() => navigate(`/task/${task._id}`)}
                                                className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50 transition cursor-pointer group"
                                            >
                                                <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${pCfg.dot}`} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-800 truncate">{task.title}</p>
                                                    <p className={`text-xs font-medium mt-0.5 ${due.color}`}>{due.label}</p>
                                                </div>
                                                <span className="text-slate-300 group-hover:text-slate-500 text-xs transition">→</span>
                                            </div>
                                        );
                                    })}
                                {alltasks.filter((t) => {
                                    const diff = new Date(t.duedate) - new Date();
                                    return diff >= 0 && t.status.toLowerCase() !== "completed";
                                }).length === 0 && (
                                    <p className="text-sm text-slate-400 text-center py-4">🎉 No upcoming deadlines</p>
                                )}
                            </div>
                        </div>

        </>
)}
                  
                    </div>
                </div>
            </div>

            {/* ── CREATE TASK MODAL ──────────────────────────────── */}
            {taskpopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-7 py-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Create New Task</h2>
                                <p className="mt-0.5 text-sm text-slate-400">Fill in the details below</p>
                            </div>
                           <button
    onClick={() => settaskpop(false)}
    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
>
    ✕
</button>
                        </div>

                        {/* Body */}
                        <div className="max-h-[55vh] overflow-y-auto p-7 space-y-5">

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Task Title</label>
                                <input
                                    name="title"
                                    onChange={taskhandle}
                                    type="text"
                                    placeholder="e.g. Build Authentication System"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
                                <textarea
                                    name="description"
                                    onChange={taskhandle}
                                    rows={3}
                                    placeholder="Describe your task..."
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">

                              <div>
    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <FiFlag size={14} /> Priority
    </label>

    <div className="relative">
        <select
            name="priority"
            onChange={taskhandle}
            className="appearance-none w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm outline-none transition focus:border-blue-500"
        >
            <option value="">Select Priority</option>
            <option value="high">🔥 High</option>
            <option value="medium">⚡ Medium</option>
            <option value="low">🌱 Low</option>
        </select>

        <FiChevronDown
            size={16}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
    </div>
</div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Status</label>
                                      <div className="relative">
                                    <select
                                        name="status"
                                        onChange={taskhandle}
                                        className="w-full appearance-none rounded-xl border border-slate-200 pr-12 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="inprogress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                       <FiChevronDown
            size={16}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
                                </div>
                                </div>

                                <div>
                                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <FiCalendar size={14} /> Due Date
                                    </label>
                                    <input
                                        min={new Date().toISOString().split("T")[0]}
                                        name="duedate"
                                        onChange={taskhandle}
                                        type="date"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <FiTag size={14} /> Category
                                    </label>
                                    <input
                                        name="category"
                                        onChange={taskhandle}
                                        type="text"
                                        placeholder="Frontend, Backend..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-7 py-5 sm:flex-row">
                            <button
                                onClick={() => settaskpop(false)}
                                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createtask}
                                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200"
                            >
                                Create Task
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MOBILE MENU */}
<div
    className={`fixed inset-0 z-[200] md:hidden transition-all duration-500 ${
        menutoggle ? "pointer-events-auto" : "pointer-events-none"
    }`}
>
    {/* Overlay */}
    <div
        onClick={() => setmenutoggle(false)}
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-500 ${
            menutoggle ? "opacity-100" : "opacity-0"
        }`}
    />

    {/* Drawer */}
   <div
    className={`absolute top-0 left-0 h-full w-[90%] max-w-[360px]
    bg-gradient-to-b from-white via-slate-50 to-slate-100
    backdrop-blur-3xl
    border-r border-white/50
    shadow-[0_30px_80px_rgba(15,23,42,0.18)]
    transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]
    ${
        menutoggle
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
    }`}
>
    {/* Header */}
    <div className="relative overflow-hidden border-b border-slate-200/70 p-5">

        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50" />

        <div className="relative flex items-center justify-between">

            <div className="flex items-center gap-3">

                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-semibold text-md">
                    {username?.charAt(0).toUpperCase()}
                </div>

                <div>
                    <h3 className="font-bold text-slate-900 text-lg">
                        {username}
                    </h3>

                    <p className="text-xs text-slate-500">
                        Manage your workflow
                    </p>
                </div>

            </div>

            <button
                onClick={() => {
                    setmenutoggle(false)
                     setOpenSection("")
                }}
                className="h-10 w-10 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
                ✕
            </button>

        </div>

    </div>

    <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-95px)]">

        {/* STATUS */}
        <div className="overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">

            <button
                onClick={() =>
                    setOpenSection(
                        openSection === "status" ? "" : "status"
                    )
                }
                className="w-full flex items-center justify-between px-5 py-4"
            >
                <span className="font-semibold text-slate-800">
                    Status
                </span>

                <div
                    className={`h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center transition-all duration-500 ${
                        openSection === "status"
                            ? "rotate-180 bg-blue-100 text-blue-600"
                            : ""
                    }`}
                >
                    <FiChevronDown />
                </div>
            </button>

            <div
                className={`grid transition-all duration-500 ease-in-out ${
                    openSection === "status"
                        ? "grid-rows-[1fr]"
                        : "grid-rows-[0fr]"
                }`}
            >
                <div className="overflow-hidden">
                    <div className="p-3 pt-0 flex flex-col gap-2">

                        <button
                            onClick={() => {
                                setstatus("pending");
                                setmenutoggle(false);
                                                                      setTimeout(() => {
        document
            .getElementById("tasks-section")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
    }, 200);
                            }}
                            className="group flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:translate-x-1"
                        >
                            Pending
                            <span className="h-2 w-2 rounded-full bg-amber-400" />
                        </button>

                        <button
                            onClick={() => {
                                setstatus("inprogress");
                                setmenutoggle(false);
                                                                      setTimeout(() => {
        document
            .getElementById("tasks-section")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
    }, 200);
                            }}
                            className="group flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:translate-x-1"
                        >
                            In Progress
                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                        </button>

                        <button
                            onClick={() => {
                                setstatus("completed");
                                setmenutoggle(false);
                                                                      setTimeout(() => {
        document
            .getElementById("tasks-section")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
    }, 200);
                                
                            }}
                            className="group flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:translate-x-1"
                        >
                            Completed
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                        </button>

                    </div>
                </div>
            </div>

        </div>

        {/* PRIORITY */}
        <div className="overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">

            <button
                onClick={() =>
                    setOpenSection(
                        openSection === "priority" ? "" : "priority"
                    )
                }
                className="w-full flex items-center justify-between px-5 py-4"
            >
                <span className="font-semibold text-slate-800">
                    Priority
                </span>

                <div
                    className={`h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center transition-all duration-500 ${
                        openSection === "priority"
                            ? "rotate-180 bg-blue-100 text-blue-600"
                            : ""
                    }`}
                >
                    <FiChevronDown />
                </div>
            </button>

            <div
                className={`grid transition-all duration-500 ease-in-out ${
                    openSection === "priority"
                        ? "grid-rows-[1fr]"
                        : "grid-rows-[0fr]"
                }`}
            >
                <div className="overflow-hidden">
                    <div className="p-3 pt-0 flex flex-col gap-2">

                        <button
                            onClick={() => {
                                setpriority("high");
                                setmenutoggle(false);
                                                                      setTimeout(() => {
        document
            .getElementById("tasks-section")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
    }, 200);
                            }}
                            className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium hover:bg-red-50 transition-all duration-300 hover:translate-x-1"
                        >
                            High
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                        </button>

                        <button
                            onClick={() => {
                                setpriority("medium");
                                setmenutoggle(false);
                                                                      setTimeout(() => {
        document
            .getElementById("tasks-section")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
    }, 200);
                            }}
                            className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium hover:bg-amber-50 transition-all duration-300 hover:translate-x-1"
                        >
                            Medium
                            <span className="h-2 w-2 rounded-full bg-amber-400" />
                        </button>

                        <button
                            onClick={() => {
                                setpriority("low");
                                setmenutoggle(false);
                                                                      setTimeout(() => {
        document
            .getElementById("tasks-section")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
    }, 200);
                            }}
                            className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium hover:bg-emerald-50 transition-all duration-300 hover:translate-x-1"
                        >
                            Low
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        </button>

                    </div>
                </div>
            </div>

        </div>

        {/* CATEGORY */}
        <div className="overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">

            <button
                onClick={() =>
                    setOpenSection(
                        openSection === "category" ? "" : "category"
                    )
                }
                className="w-full flex items-center justify-between px-5 py-4"
            >
                <span className="font-semibold text-slate-800">
                    Categories
                </span>

                <div
                    className={`h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center transition-all duration-500 ${
                        openSection === "category"
                            ? "rotate-180 bg-blue-100 text-blue-600"
                            : ""
                    }`}
                >
                    <FiChevronDown />
                </div>
            </button>

            <div
                className={`grid transition-all duration-500 ease-in-out ${
                    openSection === "category"
                        ? "grid-rows-[1fr]"
                        : "grid-rows-[0fr]"
                }`}
            >
                <div className="overflow-hidden">
                    <div className="p-3 pt-0 flex flex-col gap-2">

                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setmenutoggle(false);
                                    
                                        setTimeout(() => {
        document
            .getElementById("tasks-section")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
    }, 200);
     
                                }}
                                className="rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:translate-x-1"
                            >
                                {cat}
                            </button>
                        ))}

                    </div>
                </div>
            </div>

        </div>

        {/* LOGOUT */}
        <button
       onClick={()=> setLogoutPop(true)}
            className="mt-10 w-full flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-red-500 to-rose-500 py-3.5 text-white font-semibold shadow-lg shadow-red-200 hover:scale-[1.02] hover:shadow-red-300 transition-all duration-300"
        >
            <FiLogOut size={18} />
            Logout
        </button>

    </div>
</div>
</div>
{taskaddedmsg && (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-5 pointer-events-none">

        {/* Background Glow */}
        <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px] animate-[successBackdrop_.5s_ease]" />

        {/* Success Card */}
        <div
            className="
            relative
            w-full
            max-w-sm
            overflow-hidden
            rounded-[28px]
            border
            border-white/60
            bg-white/80
            backdrop-blur-3xl
            shadow-[0_30px_100px_rgba(16,185,129,0.18)]
            animate-[successCard_.7s_cubic-bezier(.22,1,.36,1)]
            "
        >
            {/* Top Glow */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400" />

            {/* Floating Glow */}
            <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl" />

            <div className="relative flex flex-col items-center px-7 py-8">

                {/* Animated Icon */}
                <div
                    className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-gradient-to-br
                    from-emerald-500
                    to-green-600
                    text-white
                    shadow-[0_15px_40px_rgba(16,185,129,0.35)]
                    animate-[successIcon_.8s_cubic-bezier(.22,1,.36,1)]
                    "
                >
                    <svg
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M20 6L9 17L4 12"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                    Task Created
                </h3>

                <p className="mt-2 text-center text-sm leading-relaxed text-slate-500">
                    Your task has been successfully added to your workspace.
                </p>

                {/* Bottom Indicator */}
                <div className="mt-6 flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                </div>

            </div>

            {/* Auto Close Bar */}
            <div className="h-[3px] w-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-green-600 animate-[successProgress_4s_linear]" />
            </div>

        </div>

    </div>
)}

{taskDeletedMsg && (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 pointer-events-none">

        <div
            className="
            relative
            w-full
            max-w-md
            overflow-hidden
            rounded-[28px]
            border
            border-red-200/60
            bg-white/85
            backdrop-blur-3xl
            shadow-[0_30px_100px_rgba(239,68,68,0.18)]
            animate-[deletePopup_.7s_cubic-bezier(.22,1,.36,1)]
            "
        >

            {/* Glow */}
            <div className="absolute -top-24 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-red-400/15 blur-3xl" />

            {/* Top Border */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-500" />

            <div className="relative p-6 sm:p-8">

                <div className="flex justify-center">

                    <div
                        className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-gradient-to-br
                        from-red-500
                        to-rose-600
                        text-white
                        shadow-[0_15px_40px_rgba(239,68,68,0.35)]
                        "
                    >
                        🗑️
                    </div>

                </div>

                <h2 className="mt-4 text-center text-2xl font-bold text-slate-900">
                    Task Deleted
                </h2>

                <p className="mt-1.5 text-center text-slate-500">
                    <span className="font-semibold text-slate-700">
                        "{deletedTaskName}"
                    </span>
                    <br />
                </p>

                <div className="mt-3 flex justify-center">

                    <span
                        className="
                        rounded-full
                        bg-red-50
                        px-4
                        py-2
                        text-xs
                        font-semibold
                        text-red-600
                        "
                    >
                        Removed Successfully
                    </span>

                </div>

            </div>

            <div className="h-[3px] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-rose-500 animate-[successProgress_3s_linear]" />
            </div>

        </div>

    </div>
)}

{logoutPop && (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/25 backdrop-blur-md px-4">

        <div
            className="
            relative
            w-full
            max-w-md
            overflow-hidden
            rounded-[32px]
            border
            border-white/30
            bg-white/80
            backdrop-blur-2xl
            shadow-[0_40px_100px_rgba(0,0,0,0.15)]
            animate-[successCard_.45s_cubic-bezier(.22,1,.36,1)]
            "
        >

            {/* Glow */}
            <div className="absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-orange-300/20 blur-3xl" />

            {/* Header */}
            <div className="relative flex flex-col items-center px-8 pt-8">

                <div
                    className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-[20px]
                    bg-gradient-to-br
                    from-orange-500
                    to-red-500
                    text-white
                    shadow-[0_15px_35px_rgba(249,115,22,0.35)]
                    "
                >
                    <FiLogOut size={26} />
                </div>

                <h2 className="mt-5 text-2xl font-bold text-slate-900">
                    Logout?
                </h2>

                <p className="mt-2 text-center text-sm leading-relaxed text-slate-500">
                    You're about to sign out from your account.
                    You can login again anytime.
                </p>

            </div>

            {/* Actions */}
            <div className="mt-2 flex gap-3 p-6">

                <button
                    onClick={() => setLogoutPop(false)}
                    className="
                    flex-1
                    rounded-2xl
                    border
                    border-slate-200
                    py-3
                    font-semibold
                    text-slate-600
                    transition-all
                    bg-slate-100
                    cursor-pointer
                    hover:bg-slate-50
                    "
                >
                    Cancel
                </button>

                <button
                    onClick={logout}
                    className="
                    flex-1
                    rounded-2xl
                    bg-gradient-to-r
                    from-orange-500
                    to-red-500
                    py-3
                    font-semibold
                    text-white
                    shadow-lg
                    transition-all
                    hover:scale-[1.02]
                    hover:shadow-xl
                    cursor-pointer
                    "
                >
                    Yes, Logout
                </button>

            </div>

        </div>

    </div>
)}
        </div>
    );
}

export default Home;
