import { useEffect, useRef, useState } from 'react'
import {
    FaArrowLeft,
    FaBookOpen,
    FaCamera,
    FaCheckCircle,
    FaEdit,
    FaEnvelope,
    FaGraduationCap,
    FaIdCard,
    FaSave,
    FaShieldAlt,
    FaTimes,
    FaTrophy,
    FaWifi,
} from 'react-icons/fa'
import { api } from '../utils/api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileData {
    name: string
    email: string
    studentId: string
    faculty: string
    year: string
    avatarUrl: string | null
    completedCredits: number
    totalCredits: number
    gpa: number | null
}

interface ApiProfile {
    data: {
        id: number
        name: string
        faculty: string
        degree: string
        completedCredits: number
        totalCredits: number
    }
}
interface ApiResultUpper {


        data:ApiResult[]


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

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({
                    name,
                    avatarUrl,
                    size = 'lg',
                    onClick,
                }: {
    name?: string
    avatarUrl?: string | null
    size?: 'sm' | 'md' | 'lg' | 'xl'
    onClick?: () => void
}) {
    const sizeMap = {
        sm: 'h-10 w-10 text-sm',
        md: 'h-14 w-14 text-base',
        lg: 'h-20 w-20 text-2xl',
        xl: 'h-28 w-28 text-4xl',
    }
    const initials = name
        ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
        : '?'

    const base = `${sizeMap[size]} rounded-full object-cover ring-4 ring-white shadow-xl`

    if (avatarUrl) {
        return (
            <img
                src={avatarUrl}
                alt={name}
                className={`${base} ${onClick ? 'cursor-pointer' : ''}`}
                onClick={onClick}
            />
        )
    }

    return (
        <div
            className={`${base} flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            {initials}
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Profile() {
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [results, setResults] = useState<ApiResult[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [editName, setEditName] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [saveSuccess, setSaveSuccess] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const [apiProfile, apiResultsUpper] = await Promise.all([
                    api.get<ApiProfile>('/api/users/profile'),
                    api.get<ApiResultUpper>('/api/results'),
                ])
                const apiResults:ApiResult[]=apiResultsUpper.data;
                const storedEmail = localStorage.getItem('smart-campus-user-email') ?? ''
                // FIX 1: Removed `debugger` statement that was halting execution

                const gpa = apiResults.length > 0
                    ? apiResults.reduce((sum: number, r: { grade: string }) => sum + (GRADE_POINTS[r.grade.trim().toUpperCase()] ?? 0), 0) / apiResults.length
                    : null

                setProfile({
                    name: apiProfile.data.name,
                    email: storedEmail,
                    studentId: String(apiProfile.data.id),
                    faculty: apiProfile.data.faculty,
                    year: apiProfile.data.degree,
                    avatarUrl: null,
                    completedCredits: apiProfile.data.completedCredits,
                    totalCredits: apiProfile.data.totalCredits,
                    gpa,
                })
                setResults(apiResults)
            } catch {
                // Fallback to localStorage data
                const storedEmail = localStorage.getItem('smart-campus-user-email') ?? ''
                const storedData = (() => {
                    try {
                        return JSON.parse(localStorage.getItem('data') ?? '{}') as {
                            user?: { name?: string; id?: string }
                        }
                    } catch { return {} }
                })()
                setProfile({
                    name: storedData.user?.name ?? 'Student',
                    email: storedEmail,
                    studentId: storedData.user?.id ?? '—',
                    faculty: 'Faculty of Computing',
                    year: '3rd Year',
                    avatarUrl: null,
                    completedCredits: 72,
                    totalCredits: 120,
                    gpa: 3.72,
                })
            } finally {
                setLoading(false)
            }
        }
        void load()
    }, [])

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
            setProfile((prev) => prev ? { ...prev, avatarUrl: reader.result as string } : prev)
        }
        reader.readAsDataURL(file)
    }

    // FIX 2: handleSave now correctly applies editName to the saved profile
    const handleSave = async () => {
        if (!profile) return
        setSaving(true)
        setError(null)
        try {
            const updatedName = editName.trim() || profile.name
            setProfile((prev) => prev ? { ...prev, name: updatedName } : prev)
            setEditMode(false)
            setSaveSuccess(true)
            setTimeout(() => setSaveSuccess(false), 3000)
        } catch {
            setError('Failed to save changes. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const progress = profile
        ? Math.round((profile.completedCredits / profile.totalCredits) * 100)
        : 0

    if (loading) {
        return (
            <main className="relative min-h-screen bg-slate-50">
                <div className="mx-auto max-w-3xl px-4 py-16 text-center">
                    <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
                    <p className="mt-4 text-sm text-slate-500">Loading your profile…</p>
                </div>
            </main>
        )
    }

    return (
        <main className="relative min-h-screen bg-slate-50 text-slate-900">
            <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-blue-100/70 via-sky-50/40 to-transparent" />

            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
                    <a href="/dashboard" className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200">
                            <FaWifi className="text-lg" />
                        </span>
                        <span>
                            <span className="block text-[10px] font-bold uppercase tracking-[0.26em] text-blue-600">Smart Campus</span>
                            <span className="block text-sm font-semibold leading-tight text-slate-900">My Profile</span>
                        </span>
                    </a>
                    <a
                        href="/dashboard"
                        className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                        <FaArrowLeft className="text-xs" />
                        Dashboard
                    </a>
                </div>
            </header>

            <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8 lg:py-8">

                {/* Hero card */}
                <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 shadow-xl shadow-blue-200/60">
                    <div className="p-6 lg:p-8">
                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
                            <div className="relative">
                                <Avatar
                                    name={profile?.name}
                                    avatarUrl={profile?.avatarUrl}
                                    size="xl"
                                    onClick={() => fileInputRef.current?.click()}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-md transition hover:bg-blue-700"
                                    title="Change photo"
                                >
                                    <FaCamera className="text-xs" />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                            <div className="text-center sm:text-left">
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="rounded-xl bg-white/20 px-3 py-1 text-2xl font-semibold text-white outline-none ring-2 ring-white/40 placeholder:text-white/60"
                                        placeholder={profile?.name}
                                        autoFocus
                                    />
                                ) : (
                                    <h1 className="text-2xl font-semibold text-white lg:text-3xl">{profile?.name}</h1>
                                )}
                                <p className="mt-1 text-sm text-blue-100">{profile?.email}</p>
                                <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                                        {profile?.studentId}
                                    </span>
                                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                                        {profile?.year}
                                    </span>
                                </div>
                            </div>
                            <div className="sm:ml-auto">
                                {editMode ? (
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => { setEditMode(false); setError(null) }}
                                            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-white transition hover:bg-white/30"
                                        >
                                            <FaTimes />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => void handleSave()}
                                            disabled={saving}
                                            className="inline-flex h-10 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-semibold text-blue-700 shadow-md disabled:opacity-60"
                                        >
                                            <FaSave />
                                            {saving ? 'Saving…' : 'Save'}
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => { setEditMode(true); setEditName(profile?.name ?? '') }}
                                        className="inline-flex h-10 items-center gap-2 rounded-2xl bg-white/20 px-4 text-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/30"
                                    >
                                        <FaEdit />
                                        Edit profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Credit bar */}
                    <div className="border-t border-white/20 bg-white/10 px-6 py-4 lg:px-8">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-white">
                                {profile?.completedCredits} / {profile?.totalCredits} credits completed
                            </span>
                            <span className="font-semibold text-white">{progress}%</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/25">
                            <div
                                className="h-full rounded-full bg-white transition-all duration-700"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </section>

                {error && (
                    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {saveSuccess && (
                    <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        <FaCheckCircle />
                        Profile updated successfully.
                    </div>
                )}

                {/* Details grid */}
                <section className="mt-5 grid gap-4 sm:grid-cols-2">
                    {[
                        { icon: <FaEnvelope />, label: 'Email', value: profile?.email },
                        { icon: <FaIdCard />, label: 'Student ID', value: profile?.studentId },
                        { icon: <FaGraduationCap />, label: 'Faculty', value: profile?.faculty },
                        { icon: <FaBookOpen />, label: 'Year / Degree', value: profile?.year },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                                {item.icon}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-slate-500">{item.label}</p>
                                <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">{item.value ?? '—'}</p>
                            </div>
                        </div>
                    ))}
                </section>

                {/* GPA + Stats */}
                <section className="mt-5 grid grid-cols-3 gap-4">
                    <div className="col-span-1 flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <FaTrophy className="text-2xl text-amber-500" />
                        <p className="mt-2 text-2xl font-semibold text-slate-900">
                            {profile?.gpa !== null ? profile?.gpa?.toFixed(2) : '—'}
                        </p>
                        <p className="text-xs text-slate-500">Current GPA</p>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <FaCheckCircle className="text-2xl text-emerald-500" />
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{profile?.completedCredits}</p>
                        <p className="text-xs text-slate-500">Credits done</p>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <FaShieldAlt className="text-2xl text-blue-500" />
                        <p className="mt-2 text-2xl font-semibold text-slate-900">
                            {profile ? profile.totalCredits - profile.completedCredits : '—'}
                        </p>
                        <p className="text-xs text-slate-500">Credits left</p>
                    </div>
                </section>

                {/* Course results */}
                {results.length > 0 && (
                    <section className="mt-5">
                        <h2 className="mb-3 text-lg font-semibold text-slate-900">Course Results</h2>
                        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                            {results.map((r, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between border-b border-slate-50 px-5 py-3 last:border-0"
                                >
                                    <span className="text-sm font-medium text-slate-800">{r.course}</span>
                                    {/* FIX 3: Normalized grade lookup with .trim() to match fetch-time calculation */}
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                                            (GRADE_POINTS[r.grade.trim().toUpperCase()] ?? 0) >= 3.3
                                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                                                : (GRADE_POINTS[r.grade.trim().toUpperCase()] ?? 0) >= 2.0
                                                    ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
                                                    : 'bg-rose-50 text-rose-700 ring-1 ring-rose-100'
                                        }`}
                                    >
                                        {r.grade}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Logout */}
                <div className="mt-6 flex justify-center">
                    <button
                        type="button"
                        onClick={() => {
                            localStorage.clear()
                            window.location.href = '/login'
                        }}
                        className="inline-flex h-11 items-center gap-2 rounded-2xl border border-rose-200 px-6 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </main>
    )
}