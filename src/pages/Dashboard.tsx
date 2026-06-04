import {
	FaBell,
	FaBookOpen,
	FaCalendarAlt,
	FaChartLine,
	FaCheckCircle,
	FaClipboardList,
	FaClock,
	FaGraduationCap,
	FaMapMarkerAlt,
	FaPenNib,
	FaRegCalendarCheck,
	FaSignOutAlt,
	FaWifi,
} from 'react-icons/fa'

const metricCards = [
	{ label: 'Today Lectures', value: '4', helper: 'Next at 09:00 AM', icon: <FaCalendarAlt />, tone: 'bg-blue-50 text-blue-700 ring-blue-100' },
	{ label: 'Assignments', value: '7', helper: '2 due this week', icon: <FaClipboardList />, tone: 'bg-sky-50 text-sky-700 ring-sky-100' },
	{ label: 'Completed', value: '18', helper: 'Strong submission rate', icon: <FaCheckCircle />, tone: 'bg-emerald-50 text-emerald-700 ring-emerald-100' },
	{ label: 'Credits', value: '72', helper: '48 credits remaining', icon: <FaGraduationCap />, tone: 'bg-indigo-50 text-indigo-700 ring-indigo-100' },
]

const lectures = [
	{ title: 'Advanced Software Engineering', lecturer: 'Dr. Amaya Perera', time: '09:00 - 10:30', place: 'Block B, Room 204', active: true },
	{ title: 'Database Systems', lecturer: 'Prof. R. Silva', time: '11:00 - 12:30', place: 'Lecture Hall 3', active: false },
	{ title: 'Human Computer Interaction', lecturer: 'Ms. N. Fernando', time: '02:00 - 03:30', place: 'Design Studio 1', active: false },
]

const tasks = [
	{ title: 'Mobile UI Prototype', meta: 'Due tomorrow, 11:59 PM', status: 'In progress' },
	{ title: 'Database Report', meta: 'Due Friday, 4:30 PM', status: 'Draft' },
	{ title: 'AI Seminar Reflection', meta: 'Due Sunday, 8:00 PM', status: 'Review' },
]

function DashboardIllustration() {
	return (
		<svg viewBox="0 0 360 260" className="h-full w-full" role="img" aria-label="Student dashboard illustration">
			<rect width="360" height="260" rx="28" fill="#eff6ff" />
			<rect x="34" y="38" width="292" height="184" rx="24" fill="#ffffff" />
			<rect x="56" y="64" width="116" height="14" rx="7" fill="#2563eb" />
			<rect x="56" y="92" width="248" height="12" rx="6" fill="#dbeafe" />
			<rect x="56" y="118" width="176" height="12" rx="6" fill="#e0f2fe" />
			<rect x="56" y="158" width="68" height="38" rx="14" fill="#2563eb" />
			<rect x="146" y="158" width="68" height="38" rx="14" fill="#0284c7" />
			<rect x="236" y="158" width="68" height="38" rx="14" fill="#4f46e5" />
			<circle cx="274" cy="82" r="28" fill="#bfdbfe" />
			<circle cx="274" cy="76" r="11" fill="#2563eb" />
			<path d="M251 105c5-14 15-21 23-21s18 7 23 21" fill="#2563eb" />
		</svg>
	)
}

function Dashboard() {
	const email = window.localStorage.getItem('smart-campus-user-email') || 'student@campus.edu'
	const progress = 60

	const handleLogout = () => {
		window.localStorage.removeItem('smart-campus-authenticated')
		window.localStorage.removeItem('smart-campus-user-email')
		window.location.href = '/login'
	}

	return (
		<main className="min-h-screen bg-slate-50 text-slate-900">
			<div className="relative min-h-screen overflow-x-clip">
				<div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-blue-100/80 via-sky-50/50 to-transparent" />

				<header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
					<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
						<a href="/dashboard" className="flex items-center gap-3">
							<span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200">
								<FaWifi className="text-lg" />
							</span>
							<span>
								<span className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-600">
									Smart Campus
								</span>
								<span className="block text-sm font-semibold leading-tight text-slate-900">
									Student Dashboard
								</span>
							</span>
						</a>

						<div className="flex items-center gap-2">
							<button
								type="button"
								className="relative hidden h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 sm:flex"
								aria-label="Notifications"
							>
								<FaBell />
								<span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" />
							</button>
							<button
								type="button"
								onClick={handleLogout}
								className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
							>
								<FaSignOutAlt />
								<span className="hidden sm:inline">Logout</span>
							</button>
						</div>
					</div>
				</header>

				<div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
					<section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
						<div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-6 text-white shadow-xl shadow-blue-100 lg:p-8">
							<div className="grid items-center gap-6 md:grid-cols-[1fr_260px]">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100/90">
										Welcome back
									</p>
									<h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight lg:text-4xl">
										Your academic day is ready to review.
									</h1>
									<p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50 lg:text-base">
										Signed in as {email}. Track lectures, assignments, notes, and credit progress from one workspace.
									</p>
									<div className="mt-6 flex flex-wrap gap-3">
										<a
											href="/"
											className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-blue-700 shadow-lg shadow-blue-900/10 transition hover:bg-blue-50"
										>
											<FaBookOpen />
											View timetable
										</a>
										<a
											href="/"
											className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white/15 px-5 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20"
										>
											<FaPenNib />
											Add note
										</a>
									</div>
								</div>
								<div className="hidden h-56 md:block">
									<DashboardIllustration />
								</div>
							</div>
						</div>

						<aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
							<div className="flex items-center justify-between gap-4">
								<div>
									<p className="text-sm font-semibold text-slate-900">Credit Progress</p>
									<p className="mt-1 text-sm text-slate-500">72 of 120 completed</p>
								</div>
								<FaChartLine className="text-2xl text-blue-600" />
							</div>
							<div className="mt-6 flex items-center justify-center">
								<div className="relative flex h-32 w-32 items-center justify-center">
									<svg viewBox="0 0 100 100" className="h-32 w-32 -rotate-90">
										<circle cx="50" cy="50" r="42" className="fill-none stroke-slate-100" strokeWidth="10" />
										<circle
											cx="50"
											cy="50"
											r="42"
											className="fill-none stroke-blue-600"
											strokeWidth="10"
											strokeLinecap="round"
											strokeDasharray={`${2 * Math.PI * 42}`}
											strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
										/>
									</svg>
									<div className="absolute text-center">
										<p className="text-3xl font-semibold text-slate-900">{progress}%</p>
										<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Done</p>
									</div>
								</div>
							</div>
						</aside>
					</section>

					<section className="grid grid-cols-2 gap-3 pt-5 lg:grid-cols-4">
						{metricCards.map((card) => (
							<article key={card.label} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
								<div className="flex items-start justify-between gap-3">
									<div>
										<p className="text-xs font-medium text-slate-500">{card.label}</p>
										<p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{card.value}</p>
									</div>
									<div className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${card.tone}`}>
										<span className="text-lg">{card.icon}</span>
									</div>
								</div>
								<p className="mt-3 text-xs font-medium text-slate-500">{card.helper}</p>
							</article>
						))}
					</section>

					<section className="grid gap-5 pt-6 lg:grid-cols-[1fr_0.85fr]">
						<div>
							<div className="mb-3 flex items-center justify-between gap-3">
								<div>
									<h2 className="text-lg font-semibold tracking-tight text-slate-900">Today&apos;s Lectures</h2>
									<p className="text-sm text-slate-500">Your next sessions and locations</p>
								</div>
								<FaRegCalendarCheck className="text-xl text-blue-600" />
							</div>
							<div className="space-y-3">
								{lectures.map((lecture) => (
									<article
										key={lecture.title}
										className={`rounded-3xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
											lecture.active
												? 'border-blue-200 bg-gradient-to-br from-blue-50 to-white ring-1 ring-blue-100'
												: 'border-slate-200 bg-white'
										}`}
									>
										<div className="flex items-start justify-between gap-3">
											<div>
												<div className="flex flex-wrap items-center gap-2">
													<h3 className="text-base font-semibold text-slate-900">{lecture.title}</h3>
													{lecture.active && (
														<span className="rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
															Next
														</span>
													)}
												</div>
												<p className="mt-1 text-sm text-slate-500">{lecture.lecturer}</p>
											</div>
											<FaClock className="mt-1 text-slate-400" />
										</div>
										<div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
											<span className="flex items-center gap-2">
												<FaClock className="text-blue-600" />
												{lecture.time}
											</span>
											<span className="flex items-center gap-2">
												<FaMapMarkerAlt className="text-blue-600" />
												{lecture.place}
											</span>
										</div>
									</article>
								))}
							</div>
						</div>

						<div>
							<div className="mb-3 flex items-center justify-between gap-3">
								<div>
									<h2 className="text-lg font-semibold tracking-tight text-slate-900">Assignment Focus</h2>
									<p className="text-sm text-slate-500">Coursework that needs attention</p>
								</div>
								<FaClipboardList className="text-xl text-blue-600" />
							</div>
							<div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
								<div className="space-y-3">
									{tasks.map((task) => (
										<article key={task.title} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
											<div>
												<h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>
												<p className="mt-1 text-sm text-slate-500">{task.meta}</p>
											</div>
											<span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
												{task.status}
											</span>
										</article>
									))}
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</main>
	)
}

export default Dashboard
