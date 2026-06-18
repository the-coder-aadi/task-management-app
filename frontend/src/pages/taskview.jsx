import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import {
    FiArrowLeft,
    FiEdit3,
    FiTrash2,
    FiCalendar,
    FiClock,
    FiRefreshCw,
    FiTag,
    FiFlag,
    FiCheckCircle,
    FiAlertCircle,
    FiLoader,
    FiLayers,
} from "react-icons/fi";
import Refreshtokenverification from "../utils/Refreshcheck";

function TaskView() {
    const [Task, setTask] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [deletepop, setdeletepop] = useState(false)
    const [editPopup, setEditPopup] = useState(false);
    const [taskUpdatedMsg, settaskUpdatedMsg] = useState(false)
    const [beforeEditTask, setBeforeEditTask] = useState(null);
    const [changesList, setChangesList] = useState([]);

    useEffect(() => {
    window.scrollTo(0, 0);
}, []);

const [editTask, setEditTask] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
    duedate: "",
    category: "",
});
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        taskfetch();
    }, []);

    if (!Task) {
    return <div>Loading...</div>
}

    async function taskfetch() {
        try {
            const api = await fetch(`https://task-management-app-qd5u.onrender.com/task/${id}`);
            const res = await api.json();
            if (res.success) {
                setTask(res.task);
                setTimeout(() => setLoaded(true), 80);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // ── Helpers ──────────────────────────────────────────────
    const priorityConfig = {
        high: {
            border: "border-l-red-500",
            badge: "bg-red-50 text-red-600 ring-1 ring-red-200",
            dot: "bg-red-500",
            glow: "shadow-red-100",
            label: "High Priority",
            icon: <FiAlertCircle size={14} />,
        },
        medium: {
            border: "border-l-amber-400",
            badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
            dot: "bg-amber-400",
            glow: "shadow-amber-100",
            label: "Medium Priority",
            icon: <FiFlag size={14} />,
        },
        low: {
            border: "border-l-emerald-500",
            badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
            dot: "bg-emerald-500",
            glow: "shadow-emerald-100",
            label: "Low Priority",
            icon: <FiFlag size={14} />,
        },
    };

    const statusConfig = {
        completed: { badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", label: "Completed", step: 2 },
        inprogress: { badge: "bg-blue-50 text-blue-700 ring-1 ring-blue-200", label: "In Progress", step: 1 },
        pending: { badge: "bg-slate-100 text-slate-600 ring-1 ring-slate-200", label: "Pending", step: 0 },
    };

    const pCfg = priorityConfig[Task.priority] || priorityConfig.low;
    const sCfg = statusConfig[Task.status?.toLowerCase()] || statusConfig.pending;
    const currentStep = sCfg.step;

    function getDaysLeft(date) {
        if (!date) return { label: "—", color: "text-slate-400" };
        const diff = new Date(date) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days < 0) return { label: `${Math.abs(days)}d overdue`, color: "text-red-500" };
        if (days === 0) return { label: "Due today", color: "text-orange-500" };
        if (days === 1) return { label: "1 day left", color: "text-yellow-600" };
        return { label: `${days} days left`, color: "text-slate-500" };
    }

    function fmt(dateStr) {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    const due = getDaysLeft(Task.duedate);

    const timelineSteps = [
        { label: "Created", icon: <FiCheckCircle size={16} />, done: true },
        { label: "Progress", icon: <FiLoader size={16} />, done: currentStep >= 1 },
        { label: "Completed", icon: <FiCheckCircle size={16} />, done: currentStep >= 2 },
    ];

    async function handledelete() {
        const token = localStorage.getItem("token")
        try {
            const api = await fetch(`https://task-management-app-qd5u.onrender.com/delete/${Task._id}`,{
                method:"DELETE",
                    headers: {
                    authorization: token,
                },
            })
     if (api.status === 401) {
            const refreshed = await Refreshtokenverification();

            if (!refreshed) {
                navigate("/login");
                return;
            }

            return handledelete();
        }
               
            const res = await api.json()
            console.log(res);
            if (res.success) {
                setdeletepop(false)
               navigate("/home", {
    state: {
        deletedTask: Task.title,
    },
});
                return
            }
            
        } catch (error) {
            console.log(error, "error aa raha hai bhai delete karne par task ko");
        }
    }
    function edittask(e) {
        setEditPopup(true)
        setEditTask({
            ...editTask,
            [e.target.name]: e.target.value
        })
    }

    async function savechanges() {
        const token = localStorage.getItem("token")
        try {
            const api = await fetch(`https://task-management-app-qd5u.onrender.com/savechanges/${id}`,{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    authorization:token
                },
                body:JSON.stringify(editTask)
            })
            if (api.status === 401) {
                const refresed = await Refreshtokenverification()
                if (!refresed) {
                    navigate("/login")
                    return
                }
                savechanges()
            }
            const res = await api.json()
            console.log(res);
 if (res.success) {

    const changes = [];

    if (!beforeEditTask) return;

    if (beforeEditTask.title !== editTask.title) {
        changes.push({
            field: "Title",
            old: beforeEditTask.title,
            new: editTask.title,
        });
    }

    if (beforeEditTask.priority !== editTask.priority) {
        changes.push({
            field: "Priority",
            old: beforeEditTask.priority,
            new: editTask.priority,
        });
    }

    if (beforeEditTask.status !== editTask.status) {
        changes.push({
            field: "Status",
            old: beforeEditTask.status,
            new: editTask.status,
        });
    }

    if (beforeEditTask.category !== editTask.category) {
        changes.push({
            field: "Category",
            old: beforeEditTask.category,
            new: editTask.category,
        });
    }

    if (beforeEditTask.description !== editTask.description) {
    changes.push({
        field: "Description",
        old: beforeEditTask.description,
        new: editTask.description,
    });
}

if (beforeEditTask.duedate !== editTask.duedate) {
    changes.push({
        field: "Due Date",
        old: beforeEditTask.duedate,
        new: editTask.duedate,
    });
}

    console.log(changes);

    setChangesList(changes);

    setTask(res.task);
    setEditPopup(false);
    setTimeout(() => {
    settaskUpdatedMsg(true);

    setTimeout(() => {
        settaskUpdatedMsg(false);
    }, 4000);
}, 250);
}
            
        } catch (error) {
            console.log(error, "error aa raha hai changes save karne par");
            
        }
    }


    return (
        <div className="min-h-screen bg-[#f8f9fc]">

            {/* Subtle ambient blobs */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/3 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
                <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-indigo-100/30 blur-3xl" />
            </div>

            <div className="mx-auto max-w-7xl px-5 sm:px-8 py-6 sm:py-8">

                {/* ── TOP BAR ─────────────────────────────────── */}
           <div
    className={`mb-8 flex gap-3 flex-row items-center justify-between transition-all duration-500 ${
        loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
    }`}
>
    <button
        onClick={() => navigate(-1)}
        className="group flex h-11 w-11 sm:h-auto sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white sm:px-4 sm:py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-x-0.5 hover:border-slate-300 hover:shadow-md"
    >
        <FiArrowLeft
            size={18}
            className="transition-transform group-hover:-translate-x-1"
        />
        <span className="hidden sm:block">Back</span>
    </button>

    <div className="flex gap-2 sm:gap-3">
        <button 
onClick={() => {

    const currentTask = {
        title: Task.title || "",
        description: Task.description || "",
        priority: Task.priority || "",
        status: Task.status || "",
        duedate: Task.duedate
            ? new Date(Task.duedate).toISOString().split("T")[0]
            : "",
        category: Task.category || "",
    };

    setBeforeEditTask(currentTask);
    setEditTask(currentTask);

    setEditPopup(true);
}}
        
        className="flex h-11 w-11 sm:h-auto sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white sm:px-4 sm:py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <FiEdit3 size={16} />
            <span className="hidden sm:block">Edit Task</span>
        </button>

        <button onClick={()=> setdeletepop(true)} className="flex h-11 w-11 sm:h-auto sm:w-auto items-center justify-center gap-2 rounded-xl bg-red-500 sm:px-4 sm:py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-200 transition-all hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-md hover:shadow-red-200">
            <FiTrash2 size={16} />
            <span className="hidden sm:block">Delete</span>
        </button>
    </div>
</div>
                {/* ── HERO CARD ───────────────────────────────── */}
                <div
                    className={`relative overflow-hidden rounded-3xl bg-white border border-slate-100 border-l-4 ${pCfg.border} shadow-lg ${pCfg.glow} transition-all duration-500 delay-75 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                >
                    {/* Subtle top gradient stripe */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-400 to-transparent" />

                    <div className="p-7 sm:p-9">
                        {/* Eyebrow */}

                        <h1 className="break-words text-2xl sm:text-3xl  lg:text-4xl font-bold text-slate-900 leading-tight">
                            {Task.title || "Loading..."}
                        </h1>

                        <p className="mt-4 max-w-4xl text-base line-clamp-3 leading-7 text-slate-500">
                            {Task.description}
                        </p>

                        {/* Badges */}
                        <div className="mt-6 flex flex-wrap gap-2.5">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold ${pCfg.badge}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${pCfg.dot}`} />
                                {pCfg.label}
                            </span>

                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold ${sCfg.badge}`}>
                                {sCfg.label}
                            </span>

                            {Task.category && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 ring-1 ring-indigo-200">
                                    <FiTag size={11} />
                                    {Task.category}
                                </span>
                            )}

                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold bg-white border border-slate-200 ${due.color}`}>
                                <FiCalendar size={11} />
                                {due.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── TIMELINE (Signature Element) ─────────────── */}
                <div
                    className={`mt-6 rounded-2xl bg-white border border-slate-100 shadow-sm px-7 py-6 transition-all duration-500 delay-150 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                >
                    <p className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-400">Task Progress</p>

                    <div className="flex items-center gap-0">
                        {timelineSteps.map((step, i) => (
                            <div key={step.label} className="flex items-center justify-between flex-1">
                                {/* Step */}
                                <div className="flex flex-col items-center flex-shrink-0">
                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                                            step.done
                                                ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200"
                                                : "border-slate-200 bg-white text-slate-400"
                                        }`}
                                    >
                                        {step.icon}
                                    </div>
                                    <span
                                        className={`mt-2 text-xs font-semibold whitespace-nowrap ${
                                            step.done ? "text-blue-600" : "text-slate-400"
                                        }`}
                                    >
                                        {step.label}
                                    </span>
                                </div>

                                {/* Connector line (not after last) */}
                                {i < timelineSteps.length - 1 && (
                                    <div className="flex-1 mx-0.5 sm:mx-2 mb-5">
                                        <div className="h-0.5 w-full rounded-full bg-slate-100 relative overflow-hidden">
                                            <div
                                                className={`absolute left-0 top-0 h-full rounded-full bg-blue-500 transition-all duration-700 ${
                                                    timelineSteps[i + 1].done ? "w-full" : "w-0"
                                                }`}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── META CARDS ───────────────────────────────── */}
                <div
                    className={`mt-6 grid gap-4 sm:grid-cols-3 transition-all duration-500 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                >
                    {[
                        {
                            icon: <FiCalendar size={20} className="text-blue-500" />,
                            bg: "bg-blue-50",
                            label: "Due Date",
                            value: fmt(Task.duedate),
                            sub: due.label,
                            subColor: due.color,
                        },
                        {
                            icon: <FiClock size={20} className="text-emerald-500" />,
                            bg: "bg-emerald-50",
                            label: "Created",
                            value: fmt(Task.createdAt),
                            sub: "Task created on",
                            subColor: "text-slate-400",
                        },
                        {
                            icon: <FiRefreshCw size={20} className="text-indigo-500" />,
                            bg: "bg-indigo-50",
                            label: "Last Updated",
                            value: fmt(Task.updatedAt),
                            sub: "Most recent edit",
                            subColor: "text-slate-400",
                        },
                    ].map((card) => (
                        <div
                            key={card.label}
                            className="group rounded-2xl bg-white border border-slate-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <div className={`mb-4 inline-flex rounded-xl p-2.5 ${card.bg}`}>
                                {card.icon}
                            </div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{card.label}</p>
                            <h3 className="mt-1.5 text-xl font-bold text-slate-900">{card.value}</h3>
                            <p className={`mt-0.5 text-xs font-medium ${card.subColor}`}>{card.sub}</p>
                        </div>
                    ))}
                </div>

                {/* ── DESCRIPTION BLOCK ────────────────────────── */}
                <div
                    className={`mt-6 rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden transition-all duration-500 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                >
                    <div className="border-b border-slate-100 px-7 py-5 flex items-center gap-2.5">
                        <FiLayers size={16} className="text-blue-500" />
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Full Description</h2>
                    </div>

                    <div className="px-7 py-6">
                        {Task.description ? (
                            <p className="whitespace-pre-wrap text-base leading-8 text-slate-600">
                                {Task.description}
                            </p>
                        ) : (
                            <p className="text-sm text-slate-400 italic">No description provided.</p>
                        )}
                    </div>
                </div>

                {/* ── QUICK INFO STRIP ─────────────────────────── */}
                <div
                    className={`mt-6 rounded-2xl bg-slate-900 text-white p-6 flex flex-wrap gap-6 items-center justify-between transition-all duration-500 delay-[400ms] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                >
                    <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-1">Task ID</p>
                        <p className="font-mono text-sm text-slate-300 break-all">{id}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20">
                            <FiEdit3 size={14} />
                            Edit Task
                        </button>
                        <button onClick={()=> setdeletepop(true)} className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition hover:bg-red-400">
                            <FiTrash2 size={14} />
                            Delete Task
                        </button>
                    </div>
                </div>

                {/* Spacer */}
                <div className="h-12" />
            </div>

            {deletepop && (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">

            {/* Top */}
            <div className="flex flex-col items-center px-8 pt-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <FiTrash2 className="text-red-500" size={28} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                    Delete Task
                </h2>

                <p className="mt-2 text-center text-sm text-slate-500 leading-relaxed">
                    Are you sure you want to delete
                    <span className="font-semibold text-slate-800">
                        {" "}"{Task.title}"{" "}
                    </span>
                    ?
      
                </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 px-6 py-6 mt-3">
                <button
                    onClick={() => setdeletepop(false)}
                    className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                    No, Keep It
                </button>

                <button
                  onClick={handledelete}
                    className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white shadow-sm shadow-red-200 transition-all hover:bg-red-600 hover:shadow-md"
                >
                    Yes, Delete
                </button>
            </div>
        </div>
    </div>
)}

{editPopup && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-7 py-5">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Edit Task
                    </h2>
                </div>

                <button
                    onClick={() => setEditPopup(false)}
                    className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                >
                    ✕
                </button>
            </div>

            {/* Body */}
            <div
                className="max-h-[55vh] overflow-y-auto p-7 space-y-5"
                style={{
                    scrollbarWidth: "thin",
                }}
            >
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Task Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={editTask.title}
                        onChange={edittask}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Description
                    </label>

                    <textarea
                        rows={4}
                        name="description"
                        value={editTask.description}
                        onChange={edittask}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div className="grid gap-5 md:grid-cols-2">

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Priority
                        </label>

                        <select
                            name="priority"
                            value={editTask.priority}
                            onChange={edittask}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                        >
                            <option value="high">🔥 High</option>
                            <option value="medium">⚡ Medium</option>
                            <option value="low">🌱 Low</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Status
                        </label>

                        <select
                            name="status"
                            value={editTask.status}
                            onChange={edittask}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                        >
                            <option value="pending">Pending</option>
                            <option value="inprogress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Due Date
                        </label>

                        <input
                         min={new Date().toISOString().split("T")[0]}
                            type="date"
                            name="duedate"
                            value={editTask.duedate}
                            onChange={edittask}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Category
                        </label>

                        <input
                            type="text"
                            name="category"
                            value={editTask.category}
                            onChange={edittask}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-7 py-5 sm:flex-row">
                <button
                    onClick={() => setEditPopup(false)}
                    className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                    Cancel
                </button>

                <button
                    onClick={savechanges}
                    className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200"
                >
                    Save Changes
                </button>
            </div>
        </div>
    </div>
)}

{taskUpdatedMsg && (
    <div
    className="
    fixed
    inset-0
    z-[999]
    flex
    items-center
    justify-center
    px-4
    bg-slate-900/15
    backdrop-blur-sm
    animate-[fadeIn_.3s_ease]
    "
>

        <div
            className="
            w-full
            max-w-lg
            overflow-hidden
            rounded-[28px]
            border
            border-blue-200/50
           bg-white/70
backdrop-blur-[10px]
            shadow-[0_30px_100px_rgba(59,130,246,0.15)]
            animate-[successCard_.7s_cubic-bezier(.22,1,.36,1)]
            "
        >

            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

            <div className="p-7">

                <div className="flex items-center gap-4">

                    <div
                        className="
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                        bg-gradient-to-br
                        from-blue-500
                        to-indigo-600
                        text-white
                        text-2xl
                        "
                    >
                        ✨
                    </div>

                    <div>

                        <h2 className="text-xl font-bold text-slate-900">
                            Task Updated
                        </h2>

                        <p className="text-sm text-slate-500">
                            Changes were saved successfully
                        </p>

                    </div>

                </div>

                <div className="mt-6 space-y-3">

                    {changesList.map((item, index) => (
                        <div
                            key={index}
                            className="
                            rounded-2xl
                            border
                            border-slate-100
                            bg-slate-50
                            p-4
                            "
                        >
                            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                {item.field}
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-2">

                                <span className="rounded-lg bg-red-50 px-3 py-1 text-sm text-red-600">
                                    {item.old}
                                </span>

                                <span className="text-slate-400">
                                    →
                                </span>

                                <span className="rounded-lg bg-emerald-50 px-3 py-1 text-sm text-emerald-600">
                                    {item.new}
                                </span>

                            </div>
                        </div>
                    ))}

                </div>

            </div>

            <div className="h-[3px] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-[successProgress_4s_linear]" />
            </div>

        </div>

    </div>
)}

        </div>
    );
}

export default TaskView;
