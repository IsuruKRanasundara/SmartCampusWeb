import {
    FaBell,
    FaCalendarAlt,
    FaClipboardList,
    FaCog,
    FaHome,
    FaFileAlt,
    FaUserCircle,
    FaWifi,
} from 'react-icons/fa'

interface NavbarProps {
    currentTime?: string
    notificationCount?: number
}

const navigationItems = [
    { label: 'Dashboard', icon: <FaHome />, href: '/dashboard' },
    { label: 'Assignments', icon: <FaClipboardList />, href: '/assignments' },
    { label: 'Notes', icon: <FaFileAlt />, href: '/my-notes' },
    { label: 'Timetable', icon: <FaCalendarAlt />, href: '/timetable' },
    { label: 'Profile', icon: <FaUserCircle />, href: '/profile' },
]

export default function Navbar({ currentTime, notificationCount = 0 }: NavbarProps) {
    const currentPath = window.location.pathname

    const now = currentTime ?? new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    })

    return (
        <header className="sticky top-0 z-30 hidden border-b border-slate-200/80 bg-white/85 backdrop-blur-xl lg:block">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 xl:px-8">
                <div className="flex items-center gap-4">
                    <a href="/dashboard" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200">
                        <FaWifi className="text-lg" />
                    </a>
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-600">Smart Campus</p>
                        <h1 className="text-sm font-semibold leading-tight text-slate-900">Web Companion</h1>
                    </div>
                    <div className="hidden items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-600 ring-1 ring-slate-200 xl:flex">
                        <FaCalendarAlt className="text-blue-600" />
                        <span>Today</span>
                        <span className="text-slate-300">|</span>
                        <span>{now}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <nav className="flex items-center gap-1 rounded-full bg-slate-50 p-1 ring-1 ring-slate-200">
                        {navigationItems.map((item) => {
                            const isActive = currentPath === item.href
                            return (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                                        isActive
                                            ? 'bg-white text-blue-700 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-900'
                                    }`}
                                >
                                    <span className="text-base">{item.icon}</span>
                                    <span>{item.label}</span>
                                </a>
                            )
                        })}
                    </nav>

                    <a
                        href="/settings"
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        title="Settings"
                    >
                        <FaCog className="text-base" />
                    </a>

                    <a
                        href="/dashboard"
                        className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        aria-label="Notifications"
                    >
                        <FaBell className="text-lg" />
                        {notificationCount > 0 && (
                            <>
                                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" />
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white shadow-lg shadow-blue-200">
                                    {notificationCount}
                                </span>
                            </>
                        )}
                    </a>
                </div>
            </div>
        </header>
    )
}
