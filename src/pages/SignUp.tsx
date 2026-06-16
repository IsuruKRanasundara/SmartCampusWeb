import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaArrowRight,
    FaEnvelope,
    FaGraduationCap,
    FaIdCard,
    FaLock,
    FaUser,
    FaWifi,
} from "react-icons/fa";
import * as React from "react";

function  SignUp() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");

        if (
            !name.trim() ||
            !studentId.trim() ||
            !email.trim() ||
            !password.trim()
        ) {
            setError("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:3000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        studentId,
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Registration failed"
                );
            }

            localStorage.setItem(
                "token",
                data.token || ""
            );

            localStorage.setItem(
                "smart-campus-authenticated",
                "true"
            );

            localStorage.setItem(
                "smart-campus-user-email",
                email.trim()
            );

            localStorage.setItem(
                "smart-campus-user",
                JSON.stringify(data)
            );

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

                <div className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-8 px-4 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
                    {/* Signup Form */}
                    <section className="order-2 mx-auto w-full max-w-lg lg:order-1">
                        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-blue-100/70 sm:p-8">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
                                    Sign up
                                </p>

                                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                    Create your student account
                                </h1>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Set up your profile to manage classes,
                                    coursework, and academic progress.
                                </p>
                            </div>

                            <form
                                className="mt-8 grid gap-5"
                                onSubmit={handleSubmit}
                            >
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className="grid gap-2">
                                        <span className="text-sm font-semibold text-slate-700">
                                            Full Name
                                        </span>

                                        <span className="flex h-13 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
                                            <FaUser className="text-blue-600" />

                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) =>
                                                    setName(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Nimal Perera"
                                                className="h-full w-full bg-transparent outline-none"
                                            />
                                        </span>
                                    </label>

                                    <label className="grid gap-2">
                                        <span className="text-sm font-semibold text-slate-700">
                                            Student ID
                                        </span>

                                        <span className="flex h-13 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
                                            <FaIdCard className="text-blue-600" />

                                            <input
                                                type="text"
                                                value={studentId}
                                                onChange={(e) =>
                                                    setStudentId(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="SC-2026-014"
                                                className="h-full w-full bg-transparent outline-none"
                                            />
                                        </span>
                                    </label>
                                </div>

                                <label className="grid gap-2">
                                    <span className="text-sm font-semibold text-slate-700">
                                        Email Address
                                    </span>

                                    <span className="flex h-13 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
                                        <FaEnvelope className="text-blue-600" />

                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="student@campus.edu"
                                            className="h-full w-full bg-transparent outline-none"
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
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Create a password"
                                            className="h-full w-full bg-transparent outline-none"
                                        />
                                    </span>
                                </label>

                                {error && (
                                    <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                                        {error}
                                    </p>
                                )}

                                <label className="flex items-start gap-3 rounded-2xl bg-blue-50 p-4 text-sm text-slate-600">
                                    <input
                                        type="checkbox"
                                        required
                                        className="mt-1"
                                    />
                                    <span>
                                        I agree to receive campus schedule
                                        alerts and assignment reminders.
                                    </span>
                                </label>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex h-13 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 px-5 text-sm font-semibold text-white disabled:opacity-50"
                                >
                                    {loading
                                        ? "Creating Account..."
                                        : "Create Account"}

                                    <FaArrowRight />
                                </button>
                            </form>

                            <p className="mt-6 text-center text-sm text-slate-500">
                                Already have an account?{" "}
                                <a
                                    href="/login"
                                    className="font-semibold text-blue-700 hover:text-blue-800"
                                >
                                    Sign In
                                </a>
                            </p>
                        </div>
                    </section>

                    {/* Right Panel */}
                    <section className="order-1 lg:order-2">
                        <a
                            href="/"
                            className="inline-flex items-center gap-4"
                        >
                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white">
                                <FaWifi className="text-lg" />
                            </span>

                            <span>
                                <span className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-600">
                                    Smart Campus
                                </span>

                                <span className="block text-sm font-semibold text-slate-900">
                                    Smart Campus Web Companion
                                </span>
                            </span>
                        </a>

                        <div className="mt-10 rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-8 text-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">
                                        Student Workspace
                                    </p>

                                    <h2 className="mt-3 text-3xl font-semibold">
                                        Start with a dashboard built for
                                        daily campus life.
                                    </h2>
                                </div>

                                <FaGraduationCap className="text-3xl" />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
export default SignUp;
