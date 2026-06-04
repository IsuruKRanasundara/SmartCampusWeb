import { type FormEvent } from 'react'
import {
	FaArrowRight,
	FaEnvelope,
	FaGraduationCap,
	FaIdCard,
	FaLock,
	FaUser,
	FaWifi,
} from 'react-icons/fa'

function SignUp() {
	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		window.localStorage.setItem('smart-campus-authenticated', 'true')
		window.location.href = '/dashboard'
	}

	return (
		<main className="min-h-screen bg-slate-50 text-slate-900">
			<div className="relative min-h-screen overflow-hidden">
				<div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-blue-100/80 via-sky-50/50 to-transparent" />
				<div className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-8 px-4 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
					<section className="mx-auto w-full max-w-lg order-2 lg:order-1">
						<div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-blue-100/70 sm:p-8">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Sign up</p>
								<h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Create your student account</h1>
								<p className="mt-2 text-sm leading-6 text-slate-500">
									Set up your profile to manage classes, coursework, and academic progress.
								</p>
							</div>

							<form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
								<div className="grid gap-4 sm:grid-cols-2">
									<label className="grid gap-2">
										<span className="text-sm font-semibold text-slate-700">Full name</span>
										<span className="flex h-13 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-500 transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
											<FaUser className="shrink-0 text-blue-600" />
											<input
												type="text"
												placeholder="Nimal Perera"
												className="h-full w-full border-0 bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
											/>
										</span>
									</label>

									<label className="grid gap-2">
										<span className="text-sm font-semibold text-slate-700">Student ID</span>
										<span className="flex h-13 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-500 transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
											<FaIdCard className="shrink-0 text-blue-600" />
											<input
												type="text"
												placeholder="SC-2026-014"
												className="h-full w-full border-0 bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
											/>
										</span>
									</label>
								</div>

								<label className="grid gap-2">
									<span className="text-sm font-semibold text-slate-700">Email address</span>
									<span className="flex h-13 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-500 transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
										<FaEnvelope className="shrink-0 text-blue-600" />
										<input
											type="email"
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
											placeholder="Create a password"
											className="h-full w-full border-0 bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
										/>
									</span>
								</label>

								<label className="flex items-start gap-3 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-slate-600 ring-1 ring-blue-100">
									<input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600" />
									<span>I agree to receive campus schedule alerts and assignment reminders.</span>
								</label>

								<button
									type="submit"
									className="inline-flex h-13 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
								>
									Create account
									<FaArrowRight />
								</button>
							</form>

							<p className="mt-6 text-center text-sm text-slate-500">
								Already have an account?{' '}
								<a href="/login" className="font-semibold text-blue-700 transition hover:text-blue-800">
									Sign in
								</a>
							</p>
						</div>
					</section>

					<section className="order-1 lg:order-2">
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

						<div className="mt-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-6 text-white shadow-xl shadow-blue-100 lg:p-8">
							<div className="flex items-start justify-between gap-4">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100/90">
										Student workspace
									</p>
									<h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight">
										Start with a dashboard built for daily campus life.
									</h2>
								</div>
								<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
									<FaGraduationCap className="text-2xl" />
								</div>
							</div>

							<div className="mt-8 grid gap-3 rounded-[1.5rem] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur-sm sm:grid-cols-3">
								<div>
									<p className="text-[11px] uppercase tracking-[0.2em] text-blue-100/80">Lectures</p>
									<p className="mt-2 text-2xl font-semibold">Daily</p>
								</div>
								<div>
									<p className="text-[11px] uppercase tracking-[0.2em] text-blue-100/80">Deadlines</p>
									<p className="mt-2 text-2xl font-semibold">Tracked</p>
								</div>
								<div>
									<p className="text-[11px] uppercase tracking-[0.2em] text-blue-100/80">Credits</p>
									<p className="mt-2 text-2xl font-semibold">Visible</p>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</main>
	)
}

export default SignUp
