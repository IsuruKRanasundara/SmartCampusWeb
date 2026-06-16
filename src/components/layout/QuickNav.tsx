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
    {
        label: 'Assignments',
        description: 'Track & submit work',
        icon: <FaClipboardList />,
        href: '/assignments',
        gradient: 'from-amber-50 to-orange-50',
        iconBg: 'bg-amber-100 text-amber-600',
    },
    {
        label: 'My Notes',
        description: 'Browse saved notes',
        icon: <FaStickyNote />,
        href: '/my-notes',
        gradient: 'from-violet-50 to-purple-50',
        iconBg: 'bg-violet-100 text-violet-600',
    },
    {
        label: 'Timetable',
        description: 'Weekly schedule',
        icon: <FaCalendarAlt />,
        href: '/timetable',
        gradient: 'from-sky-50 to-blue-50',
        iconBg: 'bg-sky-100 text-sky-600',
    },
    {
        label: 'Courses',
        description: 'Enrolled modules',
        icon: <FaBookOpen />,
        href: '/courses',
        gradient: 'from-emerald-50 to-teal-50',
        iconBg: 'bg-emerald-100 text-emerald-600',
    },
    {
        label: 'Announcements',
        description: 'Campus notices',
        icon: <FaBullhorn />,
        href: '/announcements',
        gradient: 'from-rose-50 to-pink-50',
        iconBg: 'bg-rose-100 text-rose-600',
    },
    {
        label: 'Events',
        description: 'Upcoming activities',
        icon: <FaCalendarCheck />,
        href: '/events',
        gradient: 'from-indigo-50 to-blue-50',
        iconBg: 'bg-indigo-100 text-indigo-600',
    },
    {
        label: 'Facilities',
        description: 'Rooms & spaces',
        icon: <FaBuilding />,
        href: '/facilities',
        gradient: 'from-slate-50 to-gray-50',
        iconBg: 'bg-slate-100 text-slate-600',
    },
    {
        label: 'Assistant',
        description: 'AI study helper',
        icon: <FaRobot />,
        href: '/assistant',
        gradient: 'from-cyan-50 to-sky-50',
        iconBg: 'bg-cyan-100 text-cyan-600',
    },
    {
        label: 'Upload Notes',
        description: 'Share resources',
        icon: <FaFileAlt />,
        href: '/notes',
        gradient: 'from-lime-50 to-green-50',
        iconBg: 'bg-lime-100 text-lime-600',
    },
    {
        label: 'Profile',
        description: 'Account & settings',
        icon: <FaUserCircle />,
        href: '/profile',
        gradient: 'from-orange-50 to-amber-50',
        iconBg: 'bg-orange-100 text-orange-600',
    },
]

/**
 * QuickNav — a "Go to" section shown on the Dashboard.
 * Drop this anywhere inside the Dashboard's content area.
 *
 * Usage:
 *   import QuickNav from '../components/dashboard/QuickNav'
 *   // inside Dashboard JSX:
 *   <QuickNav />
 */
export default function QuickNav() {
    return (
        <section className="pt-6">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-slate-900">Quick Navigation</h2>
                    <p className="text-sm text-slate-500">Jump to any section of the campus portal</p>
                </div>
            </div>

            {/* Card grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {navItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        className={`group relative flex flex-col gap-3 overflow-hidden rounded-3xl bg-gradient-to-br ${item.gradient} border border-white p-4 shadow-sm ring-1 ring-slate-200/60 transition duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-slate-300/60`}
                    >
                        {/* Icon */}
                        <span className={`flex h-10 w-10 items-center justify-center rounded-2xl text-base ${item.iconBg}`}>
                            {item.icon}
                        </span>

                        {/* Text */}
                        <div>
                            <p className="text-sm font-semibold leading-tight text-slate-900">{item.label}</p>
                            <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>
                        </div>

                        {/* Arrow — appears on hover */}
                        <FaChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    </a>
                ))}
            </div>
        </section>
    )
}