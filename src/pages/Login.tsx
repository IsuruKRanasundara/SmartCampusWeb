import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Wifi, Mail, Lock, ArrowRight, BookOpen, GraduationCap, CheckSquare } from "lucide-react"
import * as React from "react"
import { API_BASE_URL, fetchWithRetry } from "../utils/api"

function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    // Track retry attempts so the user sees "Waking up server..." on cold start
    const [retryMsg, setRetryMsg] = useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")
        setRetryMsg("")

        if (!email.trim() || !password.trim()) {
            setError("Please enter email and password")
            return
        }

        try {
            setLoading(true)
            let attempt = 0

            // Use fetchWithRetry to handle Vercel cold starts gracefully
            const data = await fetchWithRetry(async () => {
                attempt++
                if (attempt > 1) setRetryMsg(`Server waking up… attempt ${attempt}`)
                const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                })
                const json = await response.json()
                if (!response.ok) throw new Error(json.message || "Login failed")
                return json
            })

            setRetryMsg("")
            localStorage.setItem("token", data.token || "")
            localStorage.setItem("smart-campus-authenticated", "true")
            localStorage.setItem("smart-campus-user-email", email.trim())
            localStorage.setItem("data", JSON.stringify(data))
            navigate("/dashboard")
        } catch (err) {
            setRetryMsg("")
            setError(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <div className="relative min-h-screen overflow-hidden">
                <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-blue-100/80 via-sky-50/50 to-transparent" />

                <div className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-8 px-4 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
                    {/* Desktop hero panel */}
                    <section className="hidden lg:block">
                        <a href="/" className="inline-flex items-center gap-4">
                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200">
                                <Wifi size={20} />
                            </span>
                            <span>
                                <span className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-600">Smart Campus</span>
                                <span className="block text-sm font-semibold leading-tight text-slate-900">Smart Campus Web Companion</span>
                            </span>
                        </a>

                        <div className="mt-14 max-w-xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">Welcome back</p>
                            <h1 className="mt-4 text-5xl font-semibold leading-tight tracking-tight text-slate-950">
                                Plan lectures, assignments, and credits from one focused dashboard.
                            </h1>
                            <p className="mt-5 text-lg leading-8 text-slate-600">
                                Sign in to continue tracking today's schedule, upcoming deadlines, and your academic progress.
                            </p>
                        </div>

                        <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
                            {[
                                { icon: <BookOpen size={20} />, value: "4", label: "Lectures today", color: "text-blue-600" },
                                { icon: <GraduationCap size={20} />, value: "72", label: "Credits done", color: "text-sky-600" },
                                { icon: <CheckSquare size={20} />, value: "7", label: "Tasks pending", color: "text-indigo-600" },
                            ].map(card => (
                                <div key={card.label} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <span className={card.color}>{card.icon}</span>
                                    <p className="mt-4 text-2xl font-semibold text-slate-900">{card.value}</p>
                                    <p className="mt-1 text-sm text-slate-500">{card.label}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Login form */}
                    <section className="mx-auto w-full max-w-md">
                        {/* Mobile brand */}
                        <div className="mb-6 flex items-center gap-3 lg:hidden">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white">
                                <Wifi size={18} />
                            </span>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Smart Campus</p>
                                <p className="text-sm font-semibold text-slate-900">Web Companion</p>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-blue-100/70 sm:p-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Login</p>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Access your campus hub</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500">Use your student email to continue to the dashboard.</p>

                            <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
                                <label className="grid gap-2">
                                    <span className="text-sm font-semibold text-slate-700">Email address</span>
                                    <span className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
                                        <Mail size={16} className="shrink-0 text-blue-600" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="student@campus.edu"
                                            className="w-full bg-transparent text-sm outline-none"
                                        />
                                    </span>
                                </label>

                                <label className="grid gap-2">
                                    <span className="text-sm font-semibold text-slate-700">Password</span>
                                    <span className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
                                        <Lock size={16} className="shrink-0 text-blue-600" />
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            className="w-full bg-transparent text-sm outline-none"
                                        />
                                    </span>
                                </label>

                                {/* Cold-start retry feedback */}
                                {retryMsg && (
                                    <p className="rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
                                        {retryMsg}
                                    </p>
                                )}

                                {error && (
                                    <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 px-5 text-sm font-semibold text-white transition active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? "Signing in…" : "Sign in"}
                                    <ArrowRight size={16} />
                                </button>

                                <p className="text-center text-sm text-slate-500">
                                    No account?{" "}
                                    <a href="/signup" className="font-semibold text-blue-700 hover:text-blue-800">Sign up</a>
                                </p>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}

export default Login