import {
	FaArrowRight,
	FaBell,
	FaBookOpen,
	FaCalendarAlt,
	FaChartLine,
	FaCheckCircle,
	FaClipboardList,
	FaClock,
	FaGraduationCap,
	FaLayerGroup,
	FaMapMarkerAlt,
	FaMobileAlt,
	FaPenNib,
	FaShieldAlt,
	FaWifi,
} from 'react-icons/fa'

const features = [
	{
		title: 'Daily academic command center',
		description: 'Keep lectures, rooms, deadlines, notes, and progress visible before the day gets busy.',
		icon: <FaLayerGroup />,
		tone: 'bg-blue-50 text-blue-700 ring-blue-100',
	},
	{
		title: 'Deadline-aware coursework',
		description: 'Prioritize pending assignments with status labels, due dates, and quick follow-up actions.',
		icon: <FaClipboardList />,
		tone: 'bg-sky-50 text-sky-700 ring-sky-100',
	},
	{
		title: 'Credit progress at a glance',
		description: 'Understand completed and remaining credits without digging through separate portals.',
		icon: <FaChartLine />,
		tone: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
	},
]

const highlights = [
	{ label: 'Lecture schedule', value: 'Live', icon: <FaCalendarAlt /> },
	{ label: 'Assignment tracking', value: 'Smart', icon: <FaPenNib /> },
	{ label: 'Mobile friendly', value: 'Ready', icon: <FaMobileAlt /> },
	{ label: 'Student focused', value: 'Simple', icon: <FaShieldAlt /> },
]

const workflow = [
	{ title: 'Sign in', text: 'Use your campus account to open the student workspace.', icon: <FaShieldAlt /> },
	{ title: 'Review today', text: 'See lectures, locations, tasks, and notifications in one scan.', icon: <FaClock /> },
	{ title: 'Stay on track', text: 'Monitor credits and upcoming coursework without context switching.', icon: <FaCheckCircle /> },
]

function HeroIllustration() {
	return (
		<svg viewBox="0 0 620 500" className="h-full w-full" role="img" aria-label="Smart campus dashboard preview">
			<defs>
				<linearGradient id="screenGradient" x1="70" x2="520" y1="38" y2="432" gradientUnits="userSpaceOnUse">
					<stop stopColor="#2563eb" />
					<stop offset="1" stopColor="#0ea5e9" />
				</linearGradient>
				<linearGradient id="panelGradient" x1="120" x2="500" y1="118" y2="385" gradientUnits="userSpaceOnUse">
					<stop stopColor="#ffffff" />
					<stop offset="1" stopColor="#eff6ff" />
				</linearGradient>
			</defs>
			<rect x="62" y="56" width="496" height="354" rx="38" fill="url(#screenGradient)" />
			<rect x="92" y="92" width="436" height="286" rx="30" fill="url(#panelGradient)" />
			<rect x="122" y="126" width="122" height="18" rx="9" fill="#2563eb" />
			<rect x="122" y="162" width="220" height="12" rx="6" fill="#bfdbfe" />
			<rect x="122" y="188" width="170" height="12" rx="6" fill="#dbeafe" />
			<rect x="382" y="124" width="84" height="84" rx="24" fill="#dbeafe" />
			<circle cx="424" cy="158" r="16" fill="#2563eb" />
			<path d="M390 196c8-23 24-35 34-35s26 12 34 35" fill="#2563eb" />
			<rect x="122" y="238" width="100" height="72" rx="22" fill="#2563eb" />
			<rect x="246" y="238" width="100" height="72" rx="22" fill="#0284c7" />
			<rect x="370" y="238" width="100" height="72" rx="22" fill="#4f46e5" />
			<rect x="146" y="260" width="52" height="10" rx="5" fill="#bfdbfe" />
			<rect x="146" y="282" width="36" height="10" rx="5" fill="#ffffff" />
			<rect x="270" y="260" width="52" height="10" rx="5" fill="#bae6fd" />
			<rect x="270" y="282" width="36" height="10" rx="5" fill="#ffffff" />
			<rect x="394" y="260" width="52" height="10" rx="5" fill="#c7d2fe" />
			<rect x="394" y="282" width="36" height="10" rx="5" fill="#ffffff" />
			<rect x="166" y="344" width="288" height="16" rx="8" fill="#dbeafe" />
			<rect x="166" y="344" width="174" height="16" rx="8" fill="#2563eb" />
			<rect x="36" y="304" width="116" height="86" rx="26" fill="#ffffff" />
			<rect x="58" y="328" width="48" height="10" rx="5" fill="#2563eb" />
			<rect x="58" y="350" width="72" height="10" rx="5" fill="#bfdbfe" />
			<rect x="58" y="370" width="56" height="10" rx="5" fill="#dbeafe" />
			<rect x="468" y="338" width="116" height="86" rx="26" fill="#ffffff" />
			<circle cx="506" cy="370" r="18" fill="#dcfce7" />
			<path d="m497 370 7 7 14-17" fill="none" stroke="#059669" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" />
			<rect x="530" y="358" width="28" height="10" rx="5" fill="#bfdbfe" />
			<rect x="530" y="380" width="38" height="10" rx="5" fill="#dbeafe" />
		</svg>
	)
}

function Home() {
	const isAuthenticated = window.localStorage.getItem('smart-campus-authenticated') === 'true'
	const primaryHref = isAuthenticated ? '/dashboard' : '/signup'
	const primaryLabel = isAuthenticated ? 'Open dashboard' : 'Get started'

	return (
		<main className="min-h-screen bg-slate-50 text-slate-900">
			<div className="relative overflow-hidden">
				<div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-gradient-to-b from-blue-100/80 via-sky-50/60 to-transparent" />

				<header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
					<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
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

						<nav className="hidden items-center gap-2 rounded-full bg-slate-50 p-1 ring-1 ring-slate-200 lg:flex">
							<a href="#features" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-blue-700">
								Features
							</a>
							<a href="#workflow" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-blue-700">
								Workflow
							</a>
							<a href="#preview" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-blue-700">
								Preview
							</a>
						</nav>

						<div className="flex items-center gap-2">
							<a
								href="/login"
								className="hidden h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 sm:inline-flex"
							>
								Login
							</a>
							<a
								href={primaryHref}
								className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl"
							>
								{primaryLabel}
								<FaArrowRight />
							</a>
						</div>
					</div>
				</header>

				<section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-8 px-4 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
					<div>
						<div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm ring-1 ring-blue-100">
							<FaGraduationCap />
							Built for modern student life
						</div>
						<h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-slate-950 lg:text-6xl">
							Stay ahead of lectures, deadlines, and degree progress.
						</h1>
						<p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
							Smart Campus Web Companion gives students a clean workspace for daily schedules, coursework, notes, alerts, and academic progress.
						</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<a
								href={primaryHref}
								className="inline-flex h-13 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl"
							>
								{primaryLabel}
								<FaArrowRight />
							</a>
							<a
								href="#preview"
								className="inline-flex h-13 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
							>
								<FaBookOpen />
								Explore preview
							</a>
						</div>

						<div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
							{highlights.map((item) => (
								<div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
									<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
										{item.icon}
									</div>
									<p className="mt-4 text-xl font-semibold text-slate-950">{item.value}</p>
									<p className="mt-1 text-xs font-medium text-slate-500">{item.label}</p>
								</div>
							))}
						</div>
					</div>

					<div className="relative min-h-[24rem] lg:min-h-[34rem]" id="preview">
						<div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 shadow-2xl shadow-blue-200" />
						<div className="absolute inset-4 rounded-[2rem] bg-white/12 ring-1 ring-white/20" />
						<div className="absolute inset-0 p-4 sm:p-8">
							<HeroIllustration />
						</div>
					</div>
				</section>

				<section id="features" className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
					<div className="max-w-3xl">
						<p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">Everything in one place</p>
						<h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 lg:text-4xl">
							A dashboard that helps students scan, decide, and act faster.
						</h2>
					</div>

					<div className="mt-8 grid gap-4 lg:grid-cols-3">
						{features.map((feature) => (
							<article key={feature.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
								<div className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${feature.tone}`}>
									<span className="text-xl">{feature.icon}</span>
								</div>
								<h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-950">{feature.title}</h3>
								<p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
							</article>
						))}
					</div>
				</section>

				<section id="workflow" className="mx-auto grid max-w-7xl gap-6 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
					<div className="rounded-[2rem] bg-gradient-to-br from-slate-950 to-blue-950 p-6 text-white shadow-xl shadow-slate-200 lg:p-8">
						<p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">Student workflow</p>
						<h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight">
							From sign in to study plan in seconds.
						</h2>
						<p className="mt-4 text-sm leading-7 text-slate-200">
							The experience is intentionally focused: check today, act on urgent coursework, then return to your classes.
						</p>
						<div className="mt-8 grid gap-3">
							<div className="flex items-center justify-between rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
								<span className="flex items-center gap-3 text-sm font-semibold">
									<FaBell className="text-sky-300" />
									Next reminder
								</span>
								<span className="rounded-full bg-sky-400 px-3 py-1 text-xs font-semibold text-slate-950">09:00 AM</span>
							</div>
							<div className="flex items-center justify-between rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
								<span className="flex items-center gap-3 text-sm font-semibold">
									<FaMapMarkerAlt className="text-sky-300" />
									Next class
								</span>
								<span className="text-sm text-slate-200">Block B, Room 204</span>
							</div>
						</div>
					</div>

					<div className="grid gap-4">
						{workflow.map((step, index) => (
							<article key={step.title} className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
								<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
									{step.icon}
								</div>
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Step {index + 1}</p>
									<h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">{step.title}</h3>
									<p className="mt-2 text-sm leading-7 text-slate-600">{step.text}</p>
								</div>
							</article>
						))}
					</div>
				</section>

				<section className="mx-auto max-w-7xl px-4 pb-16 pt-8 lg:px-8">
					<div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 p-6 text-white shadow-xl shadow-blue-100 lg:p-8">
						<div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">Ready for a smarter semester?</p>
								<h2 className="mt-3 text-3xl font-semibold tracking-tight">Open your student workspace today.</h2>
								<p className="mt-3 max-w-2xl text-sm leading-7 text-blue-50">
									Start with a modern dashboard designed around the routines students repeat every day.
								</p>
							</div>
							<div className="flex flex-wrap gap-3">
								<a
									href={primaryHref}
									className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-blue-700 shadow-lg shadow-blue-900/10 transition hover:bg-blue-50"
								>
									{primaryLabel}
									<FaArrowRight />
								</a>
								<a
									href="/login"
									className="inline-flex h-12 items-center justify-center rounded-2xl bg-white/15 px-5 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20"
								>
									Login
								</a>
							</div>
						</div>
					</div>
				</section>
			</div>
		</main>
	)
}

export default Home
