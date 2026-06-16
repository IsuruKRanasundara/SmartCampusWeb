import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaArrowRight,
    FaBookOpen,
    FaEnvelope,
    FaGraduationCap,
    FaLock,
    FaWifi,
} from "react-icons/fa";
import * as React from "react";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Please enter email and password");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "https://smart-campus-web-api.vercel.app/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token || "");
            localStorage.setItem(
                "smart-campus-authenticated",
                "true"
            );
            localStorage.setItem(
                "smart-campus-user-email",
                email.trim()
            );
            localStorage.setItem("data", JSON.stringify(data));

            navigate("/dashboard");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong"
            );
        } finally {
            setLoading(false);

        }
    };

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <div className="relative min-h-screen overflow-hidden">
                <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-blue-100/80 via-sky-50/50 to-transparent" />

                <div className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-8 px-4 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
                    {/* Left Section */}
                    <section className="hidden lg:block">
                        <a href="/" className="inline-flex items-center gap-4">
                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200">
                                <FaWifi className="text-lg" />
                            </span>

                            <span>
                                <span className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-600">
                                    Smart Campus
                                </span>

                                <span className="block text-sm font-semibold leading-tight text-slate-900">
                                    Smart Campus Web Companion
                                </span>
                            </span>
                        </a>

                        <div className="mt-14 max-w-xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
                                Welcome back
                            </p>

                            <h1 className="mt-4 text-5xl font-semibold leading-tight tracking-tight text-slate-950">
                                Plan lectures, assignments, and credits from one
                                focused dashboard.
                            </h1>

                            <p className="mt-5 text-lg leading-8 text-slate-600">
                                Sign in to continue tracking today's schedule,
                                upcoming deadlines, and your academic progress.
                            </p>
                        </div>

                        <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
                            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                                <FaBookOpen className="text-xl text-blue-600" />
                                <p className="mt-4 text-2xl font-semibold text-slate-900">
                                    4
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Lectures today
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                                <FaGraduationCap className="text-xl text-sky-600" />
                                <p className="mt-4 text-2xl font-semibold text-slate-900">
                                    72
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Credits done
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                                <FaArrowRight className="text-xl text-indigo-600" />
                                <p className="mt-4 text-2xl font-semibold text-slate-900">
                                    7
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Tasks pending
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Right Section */}
                    <section className="mx-auto w-full max-w-md">
                        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-blue-100/70 sm:p-8">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
                                    Login
                                </p>

                                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                    Access your campus hub
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Use your student email to continue to the
                                    dashboard.
                                </p>
                            </div>

                            <form
                                className="mt-8 grid gap-5"
                                onSubmit={handleSubmit}
                            >
                                <label className="grid gap-2">
                                    <span className="text-sm font-semibold text-slate-700">
                                        Email address
                                    </span>

                                    <span className="flex h-13 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
                                        <FaEnvelope className="text-blue-600" />

                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="student@campus.edu"
                                            className="w-full bg-transparent outline-none"
                                        />
                                    </span>
                                </label>

                                <label className="grid gap-2">
                                    <span className="text-sm font-semibold text-slate-700">
                                        Password
                                    </span>

                                    <span className="flex h-13 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
                                        <FaLock className="text-blue-600" />

                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            placeholder="Enter your password"
                                            className="w-full bg-transparent outline-none"
                                        />
                                    </span>
                                </label>

                                {error && (
                                    <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 px-5 py-4 text-sm font-semibold text-white disabled:opacity-50"
                                >
                                    {loading
                                        ? "Signing in..."
                                        : "Sign in"}

                                    <FaArrowRight />
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default Login;