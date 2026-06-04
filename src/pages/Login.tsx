import { useState, type FormEvent } from 'react'
import {
	FaArrowRight,
	FaBookOpen,
	FaEnvelope,
	FaGraduationCap,
	FaLock,
	FaWifi,
} from 'react-icons/fa'

function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!email.trim() || !password.trim()) {
			setError('Enter your student email and password to continue.')
			return
		}

		window.localStorage.setItem('smart-campus-authenticated', 'true')
		window.localStorage.setItem('smart-campus-user-email', email.trim())
		window.location.href = '/dashboard'
	}

	return (
		<main className="min-h-screen bg-slate-50 text-slate-900">
			<div className="relative min-h-screen overflow-hidden">
				<div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-blue-100/80 via-sky-50/50 to-transparent" />
				<div className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-8 px-4 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
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
								Plan lectures, assignments, and credits from one focused dashboard.
							</h1>
							<p className="mt-5 text-lg leading-8 text-slate-600">
								Sign in to continue tracking today&apos;s schedule, upcoming deadlines, and your academic progress.
							</p>
						</div>

						<div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
							<div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
								<FaBookOpen className="text-xl text-blue-600" />
								<p className="mt-4 text-2xl font-semibold text-slate-900">4</p>
								<p className="mt-1 text-sm text-slate-500">Lectures today</p>
							</div>
							<div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
								<FaGraduationCap className="text-xl text-sky-600" />
								<p className="mt-4 text-2xl font-semibold text-slate-900">72</p>
								<p className="mt-1 text-sm text-slate-500">Credits done</p>
							</div>
							<div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
								<FaArrowRight className="text-xl text-indigo-600" />
								<p className="mt-4 text-2xl font-semibold text-slate-900">7</p>
								<p className="mt-1 text-sm text-slate-500">Tasks pending</p>
							</div>
						</div>
					</section>

					<section className="mx-auto w-full max-w-md">
						<div className="mb-6 flex items-center justify-between lg:hidden">
							<a href="/" className="flex items-center gap-3">
								<span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200">
									<FaWifi className="text-lg" />
								</span>
								<span>
									<span className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-600">
										Smart Campus
									</span>
									<span className="block text-sm font-semibold leading-tight text-slate-900">
										Web Companion
									</span>
								</span>
							</a>
						</div>

						<div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-blue-100/70 sm:p-8">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Login</p>
								<h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Access your campus hub</h2>
								<p className="mt-2 text-sm leading-6 text-slate-500">
									Use your student email to continue to the dashboard.
								</p>
							</div>

							<form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
								<label className="grid gap-2">
									<span className="text-sm font-semibold text-slate-700">Email address</span>
									<span className="flex h-13 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-500 transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
										<FaEnvelope className="shrink-0 text-blue-600" />
										<input
											type="email"
											value={email}
											onChange={(event) => setEmail(event.target.value)}
											placeholder="student@campus.edu"
											className="h-full w-full border-0 bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
										/>
									</span>
								</label>

								<label className="grid gap-2">
									<span className="text-sm font-semibold text-slate-700">Password</span>
									<span className="flex h-13 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-500 transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
										<FaLock className="shrink-0 text-blue-600" />
										<input
											type="password"
											value={password}
											onChange={(event) => setPassword(event.target.value)}
											placeholder="Enter your password"
											className="h-full w-full border-0 bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
										/>
									</span>
								</label>

								<div className="flex items-center justify-between gap-4 text-sm">
									<label className="flex items-center gap-2 font-medium text-slate-600">
										<input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600" />
										Remember me
									</label>
									<a href="/signup" className="font-semibold text-blue-700 transition hover:text-blue-800">
										Forgot password?
									</a>
								</div>

								{error && (
									<p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-100">
										{error}
									</p>
								)}

								<button
									type="submit"
									className="inline-flex h-13 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
								>
									Sign in
									<FaArrowRight />
								</button>
							</form>

							<p className="mt-6 text-center text-sm text-slate-500">
								New to Smart Campus?{' '}
								<a href="/signup" className="font-semibold text-blue-700 transition hover:text-blue-800">
									Create an account
								</a>
							</p>
						</div>
					</section>
				</div>
			</div>
		</main>
	)
}

export default Login
