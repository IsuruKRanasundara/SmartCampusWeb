import {
    FaClipboardList,
    FaFileAlt,
    FaCalendarAlt,
    FaUserCircle,
    FaBullhorn,
    FaCalendarCheck,
    FaBuilding,
    FaRobot,
    FaBookOpen,
    FaStickyNote,
    FaChevronRight,
} from 'react-icons/fa'

interface QuickNavItem {
    label: string
    description: string
    icon: React.ReactNode
    href: string
    gradient: string
    iconBg: string
}

const navItems: QuickNavItem[] = [
    { label: 'Assignments', description: 'Track & submit', icon: <FaClipboardList />, href: '/assignments', gradient: 'from-amber-50 to-orange-50', iconBg: 'bg-amber-100 text-amber-600' },
    { label: 'My Notes', description: 'Browse notes', icon: <FaStickyNote />, href: '/my-notes', gradient: 'from-violet-50 to-purple-50', iconBg: 'bg-violet-100 text-violet-600' },
    { label: 'Timetable', description: 'Weekly schedule', icon: <FaCalendarAlt />, href: '/timetable', gradient: 'from-sky-50 to-blue-50', iconBg: 'bg-sky-100 text-sky-600' },
    { label: 'Courses', description: 'Your modules', icon: <FaBookOpen />, href: '/courses', gradient: 'from-emerald-50 to-teal-50', iconBg: 'bg-emerald-100 text-emerald-600' },
    { label: 'Notices', description: 'Campus updates', icon: <FaBullhorn />, href: '/announcements', gradient: 'from-rose-50 to-pink-50', iconBg: 'bg-rose-100 text-rose-600' },
    { label: 'Events', description: 'Activities', icon: <FaCalendarCheck />, href: '/events', gradient: 'from-indigo-50 to-blue-50', iconBg: 'bg-indigo-100 text-indigo-600' },
    { label: 'Facilities', description: 'Book spaces', icon: <FaBuilding />, href: '/facilities', gradient: 'from-slate-50 to-gray-50', iconBg: 'bg-slate-100 text-slate-600' },
    { label: 'Assistant', description: 'AI helper', icon: <FaRobot />, href: '/assistant', gradient: 'from-cyan-50 to-sky-50', iconBg: 'bg-cyan-100 text-cyan-600' },
    { label: 'Upload', description: 'Share resources', icon: <FaFileAlt />, href: '/notes', gradient: 'from-lime-50 to-green-50', iconBg: 'bg-lime-100 text-lime-600' },
    { label: 'Profile', description: 'Your account', icon: <FaUserCircle />, href: '/profile', gradient: 'from-orange-50 to-amber-50', iconBg: 'bg-orange-100 text-orange-600' },
]

export default function QuickNav() {
    return (
        <section>
            <div className="mb-3 flex items-center justify-between">
                <div>
                    <h2 className="text-base font-semibold tracking-tight text-slate-900 lg:text-lg">Quick Navigation</h2>
                    <p className="text-sm text-slate-500">Jump to any section</p>
                </div>
            </div>

            {/*
              * 3 columns on mobile (compact), 4 on sm, 5 on lg+
              * Cards are intentionally compact on mobile
              */}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                {navItems.map(item => (
                    <a
                        key={item.label}
                        href={item.href}
                        className={`group relative flex flex-col gap-2 overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} border border-white p-3 shadow-sm ring-1 ring-slate-200/60 transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95 lg:gap-3 lg:rounded-3xl lg:p-4`}
                    >
                        <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm ${item.iconBg} lg:h-10 lg:w-10`}>
                            {item.icon}
                        </span>
                        <div>
                            <p className="text-xs font-semibold leading-tight text-slate-900">{item.label}</p>
                            <p className="mt-0.5 hidden text-[10px] text-slate-500 sm:block">{item.description}</p>
                        </div>
                        <FaChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-slate-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    </a>
                ))}
            </div>
        </section>
    )
}