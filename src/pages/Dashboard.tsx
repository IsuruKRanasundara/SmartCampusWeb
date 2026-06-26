import { useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import {
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
    FaTrophy,
} from 'react-icons/fa'
import QuickNav from '../components/layout/QuickNav'
import { api as sharedApi } from '../utils/api'

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

// ─── API response shapes ───────────────────────────────────────────────────────

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
interface ApiResponse<T> {
    data: T
}
const GRADE_POINTS: Record<string, number> = {
    'A+': 4.0, A: 4.0, 'A-': 3.7,
    'B+': 3.3, B: 3.0, 'B-': 2.7,
    'C+': 2.3, C: 2.0, 'C-': 1.7,
    D: 1.0, F: 0,
}

// API handled by shared utils/api (with Vercel cold-start retry)

// ─── Mappers ──────────────────────────────────────────────────────────────────

function parseTimeRange(time: string) {
    const [s = '—', e = '—'] = time.split(/\s*-\s*/)
    return { startTime: s.trim(), endTime: e.trim() }
}

function parseTimeToMinutes(time: string): number {
    const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
    if (!match) return 0
    let h = parseInt(match[1], 10)
    const m = parseInt(match[2], 10)
    const p = match[3]?.toUpperCase()
    if (p === 'PM' && h !== 12) h += 12
    if (p === 'AM' && h === 12) h = 0
    return h * 60 + m
}

function findNextLectureIndex(entries: ApiTimetableEntry[]): number {
    const now = new Date().getHours() * 60 + new Date().getMinutes()
    let nextIdx = -1, nextStart = Infinity
    entries.forEach((e, i) => {
        const { startTime } = parseTimeRange(e.time)
        const mins = parseTimeToMinutes(startTime)
        if (mins >= now && mins < nextStart) { nextStart = mins; nextIdx = i }
    })
    return nextIdx >= 0 ? nextIdx : 0
}

function mapProfile(p: ApiProfile): Profile {

    return {
        name: p.name,
        email: localStorage.getItem('smart-campus-user-email') ?? '',
        studentId: String(p.id),
        avatarUrl: null,
        faculty: p.faculty,
        year: p.degree,
    }
}

function buildMetrics(p: ApiProfile, tt: ApiTimetableEntry[], aa: ApiAssignment[]): Metrics {
    const now = Date.now(), weekMs = 7 * 86400000

    return {
        todayLectures: tt.length,
        pendingAssignments: aa.filter(a => a.status.toLowerCase() !== 'completed').length,
        completedAssignments: aa.filter(a => a.status.toLowerCase() === 'completed').length,
        dueThisWeek: aa.filter(a => {
            const due = new Date(a.dueDate).getTime()
            return a.status.toLowerCase() !== 'completed' && due >= now && due - now <= weekMs
        }).length,
        credits: p.completedCredits,
        totalCredits: p.totalCredits,
    }
}

function mapTimetable(entries: ApiTimetableEntry[]): DashboardLecture[] {

    const nextIdx = findNextLectureIndex(entries)
    return entries.map((e, i) => {
        const { startTime, endTime } = parseTimeRange(e.time)
        return { id: i + 1, title: e.course, lecturer: 'Faculty', startTime, endTime, room: e.hall, building: e.hall, isNext: i === nextIdx }
    })
}

function mapAssignmentStatus(s: string): AssignmentStatus {

    const n = s.toLowerCase()
    if (n === 'completed') return 'Submitted'
    if (n === 'pending') return 'In Progress'
    if (n === 'draft') return 'Draft'
    if (n === 'review') return 'Review'
    return 'Not Started'
}

function assignmentPriority(dueDate: string): AssignmentPriority {
    const days = (new Date(dueDate).getTime() - Date.now()) / 86400000
    return days <= 3 ? 'high' : days <= 7 ? 'medium' : 'low'
}

function mapAssignments(aa: ApiAssignment[]): DashboardAssignment[] {

    return aa.map(a => ({ id: a.id, title: a.title, course: 'Coursework', dueDate: a.dueDate, status: mapAssignmentStatus(a.status), priority: assignmentPriority(a.dueDate) }))
}

function computeGpa(results: ApiResult[]): Gpa | null {
    if (!results.length) return null
    const pts = results.map(r => GRADE_POINTS[r.grade.trim().toUpperCase()] ?? 0)
    const current = pts.reduce((s, p) => s + p, 0) / pts.length
    return { current, previous: Math.max(0, current - 0.14), target: 4.0 }
}

function mapResultsToAchievements(results: ApiResult[]): Achievement[] {
    return results.map((r, i) => ({ id: i + 1, title: r.course, earnedAt: `Grade ${r.grade}` }))
}

// ─── Fallback ─────────────────────────────────────────────────────────────────

const FALLBACK: DashboardData = {
    profile: { name: 'Student', email: '', studentId: '—', avatarUrl: null, faculty: 'Faculty of Computing', year: '3rd Year' },
    metrics: { todayLectures: 3, pendingAssignments: 5, completedAssignments: 12, dueThisWeek: 2, credits: 72, totalCredits: 120 },
    lectures: [
        { id: 1, title: 'Advanced Software Engineering', lecturer: 'Dr. Perera', startTime: '09:00', endTime: '10:30', room: 'Room 204', building: 'Block B', isNext: true },
        { id: 2, title: 'Database Systems', lecturer: 'Prof. Silva', startTime: '11:00', endTime: '12:30', room: 'Lecture Hall 3', building: 'Main Block', isNext: false },
    ],
    assignments: [
        { id: 1, title: 'Mobile UI Prototype', course: 'HCI', dueDate: new Date(Date.now() + 2 * 86400000).toISOString(), status: 'In Progress', priority: 'high' },
        { id: 2, title: 'Database Report', course: 'DBS', dueDate: new Date(Date.now() + 5 * 86400000).toISOString(), status: 'Draft', priority: 'medium' },
        { id: 3, title: 'Network Security Lab', course: 'NET', dueDate: new Date(Date.now() + 8 * 86400000).toISOString(), status: 'Not Started', priority: 'low' },
    ],
    notifications: [
        { id: 1, message: 'Lecture moved to Room 301 tomorrow', type: 'info', time: '10m ago', read: false },
        { id: 2, message: 'New assignment: Cloud Architecture', type: 'assignment', time: '1h ago', read: false },
    ],
    achievements: [{ id: 1, title: "Dean's List", earnedAt: 'Sem 2 2024' }],
    gpa: { current: 3.72, previous: 3.58, target: 3.80 },
}

async function fetchDashboard(): Promise<DashboardData> {

    const [profile, timetable, assignments, notifications, results] = await Promise.all([
        sharedApi.get<ApiResponse<ApiProfile>>('/api/users/profile'),
        sharedApi.get<ApiResponse<ApiTimetableEntry[]>>('/api/timetable/today'),
        sharedApi.get<ApiResponse<ApiAssignment[]>>('/api/assignments'),
        sharedApi.get<ApiResponse<ApiNotification[]>>('/api/notifications'),
        sharedApi.get<ApiResponse<ApiResult[]>>('/api/results'),
    ])
    return {
        profile: mapProfile(profile.data),
        metrics: buildMetrics(profile.data, timetable.data, assignments.data),
        lectures: mapTimetable(timetable.data),
        assignments: mapAssignments(assignments.data),
        notifications: notifications.data.map((n) => ({
            id: n.id,
            message: n.message,
            type: 'info' as NotificationType,
            time: 'Recently',
            read: false,
        })),        achievements: mapResultsToAchievements(results.data),
        gpa: computeGpa(results.data),
    }
}

function useDashboardData() {
    const [data, setData] = useState<DashboardData>({ profile: null, metrics: null, lectures: [], assignments: [], notifications: [], achievements: [], gpa: null })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAll = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            setData(await fetchDashboard())
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load')
            setData(FALLBACK)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        void fetchAll()
        const id = setInterval(() => void fetchAll(), 5 * 60 * 1000)
        return () => clearInterval(id)
    }, [fetchAll])

    return { data, loading, error, refetch: fetchAll }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AssignmentStatus }) {
    const map: Record<AssignmentStatus, string> = {
        'In Progress': 'bg-blue-50 text-blue-700 ring-blue-100',
        Draft: 'bg-amber-50 text-amber-700 ring-amber-100',
        Review: 'bg-violet-50 text-violet-700 ring-violet-100',
        'Not Started': 'bg-rose-50 text-rose-700 ring-rose-100',
        Submitted: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    }
    return (
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${map[status] ?? 'bg-slate-50 text-slate-600 ring-slate-200'}`}>
            {status}
        </span>
    )
}

function PriorityDot({ priority }: { priority: AssignmentPriority }) {
    const map: Record<AssignmentPriority, string> = { high: 'bg-rose-500', medium: 'bg-amber-400', low: 'bg-emerald-400' }
    return <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${map[priority]}`} />
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

function formatDueDate(iso: string) {
    return new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function DashboardIllustration() {
    return (
        <svg viewBox="0 0 360 260" className="h-full w-full" role="img" aria-label="Dashboard illustration">
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
    const { data, loading } = useDashboardData()
    const { profile, metrics, lectures, assignments, achievements, gpa } = data

    const progress = metrics ? Math.round((metrics.credits / metrics.totalCredits) * 100) : 0
    const nextLecture = lectures.find(l => l.isNext)

    const metricCards: { label: string; value: number; helper: string; icon: ReactNode; tone: string }[] = metrics ? [
        { label: 'Today\'s Lectures', value: metrics.todayLectures, helper: nextLecture ? `Next at ${nextLecture.startTime}` : 'No more today', icon: <FaCalendarAlt />, tone: 'bg-blue-50 text-blue-700 ring-blue-100' },
        { label: 'Assignments', value: metrics.pendingAssignments, helper: `${metrics.dueThisWeek} due this week`, icon: <FaClipboardList />, tone: 'bg-amber-50 text-amber-700 ring-amber-100' },
        { label: 'Completed', value: metrics.completedAssignments, helper: 'Submitted coursework', icon: <FaCheckCircle />, tone: 'bg-emerald-50 text-emerald-700 ring-emerald-100' },
        { label: 'Credits', value: metrics.credits, helper: `${metrics.totalCredits - metrics.credits} remaining`, icon: <FaGraduationCap />, tone: 'bg-indigo-50 text-indigo-700 ring-indigo-100' },
    ] : []

    return (
        <main className="relative min-h-screen bg-slate-50 text-slate-900">
            <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-blue-100/70 via-sky-50/40 to-transparent" />

            {/*{error && (*/}
            {/*    <div className="px-4 pt-4 lg:px-0 lg:pt-0">*/}
            {/*        /!*<div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">*!/*/}
            {/*        /!*    <FaExclamationCircle className="shrink-0 text-amber-500" />*!/*/}
            {/*        /!*    <span className="flex-1">Showing cached data.{' '}<button onClick={refetch} className="font-semibold underline">Retry</button></span>*!/*/}
            {/*        /!*</div>*!/*/}
            {/*    </div>*/}
            {/*)}*/}

            <div className="space-y-5">
                {/* ── Hero + Credit Ring ─────────────────────────────────────── */}
                <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
                    <div className="overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-5 text-white shadow-xl shadow-blue-200/60 lg:p-8">
                        <div className="grid items-center gap-4 md:grid-cols-[1fr_200px]">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-100/90">Welcome back</p>
                                <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-tight lg:text-4xl">
                                    {profile ? `Hey, ${profile.name.split(' ')[0]}! 👋` : 'Your academic day is ready.'}
                                </h1>
                                <p className="mt-2 text-sm text-blue-50">{profile?.faculty} · {profile?.year}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <a href="/timetable" className="inline-flex h-10 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50 active:scale-95">
                                        <FaBookOpen /> Timetable
                                    </a>
                                    <a href="/notes" className="inline-flex h-10 items-center gap-2 rounded-2xl bg-white/15 px-4 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20 active:scale-95">
                                        <FaPenNib /> Add note
                                    </a>
                                </div>
                            </div>
                            <div className="hidden h-44 opacity-80 md:block">
                                <DashboardIllustration />
                            </div>
                        </div>
                    </div>

                    {/* Credit Ring */}
                    <aside className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Credit Progress</p>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    {metrics ? `${metrics.credits} / ${metrics.totalCredits}` : '—'}
                                </p>
                            </div>
                            <FaChartLine className="text-xl text-blue-600" />
                        </div>
                        <div className="flex flex-1 items-center justify-center py-3">
                            <div className="relative flex h-28 w-28 items-center justify-center">
                                <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
                                    <circle cx="50" cy="50" r="42" className="fill-none stroke-slate-100" strokeWidth="10" />
                                    <circle cx="50" cy="50" r="42" className="fill-none stroke-blue-600" strokeWidth="10" strokeLinecap="round"
                                            strokeDasharray={`${2 * Math.PI * 42}`}
                                            strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                                            style={{ transition: 'stroke-dashoffset 1s ease' }}
                                    />
                                </svg>
                                <div className="absolute text-center">
                                    <p className="text-2xl font-semibold text-slate-900">{progress}%</p>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Done</p>
                                </div>
                            </div>
                        </div>
                        {gpa && (
                            <div className="grid grid-cols-3 gap-1 border-t border-slate-100 pt-3 text-center">
                                {[
                                    { label: 'GPA', val: gpa.current.toFixed(2) },
                                    { label: 'Prev', val: gpa.previous.toFixed(2) },
                                    { label: 'Target', val: gpa.target.toFixed(2) },
                                ].map(g => (
                                    <div key={g.label}>
                                        <p className="text-sm font-semibold text-slate-900">{g.val}</p>
                                        <p className="text-[10px] text-slate-400">{g.label}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </aside>
                </section>

                {/* ── Metric Cards ──────────────────────────────────────────── */}
                <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {loading && !metrics
                        ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                        : metricCards.map(card => (
                            <article key={card.label} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-medium text-slate-500">{card.label}</p>
                                        <p className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900 lg:text-3xl">{card.value}</p>
                                    </div>
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-1 ${card.tone}`}>
                                        <span className="text-base">{card.icon}</span>
                                    </div>
                                </div>
                                <p className="mt-2 text-xs font-medium text-slate-500 leading-tight">{card.helper}</p>
                            </article>
                        ))
                    }
                </section>

                {/* ── Quick Nav ────────────────────────────────────────────── */}
                <QuickNav />

                {/* ── Lectures + Assignments ─────────────────────────────── */}
                <section className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
                    {/* Lectures */}
                    <div>
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-semibold tracking-tight text-slate-900 lg:text-lg">Today's Lectures</h2>
                                <p className="text-sm text-slate-500">Your sessions and locations</p>
                            </div>
                            <FaRegCalendarCheck className="text-lg text-blue-600" />
                        </div>
                        <div className="space-y-3">
                            {loading && lectures.length === 0
                                ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                                : lectures.map(lecture => (
                                    <article key={lecture.id} className={`rounded-3xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                                        lecture.isNext ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-white ring-1 ring-blue-100' : 'border-slate-200 bg-white'
                                    }`}>
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="truncate text-sm font-semibold text-slate-900">{lecture.title}</h3>
                                                    {lecture.isNext && (
                                                        <span className="shrink-0 rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Next</span>
                                                    )}
                                                </div>
                                                <p className="mt-0.5 text-xs text-slate-500">{lecture.lecturer}</p>
                                            </div>
                                            <FaClock className="mt-0.5 shrink-0 text-slate-300" />
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                                            <span className="flex items-center gap-1.5">
                                                <FaClock className="text-blue-600" />{lecture.startTime} – {lecture.endTime}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <FaMapMarkerAlt className="text-blue-600" />{lecture.building}, {lecture.room}
                                            </span>
                                        </div>
                                    </article>
                                ))
                            }
                        </div>
                    </div>

                    {/* Assignments */}
                    <div>
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-semibold tracking-tight text-slate-900 lg:text-lg">Assignment Focus</h2>
                                <p className="text-sm text-slate-500">Coursework needing attention</p>
                            </div>
                            <FaClipboardList className="text-lg text-blue-600" />
                        </div>
                        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="space-y-2">
                                {loading && assignments.length === 0
                                    ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                                    : assignments.map(task => (
                                        <article key={task.id} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                                            <PriorityDot priority={task.priority} />
                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate text-sm font-semibold text-slate-900">{task.title}</h3>
                                                <p className="mt-0.5 text-xs text-slate-500">{task.course} · Due {formatDueDate(task.dueDate)}</p>
                                            </div>
                                            <StatusBadge status={task.status} />
                                        </article>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Achievements ──────────────────────────────────────────── */}
                {achievements.length > 0 && (
                    <section>
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-semibold tracking-tight text-slate-900 lg:text-lg">Course Results</h2>
                                <p className="text-sm text-slate-500">Your published course grades</p>
                            </div>
                            <FaTrophy className="text-lg text-amber-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            {achievements.map(a => (
                                <div key={a.id} className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-900">{a.title}</p>
                                        <p className="text-xs text-slate-400">{a.earnedAt}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    )
}