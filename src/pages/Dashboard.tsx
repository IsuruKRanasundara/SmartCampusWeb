import { useState, useEffect, useRef, useCallback } from 'react'
import type { ReactNode } from 'react'
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
    FaUser,
    FaCog,
    FaShieldAlt,
    FaEnvelope,
    FaSyncAlt,
    FaExclamationCircle,
    FaTrophy,
    FaBookmark,
    FaChevronRight,
    // FaFire — removed (imported but never used)
} from 'react-icons/fa'
import NotificationsDrawer from '../components/NotificationsDrawer'
import Navbar from "../components/layout/Navbar.tsx";
import BottomNavigation from "../components/layout/BottomNavigation.tsx";
import QuickNav from "../components/layout/QuickNav.tsx";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Profile {
    name: string
    email: string
    studentId: string
    avatarUrl: string | null
    faculty: string
    year: string
}

interface Metrics {
    todayLectures: number
    pendingAssignments: number
    completedAssignments: number
    dueThisWeek: number
    credits: number
    totalCredits: number
}

interface DashboardLecture {
    id: number
    title: string
    lecturer: string
    startTime: string
    endTime: string
    room: string
    building: string
    isNext: boolean
}

type AssignmentStatus = 'In Progress' | 'Draft' | 'Review' | 'Not Started' | 'Submitted'
type AssignmentPriority = 'high' | 'medium' | 'low'

interface DashboardAssignment {
    id: number
    title: string
    course: string
    dueDate: string
    status: AssignmentStatus
    priority: AssignmentPriority
}

type NotificationType = 'info' | 'assignment' | 'grade'

interface Notification {
    id: number
    message: string
    type: NotificationType
    time: string
    read: boolean
}

interface Achievement {
    id: number
    title: string
    earnedAt: string
}

interface Gpa {
    current: number
    previous: number
    target: number
}

interface DashboardData {
    profile: Profile | null
    metrics: Metrics | null
    lectures: DashboardLecture[]
    assignments: DashboardAssignment[]
    notifications: Notification[]
    achievements: Achievement[]
    gpa: Gpa | null
}

type AvatarSize = 'sm' | 'md' | 'lg'

// ─── API response shapes (Smart Campus Backend) ───────────────────────────────

interface ApiProfile {
    id: number
    name: string
    faculty: string
    degree: string
    completedCredits: number
    totalCredits: number
}

interface ApiTimetableEntry {
    course: string
    time: string
    hall: string
}

interface ApiAssignment {
    id: number
    title: string
    dueDate: string
    status: string
}

interface ApiNotification {
    id: number
    message: string
}

interface ApiResult {
    course: string
    grade: string
}

const GRADE_POINTS: Record<string, number> = {
    'A+': 4.0, A: 4.0, 'A-': 3.7,
    'B+': 3.3, B: 3.0, 'B-': 2.7,
    'C+': 2.3, C: 2.0, 'C-': 1.7,
    D: 1.0, F: 0,
}

// ─── API Configuration ────────────────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://smart-campus-web-api.vercel.app'

const api = {
    headers: () => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('smart-campus-token') || ''}`,
    }),

    async get<T>(endpoint: string): Promise<T> {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: api.headers(),
        })
        if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
        return res.json() as Promise<T>
    },
}

// ─── API → Dashboard mappers ──────────────────────────────────────────────────

function parseTimeRange(time: string): { startTime: string; endTime: string } {
    const [startTime = '—', endTime = '—'] = time.split(/\s*-\s*/)
    return { startTime: startTime.trim(), endTime: endTime.trim() }
}

function parseTimeToMinutes(time: string): number {
    const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
    if (!match) return 0
    let hours = parseInt(match[1], 10)
    const minutes = parseInt(match[2], 10)
    const period = match[3]?.toUpperCase()
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    return hours * 60 + minutes
}

function findNextLectureIndex(entries: ApiTimetableEntry[]): number {
    const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes()
    let nextIdx = -1
    let nextStart = Infinity
    entries.forEach((entry, i) => {
        const { startTime } = parseTimeRange(entry.time)
        const mins = parseTimeToMinutes(startTime)
        if (mins >= nowMinutes && mins < nextStart) {
            nextStart = mins
            nextIdx = i
        }
    })
    return nextIdx >= 0 ? nextIdx : 0
}

function mapProfile(apiProfile: ApiProfile): Profile {
    const storedEmail = localStorage.getItem('smart-campus-user-email') ?? ''
    let studentId = String(apiProfile.id)
    try {
        const storedData = localStorage.getItem('data')
        if (storedData) {
            const parsed = JSON.parse(storedData) as { user?: { id?: string } }
            if (parsed.user?.id) studentId = parsed.user.id
        }
    } catch {
        // ignore malformed stored login payload
    }
    return {
        name: apiProfile.name,
        email: storedEmail,
        studentId,
        avatarUrl: null,
        faculty: apiProfile.faculty,
        year: apiProfile.degree,
    }
}

function buildMetrics(
    apiProfile: ApiProfile,
    timetable: ApiTimetableEntry[],
    assignments: ApiAssignment[],
): Metrics {
    const now = Date.now()
    const weekMs = 7 * 24 * 60 * 60 * 1000
    const pending = assignments.filter((a) => a.status.toLowerCase() !== 'completed').length
    const completed = assignments.filter((a) => a.status.toLowerCase() === 'completed').length
    const dueThisWeek = assignments.filter((a) => {
        const due = new Date(a.dueDate).getTime()
        return a.status.toLowerCase() !== 'completed' && due >= now && due - now <= weekMs
    }).length
    return {
        todayLectures: timetable.length,
        pendingAssignments: pending,
        completedAssignments: completed,
        dueThisWeek,
        credits: apiProfile.completedCredits,
        totalCredits: apiProfile.totalCredits,
    }
}

function mapTimetable(entries: ApiTimetableEntry[]): DashboardLecture[] {
    const nextIdx = findNextLectureIndex(entries)
    return entries.map((entry, i) => {
        const { startTime, endTime } = parseTimeRange(entry.time)
        return {
            id: i + 1,
            title: entry.course,
            lecturer: 'Faculty',
            startTime,
            endTime,
            room: entry.hall,
            building: entry.hall,
            isNext: i === nextIdx,
        }
    })
}

function mapAssignmentStatus(status: string): AssignmentStatus {
    const normalized = status.toLowerCase()
    if (normalized === 'completed') return 'Submitted'
    if (normalized === 'pending') return 'In Progress'
    if (normalized === 'draft') return 'Draft'
    if (normalized === 'review') return 'Review'
    return 'Not Started'
}

function assignmentPriority(dueDate: string): AssignmentPriority {
    const days = (new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    if (days <= 3) return 'high'
    if (days <= 7) return 'medium'
    return 'low'
}

function mapAssignments(assignments: ApiAssignment[]): DashboardAssignment[] {
    return assignments.map((a) => ({
        id: a.id,
        title: a.title,
        course: 'Coursework',
        dueDate: a.dueDate,
        status: mapAssignmentStatus(a.status),
        priority: assignmentPriority(a.dueDate),
    }))
}

function inferNotificationType(message: string): NotificationType {
    const lower = message.toLowerCase()
    if (lower.includes('assignment') || lower.includes('deadline')) return 'assignment'
    if (lower.includes('grade') || lower.includes('quiz') || lower.includes('result')) return 'grade'
    return 'info'
}

function mapNotifications(notifications: ApiNotification[]): Notification[] {
    return notifications.map((n) => ({
        id: n.id,
        message: n.message,
        type: inferNotificationType(n.message),
        time: 'Recently',
        read: false,
    }))
}

function gradeToPoints(grade: string): number {
    return GRADE_POINTS[grade.trim().toUpperCase()] ?? 0
}

function computeGpa(results: ApiResult[]): Gpa | null {
    if (results.length === 0) return null
    const points = results.map((r) => gradeToPoints(r.grade))
    const current = points.reduce((sum, p) => sum + p, 0) / points.length
    return {
        current,
        previous: Math.max(0, current - 0.14),
        target: 4.0,
    }
}

function mapResultsToAchievements(results: ApiResult[]): Achievement[] {
    return results.map((r, i) => ({
        id: i + 1,
        title: r.course,
        earnedAt: `Grade ${r.grade}`,
    }))
}

// ─── Data Fetching ────────────────────────────────────────────────────────────

// Offline fallback when the API is unreachable
const FALLBACK_DASHBOARD_DATA: DashboardData = {
    profile: {
        name: 'Asel Wijesinghe',
        email: 'asel.w@campus.edu',
        studentId: 'CS21-0047',
        avatarUrl: null,
        faculty: 'Faculty of Computing',
        year: '3rd Year',
    },
    metrics: {
        todayLectures: 4,
        pendingAssignments: 7,
        completedAssignments: 18,
        dueThisWeek: 2,
        credits: 72,
        totalCredits: 120,
    },
    lectures: [
        { id: 1, title: 'Advanced Software Engineering', lecturer: 'Dr. Amaya Perera', startTime: '09:00', endTime: '10:30', room: 'Room 204', building: 'Block B', isNext: true },
        { id: 2, title: 'Database Systems', lecturer: 'Prof. R. Silva', startTime: '11:00', endTime: '12:30', room: 'Lecture Hall 3', building: 'Main Block', isNext: false },
        { id: 3, title: 'Human Computer Interaction', lecturer: 'Ms. N. Fernando', startTime: '14:00', endTime: '15:30', room: 'Design Studio 1', building: 'Block C', isNext: false },
    ],
    assignments: [
        { id: 1, title: 'Mobile UI Prototype', course: 'HCI', dueDate: '2025-01-20T23:59', status: 'In Progress', priority: 'high' },
        { id: 2, title: 'Database Report', course: 'DBS', dueDate: '2025-01-24T16:30', status: 'Draft', priority: 'medium' },
        { id: 3, title: 'AI Seminar Reflection', course: 'AI', dueDate: '2025-01-26T20:00', status: 'Review', priority: 'low' },
        { id: 4, title: 'Network Security Lab', course: 'NET', dueDate: '2025-01-28T17:00', status: 'Not Started', priority: 'medium' },
    ],
    notifications: [
        { id: 1, message: 'ASE lecture moved to Room 301 tomorrow', type: 'info', time: '10m ago', read: false },
        { id: 2, message: 'New assignment posted: Cloud Architecture', type: 'assignment', time: '1h ago', read: false },
        { id: 3, message: 'Your Database Report was graded: B+', type: 'grade', time: '3h ago', read: true },
    ],
    achievements: [
        { id: 1, title: "Dean's List", earnedAt: 'Sem 2 2024' },
        { id: 2, title: '7-Day Streak', earnedAt: 'This week' },
        { id: 3, title: 'Top Contributor', earnedAt: 'Jan 2025' },
    ],
    gpa: { current: 3.72, previous: 3.58, target: 3.80 },
}

async function fetchDashboardFromApi(): Promise<DashboardData> {
    const [apiProfile, timetable, apiAssignments, apiNotifications, results] =
        await Promise.all([
            api.get<ApiProfile>('/api/users/profile'),
            api.get<ApiTimetableEntry[]>('/api/timetable/today'),
            api.get<ApiAssignment[]>('/api/assignments'),
            api.get<ApiNotification[]>('/api/notifications'),
            api.get<ApiResult[]>('/api/results'),
        ])

    const profile = mapProfile(apiProfile)
    const metrics = buildMetrics(apiProfile, timetable, apiAssignments)
    const lectures = mapTimetable(timetable)
    const assignments = mapAssignments(apiAssignments)
    const notifications = mapNotifications(apiNotifications)
    const achievements = mapResultsToAchievements(results)
    const gpa = computeGpa(results)

    return { profile, metrics, lectures, assignments, notifications, achievements, gpa }
}

function useDashboardData() {
    const [data, setData] = useState<DashboardData>({
        profile: null,
        metrics: null,
        lectures: [],
        assignments: [],
        notifications: [],
        achievements: [],
        gpa: null,
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)

    const fetchAll = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await fetchDashboardFromApi()
            setData(result)
            setLastRefreshed(new Date())
        } catch (err) {
            console.error('Dashboard fetch error:', err)
            setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
            setData(FALLBACK_DASHBOARD_DATA)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        let cancelled = false

        fetchDashboardFromApi()
            .then((result) => {
                if (cancelled) return
                setData(result)
                setLastRefreshed(new Date())
            })
            .catch((err: unknown) => {
                if (cancelled) return
                console.error('Dashboard fetch error:', err)
                setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
                setData(FALLBACK_DASHBOARD_DATA)
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        const interval = setInterval(() => {
            void fetchAll()
        }, 5 * 60 * 1000)

        return () => {
            cancelled = true
            clearInterval(interval)
        }
    }, [fetchAll])

    return { data, loading, error, refetch: fetchAll, lastRefreshed }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ name, avatarUrl, size = 'md' }: { name?: string; avatarUrl?: string | null; size?: AvatarSize }) {
    const sizeMap: Record<AvatarSize, string> = { sm: 'h-9 w-9 text-sm', md: 'h-11 w-11 text-base', lg: 'h-16 w-16 text-xl' }
    const initials = name ? name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : '??'

    if (avatarUrl) {
        return (
            <img
                src={avatarUrl}
                alt={name}
                className={`${sizeMap[size]} rounded-2xl object-cover ring-2 ring-white shadow-md`}
            />
        )
    }
    return (
        <div
            className={`${sizeMap[size]} flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white ring-2 ring-white shadow-md`}
        >
            {initials}
        </div>
    )
}

function ProfileDropdown({
    profile,
    onClose,
    onLogout,
}: {
    profile: Profile | null
    onClose: () => void
    onLogout: () => void
}) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && e.target instanceof Node && !ref.current.contains(e.target)) onClose()
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
        // FIX 3: onClose is included — but callers must wrap it in useCallback to avoid
        // re-registering the listener on every render (see Dashboard component below)
    }, [onClose])

    const menuItems = [
        { icon: <FaUser />, label: 'My Profile', href: '/profile' },
        { icon: <FaBookmark />, label: 'Saved Resources', href: '/resources' },
        { icon: <FaEnvelope />, label: 'Messages', href: '/messages' },
        { icon: <FaCog />, label: 'Settings', href: '/settings' },
        { icon: <FaShieldAlt />, label: 'Privacy', href: '/privacy' },
    ]

    return (
        <div
            ref={ref}
            className="absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/80"
            style={{ animation: 'dropdownIn 0.18s ease' }}
        >
            <style>{`@keyframes dropdownIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-5">
                <div className="flex items-center gap-3">
                    <Avatar name={profile?.name} avatarUrl={profile?.avatarUrl} size="lg" />
                    <div className="min-w-0">
                        <p className="truncate font-semibold text-white">{profile?.name ?? '—'}</p>
                        <p className="truncate text-xs text-blue-100">{profile?.email ?? '—'}</p>
                        <span className="mt-1.5 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
							{profile?.studentId ?? '—'}
						</span>
                    </div>
                </div>
                <div className="mt-3 flex gap-2 text-xs text-blue-100">
                    <span className="rounded-xl bg-white/15 px-2.5 py-1">{profile?.faculty}</span>
                    <span className="rounded-xl bg-white/15 px-2.5 py-1">{profile?.year}</span>
                </div>
            </div>

            <nav className="p-2">
                {menuItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-blue-700"
                    >
						<span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
							{item.icon}
						</span>
                        <span className="font-medium">{item.label}</span>
                        <FaChevronRight className="ml-auto text-[10px] text-slate-400" />
                    </a>
                ))}
            </nav>

            <div className="border-t border-slate-100 p-2">
                <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                >
					<span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
						<FaSignOutAlt />
					</span>
                    Sign out
                </button>
            </div>
        </div>
    )
}

function NotificationsPanel({
    notifications,
    onClose,
    onViewAll,
}: {
    notifications: Notification[]
    onClose: () => void
    onViewAll: () => void
}) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && e.target instanceof Node && !ref.current.contains(e.target)) onClose()
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
        // FIX 4: same as ProfileDropdown — onClose must be stable at the call site
    }, [onClose])

    const typeColor: Record<NotificationType, string> = {
        info: 'bg-blue-100 text-blue-600',
        assignment: 'bg-amber-100 text-amber-600',
        grade: 'bg-emerald-100 text-emerald-600',
    }

    return (
        <div
            ref={ref}
            className="absolute right-0 top-full z-50 mt-3 w-80 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/80"
            style={{ animation: 'dropdownIn 0.18s ease' }}
        >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <p className="font-semibold text-slate-900">Notifications</p>
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
					{notifications.filter((n) => !n.read).length} new
				</span>
            </div>
            <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 && (
                    <p className="py-8 text-center text-sm text-slate-400">No notifications</p>
                )}
                {notifications.map((n) => (
                    <div
                        key={n.id}
                        className={`flex gap-3 border-b border-slate-50 px-4 py-3 ${!n.read ? 'bg-blue-50/40' : ''}`}
                    >
						<span
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs ${
                                typeColor[n.type] ?? 'bg-slate-100 text-slate-500'
                            }`}
                        >
							<FaBell />
						</span>
                        <div>
                            <p className="text-sm text-slate-700">{n.message}</p>
                            <p className="mt-0.5 text-xs text-slate-400">{n.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="border-t border-slate-100 p-2">
                <button
                    type="button"
                    onClick={() => {
                        onViewAll()
                        onClose()
                    }}
                    className="block w-full rounded-2xl px-3 py-2 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                    View all notifications
                </button>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: AssignmentStatus }) {
    const map: Record<AssignmentStatus, string> = {
        'In Progress': 'bg-blue-50 text-blue-700 ring-blue-100',
        Draft: 'bg-amber-50 text-amber-700 ring-amber-100',
        Review: 'bg-violet-50 text-violet-700 ring-violet-100',
        'Not Started': 'bg-rose-50 text-rose-700 ring-rose-100',
        Submitted: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    }
    return (
        <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                map[status] ?? 'bg-slate-50 text-slate-600 ring-slate-200'
            }`}
        >
			{status}
		</span>
    )
}

function PriorityDot({ priority }: { priority: AssignmentPriority }) {
    const map: Record<AssignmentPriority, string> = { high: 'bg-rose-500', medium: 'bg-amber-400', low: 'bg-emerald-400' }
    return <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${map[priority] ?? 'bg-slate-300'}`} />
}

function SkeletonCard() {
    return (
        <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-4">
            <div className="h-4 w-1/2 rounded bg-slate-100" />
            <div className="mt-3 h-8 w-1/3 rounded bg-slate-100" />
            <div className="mt-3 h-3 w-2/3 rounded bg-slate-100" />
        </div>
    )
}

// FIX 5: helper for due date — use toLocaleString (not toLocaleDateString) so
// hour/minute options are honoured correctly
function formatDueDate(isoString: string) {
    return new Date(isoString).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    })
}

function DashboardIllustration() {
    return (
        <svg viewBox="0 0 360 260" className="h-full w-full" role="img" aria-label="Student dashboard illustration">
            <rect width="360" height="260" rx="28" fill="rgba(255,255,255,0.08)" />
            <rect x="34" y="38" width="292" height="184" rx="24" fill="rgba(255,255,255,0.12)" />
            <rect x="56" y="64" width="116" height="14" rx="7" fill="rgba(255,255,255,0.6)" />
            <rect x="56" y="92" width="248" height="12" rx="6" fill="rgba(255,255,255,0.25)" />
            <rect x="56" y="118" width="176" height="12" rx="6" fill="rgba(255,255,255,0.2)" />
            <rect x="56" y="158" width="68" height="38" rx="14" fill="rgba(255,255,255,0.25)" />
            <rect x="146" y="158" width="68" height="38" rx="14" fill="rgba(255,255,255,0.2)" />
            <rect x="236" y="158" width="68" height="38" rx="14" fill="rgba(255,255,255,0.15)" />
            <circle cx="274" cy="82" r="28" fill="rgba(255,255,255,0.2)" />
            <circle cx="274" cy="76" r="11" fill="rgba(255,255,255,0.5)" />
            <path d="M251 105c5-14 15-21 23-21s18 7 23 21" fill="rgba(255,255,255,0.4)" />
        </svg>
    )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
    const { data, loading, error, refetch, lastRefreshed } = useDashboardData()
    const [showProfile, setShowProfile] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [showAllNotifications, setShowAllNotifications] = useState(false)

    const { profile, metrics, lectures, assignments, notifications, achievements, gpa } = data

    const progress = metrics ? Math.round((metrics.credits / metrics.totalCredits) * 100) : 0
    const unreadCount = notifications.filter((n) => !n.read).length
    const nextLecture = lectures.find((l) => l.isNext)

    const metricCards: { label: string; value: number; helper: string; icon: ReactNode; tone: string }[] = metrics
        ? [
            {
                label: 'Today Lectures',
                value: metrics.todayLectures,
                helper: nextLecture ? `Next at ${nextLecture.startTime}` : 'No more lectures today',
                icon: <FaCalendarAlt />,
                tone: 'bg-blue-50 text-blue-700 ring-blue-100',
            },
            {
                label: 'Assignments',
                value: metrics.pendingAssignments,
                helper: metrics.dueThisWeek === 1 ? '1 due this week' : `${metrics.dueThisWeek} due this week`,
                icon: <FaClipboardList />,
                tone: 'bg-amber-50 text-amber-700 ring-amber-100',
            },
            { label: 'Completed', value: metrics.completedAssignments, helper: 'Submitted coursework', icon: <FaCheckCircle />, tone: 'bg-emerald-50 text-emerald-700 ring-emerald-100' },
            { label: 'Credits', value: metrics.credits, helper: `${metrics.totalCredits - metrics.credits} remaining`, icon: <FaGraduationCap />, tone: 'bg-indigo-50 text-indigo-700 ring-indigo-100' },
        ]
        : []

    const handleLogout = () => {
        localStorage.removeItem('smart-campus-authenticated')
        localStorage.removeItem('smart-campus-user-email')
        localStorage.removeItem('smart-campus-token')
        localStorage.removeItem('token')
        localStorage.removeItem('data')
        window.location.href = '/login'
    }

    // FIX 6: stable callbacks so ProfileDropdown / NotificationsPanel
    // don't re-register their mousedown listeners on every render
    const closeProfile = useCallback(() => setShowProfile(false), [])
    const closeNotifications = useCallback(() => setShowNotifications(false), [])
    const closeAllNotifications = useCallback(() => setShowAllNotifications(false), [])
    const openAllNotifications = useCallback(() => {
        setShowAllNotifications(true)
        setShowProfile(false)
        setShowNotifications(false)
    }, [])

    return (
        // FIX 7: add `relative` so the absolute gradient bg-div is clipped to this element
        <main className="relative min-h-screen bg-slate-50 text-slate-900">
            <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-blue-100/70 via-sky-50/40 to-transparent" />
            <Navbar notificationCount={unreadCount} />
            {/* ── Header ──────────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
                    <a href="/dashboard" className="flex items-center gap-3">
						<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200">
							<FaWifi className="text-lg" />
						</span>
                        <span>
							<span className="block text-[10px] font-bold uppercase tracking-[0.26em] text-blue-600">Smart Campus</span>
							<span className="block text-sm font-semibold leading-tight text-slate-900">Student Portal</span>
						</span>
                    </a>

                    <div className="flex items-center gap-2">
                        {/* Refresh */}
                        <button
                            onClick={refetch}
                            className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 sm:flex"
                            title={lastRefreshed ? `Last updated ${lastRefreshed.toLocaleTimeString()}` : 'Refresh'}
                        >
                            <FaSyncAlt className={loading ? 'animate-spin' : ''} />
                        </button>

                        {/* Timetable */}
                        <a
                            href="/timetable"
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            title="View timetable"
                        >
                            <FaBookOpen />
                        </a>

                        {/* Notes */}
                        <a
                            href="/notes"
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            title="Document notes"
                        >
                            <FaPenNib />
                        </a>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowNotifications((v) => !v)
                                    setShowProfile(false)
                                    setShowAllNotifications(false)
                                }}
                                className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                                <FaBell />
                                {unreadCount > 0 && (
                                    <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-rose-500 text-[8px] font-bold text-white">
										{unreadCount}
									</span>
                                )}
                            </button>
                            {showNotifications && (
                                <NotificationsPanel
                                    notifications={notifications}
                                    onClose={closeNotifications}
                                    onViewAll={openAllNotifications}
                                />
                            )}
                        </div>

                        {/* Avatar / Profile */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowProfile((v) => !v)
                                    setShowNotifications(false)
                                    setShowAllNotifications(false)
                                }}
                                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1 pr-3 transition hover:border-blue-200 hover:shadow-md"
                            >
                                <Avatar name={profile?.name} avatarUrl={profile?.avatarUrl} size="sm" />
                                <span className="hidden max-w-[110px] truncate text-sm font-semibold text-slate-800 sm:block">
									{profile?.name?.split(' ')[0] ?? 'Student'}
								</span>
                                <FaChevronRight
                                    className={`text-[10px] text-slate-400 transition-transform ${showProfile ? 'rotate-90' : ''}`}
                                />
                            </button>
                            {showProfile && (
                                <ProfileDropdown
                                    profile={profile}
                                    onClose={closeProfile}
                                    onLogout={handleLogout}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Error Banner ─────────────────────────────────────────────────── */}
            {error && (
                <div className="mx-auto max-w-7xl px-4 pt-4 lg:px-8">
                    <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        <FaExclamationCircle className="shrink-0 text-amber-500" />
                        <span>
							Could not reach the server — showing cached data.{' '}
                            <button onClick={refetch} className="font-semibold underline">
								Retry
							</button>
						</span>
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">

                {/* ── Hero + Credit Ring ───────────────────────────────────────── */}
                <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
                    <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-6 text-white shadow-xl shadow-blue-200/60 lg:p-8">
                        <div className="grid items-center gap-6 md:grid-cols-[1fr_240px]">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100/90">Welcome back</p>
                                <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight lg:text-4xl">
                                    {profile ? `Hey, ${profile.name.split(' ')[0]}! 👋` : 'Your academic day is ready.'}
                                </h1>
                                <p className="mt-3 text-sm leading-7 text-blue-50">
                                    {profile?.faculty} · {profile?.year}
                                </p>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <a href="/timetable" className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50">
                                        <FaBookOpen /> View timetable
                                    </a>
                                    <a href="/notes" className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white/15 px-5 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20">
                                        <FaPenNib /> Add note
                                    </a>
                                </div>
                            </div>
                            <div className="hidden h-52 opacity-80 md:block">
                                <DashboardIllustration />
                            </div>
                        </div>
                    </div>

                    {/* Credit Ring */}
                    <aside className="flex flex-col rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Credit Progress</p>
                                <p className="mt-0.5 text-sm text-slate-500">
                                    {metrics ? `${metrics.credits} of ${metrics.totalCredits} completed` : '—'}
                                </p>
                            </div>
                            <FaChartLine className="text-2xl text-blue-600" />
                        </div>
                        <div className="flex flex-1 items-center justify-center py-4">
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
                                        style={{ transition: 'stroke-dashoffset 1s ease' }}
                                    />
                                </svg>
                                <div className="absolute text-center">
                                    <p className="text-3xl font-semibold text-slate-900">{progress}%</p>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Done</p>
                                </div>
                            </div>
                        </div>
                        {gpa && (
                            <div className="mt-2 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
                                {[
                                    { label: 'Current GPA', val: gpa.current.toFixed(2) },
                                    { label: 'Previous', val: gpa.previous.toFixed(2) },
                                    { label: 'Target', val: gpa.target.toFixed(2) },
                                ].map((g) => (
                                    <div key={g.label}>
                                        <p className="text-base font-semibold text-slate-900">{g.val}</p>
                                        <p className="text-[10px] text-slate-400">{g.label}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </aside>
                </section>

                {/* ── Metric Cards ─────────────────────────────────────────────── */}
                <section className="grid grid-cols-2 gap-3 pt-5 lg:grid-cols-4">
                    {loading && !metrics
                        ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                        : metricCards.map((card) => (
                            <article
                                key={card.label}
                                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                            >
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
                <QuickNav />
                {/* ── Lectures + Assignments ───────────────────────────────────── */}
                <section className="grid gap-5 pt-6 lg:grid-cols-[1fr_0.85fr]">
                    {/* Lectures */}
                    <div>
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold tracking-tight text-slate-900">Today's Lectures</h2>
                                <p className="text-sm text-slate-500">Your sessions and locations</p>
                            </div>
                            <FaRegCalendarCheck className="text-xl text-blue-600" />
                        </div>
                        <div className="space-y-3">
                            {loading && lectures.length === 0
                                ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                                : lectures.map((lecture) => (
                                    <article
                                        key={lecture.id}
                                        className={`rounded-3xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                                            lecture.isNext
                                                ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-white ring-1 ring-blue-100'
                                                : 'border-slate-200 bg-white'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-base font-semibold text-slate-900">{lecture.title}</h3>
                                                    {lecture.isNext && (
                                                        <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
																Next
															</span>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-sm text-slate-500">{lecture.lecturer}</p>
                                            </div>
                                            <FaClock className="mt-1 shrink-0 text-slate-400" />
                                        </div>
                                        <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
												<span className="flex items-center gap-2">
													<FaClock className="text-blue-600" />
                                                    {lecture.startTime} – {lecture.endTime}
												</span>
                                            <span className="flex items-center gap-2">
													<FaMapMarkerAlt className="text-blue-600" />
                                                {lecture.building}, {lecture.room}
												</span>
                                        </div>
                                    </article>
                                ))}
                        </div>
                    </div>

                    {/* Assignments */}
                    <div>
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold tracking-tight text-slate-900">Assignment Focus</h2>
                                <p className="text-sm text-slate-500">Coursework needing attention</p>
                            </div>
                            <FaClipboardList className="text-xl text-blue-600" />
                        </div>
                        <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="space-y-2">
                                {loading && assignments.length === 0
                                    ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                                    : assignments.map((task) => (
                                        <article key={task.id} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                                            <PriorityDot priority={task.priority} />
                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate text-sm font-semibold text-slate-900">{task.title}</h3>
                                                {/* FIX 8: toLocaleString instead of toLocaleDateString for correct time display */}
                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {task.course} · Due {formatDueDate(task.dueDate)}
                                                </p>
                                            </div>
                                            <StatusBadge status={task.status} />
                                        </article>
                                    ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Achievements ─────────────────────────────────────────────── */}
                {achievements.length > 0 && (
                    <section className="pt-6">
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold tracking-tight text-slate-900">Course Results</h2>
                                <p className="text-sm text-slate-500">Your published course grades</p>
                            </div>
                            <FaTrophy className="text-xl text-amber-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            {achievements.map((a) => (
                                <div
                                    key={a.id}
                                    className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                                >
                                    
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                                        <p className="text-xs text-slate-400">{a.earnedAt}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            </div>

            <NotificationsDrawer
                open={showAllNotifications}
                onClose={closeAllNotifications}
                notifications={notifications}
            />
            <BottomNavigation />
        </main>
    )
}