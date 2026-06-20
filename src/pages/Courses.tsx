import { useCallback, useEffect, useState } from 'react'
import {
    FaArrowLeft,
    FaBookOpen,
    FaClock,
    FaGraduationCap,
    FaRedo,
    FaWifi,
    FaExclamationCircle,
    FaCheckCircle,
    FaChartBar,
} from 'react-icons/fa'

const API_BASE = 'https://smart-campus-web-api.vercel.app'

interface Course {
    id?: number
    code: string
    name: string
    credits: number
    grade?: string
    status?: string
}

interface Result {
    course: string
    grade: string
}

const GRADE_POINTS: Record<string, number> = {
    'A+': 4.0, A: 4.0, 'A-': 3.7,
    'B+': 3.3, B: 3.0, 'B-': 2.7,
    'C+': 2.3, C: 2.0, 'C-': 1.7,
    D: 1.0, F: 0,
}

function gradeColor(grade: string): string {
    const pts = GRADE_POINTS[grade.trim().toUpperCase()] ?? 0
    if (pts >= 3.3) return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
    if (pts >= 2.0) return 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
    return 'bg-rose-50 text-rose-700 ring-1 ring-rose-100'
}

// Demo enrolled courses for when API doesn't have a courses endpoint
export default function Courses() {
    const [courses, setCourses] = useState<Course[]>([])
    const [results, setResults] = useState<Result[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('token') || localStorage.getItem('smart-campus-token') || ''
            : ''

    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const headers = { Authorization: `Bearer ${token}` }
            const [coursesRes, resultsRes] = await Promise.all([
                fetch(`${API_BASE}/api/courses`, { headers }),
                fetch(`${API_BASE}/api/results`, { headers }),
            ])
            const coursesData = await coursesRes.json()
            const resultsData = await resultsRes.json()
            if (!coursesRes.ok) throw new Error(coursesData.message || 'Failed to fetch courses')
            if (!resultsRes.ok) throw new Error(resultsData.message || 'Failed to fetch results')
            const rawCourses = Array.isArray(coursesData) ? coursesData : (coursesData.data ?? [])
            const rawResults = Array.isArray(resultsData) ? resultsData : (resultsData.data ?? [])
            setCourses(rawCourses as Course[])
            setResults(rawResults as Result[])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not load data')
        } finally {
            setLoading(false)
        }
    }, [token])

    useEffect(() => { void fetchData() }, [fetchData])

    // Merge courses with results by course code or name
    const enrichedCourses: (Course & { grade?: string })[] = courses.map(c => {
        const result = results.find(r =>
            r.course.toLowerCase().includes(c.name.toLowerCase().split(' ')[0]) ||
            r.course.toLowerCase() === c.name.toLowerCase() ||
            (c.code && r.course.toLowerCase().includes(c.code.toLowerCase()))
        )
        return { ...c, grade: result?.grade }
    })

    const allGrades = results.map(r => GRADE_POINTS[r.grade.trim().toUpperCase()] ?? 0)
    const gpa = allGrades.length ? allGrades.reduce((a, b) => a + b, 0) / allGrades.length : null
    const totalCredits = enrichedCourses.reduce((s, c) => s + c.credits, 0)

    return (
        <main className="relative min-h-screen bg-slate-50 text-slate-900">
            <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-blue-100/70 via-sky-50/40 to-transparent" />

            <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 lg:px-8">
                    <a href="/dashboard" className="flex min-w-0 items-center gap-2.5">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200">
                            <FaWifi />
                        </span>
                        <span className="min-w-0">
                            <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-blue-600">Smart Campus</span>
                            <span className="block truncate text-sm font-semibold text-slate-900">My Courses</span>
                        </span>
                    </a>
                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={() => void fetchData()}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 active:scale-95"
                        >
                            <FaRedo className={loading ? 'animate-spin text-blue-500' : ''} />
                        </button>
                        <a
                            href="/dashboard"
                            className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                            <FaArrowLeft className="text-xs" />
                            <span className="hidden sm:inline">Dashboard</span>
                        </a>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-3xl px-4 py-5 lg:px-8 lg:py-8">
                {/* Hero */}
                <section className="mb-5 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-5 text-white shadow-xl shadow-blue-200/60 lg:p-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-100/90">Academic record</p>
                    <h1 className="mt-1.5 text-xl font-semibold tracking-tight lg:text-3xl">My Courses</h1>
                    <div className="mt-3 flex flex-wrap gap-3">
                        <div className="rounded-2xl bg-white/15 px-4 py-2 text-center">
                            <p className="text-lg font-semibold">{enrichedCourses.length}</p>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-100">Enrolled</p>
                        </div>
                        <div className="rounded-2xl bg-white/15 px-4 py-2 text-center">
                            <p className="text-lg font-semibold">{totalCredits}</p>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-100">Credits</p>
                        </div>
                        {gpa !== null && (
                            <div className="rounded-2xl bg-white/15 px-4 py-2 text-center">
                                <p className="text-lg font-semibold">{gpa.toFixed(2)}</p>
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-100">GPA</p>
                            </div>
                        )}
                    </div>
                </section>

                {error && (
                    <div className="mb-4 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        <FaExclamationCircle className="shrink-0 text-amber-500" />
                        {error} — showing enrolled courses only.
                    </div>
                )}

                {/* GPA breakdown */}
                {gpa !== null && (
                    <section className="mb-5 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-3 flex items-center gap-2">
                            <FaChartBar className="text-blue-600" />
                            <p className="text-sm font-semibold text-slate-900">GPA Overview</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-1">
                                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-400 transition-all duration-700"
                                        style={{ width: `${(gpa / 4.0) * 100}%` }}
                                    />
                                </div>
                                <p className="mt-1.5 text-xs text-slate-500">{gpa.toFixed(2)} / 4.00</p>
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="text-2xl font-semibold text-slate-900">{gpa.toFixed(2)}</p>
                                <p className="text-xs text-slate-400">Current GPA</p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Course list */}
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5">
                                <div className="h-4 w-2/3 rounded bg-slate-100" />
                                <div className="mt-2 h-3 w-1/3 rounded bg-slate-100" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Results from API */}
                        {results.length > 0 && (
                            <>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Graded Results</p>
                                {results.map((r, i) => (
                                    <article key={i} className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                            <FaGraduationCap />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-slate-900">{r.course}</p>
                                            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                                <FaCheckCircle className="text-emerald-500" />
                                                Completed
                                            </div>
                                        </div>
                                        <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${gradeColor(r.grade)}`}>
                                            {r.grade}
                                        </span>
                                    </article>
                                ))}
                            </>
                        )}

                        {/* Enrolled courses */}
                        <p className="pt-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                            {results.length > 0 ? 'Current Semester' : 'Enrolled Courses'}
                        </p>
                        {enrichedCourses.filter(c => !c.grade).map((course, i) => (
                            <article key={i} className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 ring-1 ring-slate-200">
                                    <FaBookOpen />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-slate-900">{course.name}</p>
                                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                        <FaClock className="text-slate-400" />
                                        {course.credits} credits · {course.code}
                                    </div>
                                </div>
                                <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 ring-1 ring-blue-100">
                                    In Progress
                                </span>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}