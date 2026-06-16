/**
 * DashboardExtras — a drop-in section for the Dashboard page that links
 * to all the new features unlocked by the improved backend:
 *   Announcements · Events · Facilities · AI Assistant · Courses
 *
 * Drop this component right before the closing </div> in Dashboard.tsx
 * (after the Achievements section) and import it at the top of Dashboard.tsx:
 *
 *   import DashboardExtras from '../components/dashboard/DashboardExtras'
 *
 * Then inside Dashboard(), after the achievements section:
 *   <DashboardExtras announcementsCount={3} eventsCount={3} />
 */

import {
    FaBullhorn,
    FaCalendarAlt,
    FaBuilding,
    FaRobot,
    FaBookOpen,
} from 'react-icons/fa'

interface Props {
    announcementsCount?: number
    eventsCount?: number
}

const FEATURES = [
    {
        href: '/announcements',
        icon: <FaBullhorn/>,
        label: 'Announcements',
        description: 'Campus updates & notices',
        tone: 'from-rose-500 to-pink-500',
        shadow: 'shadow-rose-200/60',
        badge: null as string | null,
    },
    {
        href: '/events',
        icon: <FaCalendarAlt/>,
        label: 'Events',
        description: 'Register for campus activities',
        tone: 'from-violet-500 to-purple-600',
        shadow: 'shadow-violet-200/60',
        badge: null as string | null,
    },
    {
        href: '/facilities',
        icon: <FaBuilding/>,
        label: 'Facilities',
        description: 'Book labs, library & rooms',
        tone: 'from-emerald-500 to-teal-600',
        shadow: 'shadow-emerald-200/60',
        badge: null as string | null,
    },
    {
        href: '/assistant',
        icon: <FaRobot/>,
        label: 'AI Assistant',
        description: 'Ask about anything on campus',
        tone: 'from-blue-500 to-indigo-600',
        shadow: 'shadow-blue-200/60',
        badge: 'New' as string | null,
    },
    {
        href: '/courses',
        icon: <FaBookOpen/>,
        label: 'Courses',
        description: 'Browse & enrol in courses',
        tone: 'from-amber-500 to-orange-500',
        shadow: 'shadow-amber-200/60',
        badge: null as string | null,
    },
]

export default function DashboardExtras({announcementsCount, eventsCount}: Props) {
    // Attach live counts to specific cards
    const features = FEATURES.map((f) => {
        if (f.href === '/announcements' && announcementsCount)
            return {...f, badge: String(announcementsCount)}
        if (f.href === '/events' && eventsCount)
            return {...f, badge: String(eventsCount)}
        return f
    })

    return (
        <section className="pt-6">
            <div className="mb-3 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-slate-900">Campus Services</h2>
                    <p className="text-sm text-slate-500">All features at your fingertips</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {features.map((feature) => (
                    <a
                        key={feature.href}
                        href={feature.href}
                        className={`relative flex flex-col items-center gap-3 overflow-hidden rounded-3xl bg-gradient-to-br ${feature.tone} p-5 text-white shadow-lg ${feature.shadow} transition hover:-translate-y-0.5 hover:shadow-xl`}
                    >
                        {feature.badge && (
                            <span
                                className="absolute right-3 top-3 rounded-full bg-white/25 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                                {feature.badge}
                            </span>
                        )}
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-xl">
                            {feature.icon}
                        </span>
                        <div className="text-center">
                            <p className="text-sm font-semibold">{feature.label}</p>
                            <p className="mt-0.5 text-[10px] leading-4 text-white/75">{feature.description}</p>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    )
}
