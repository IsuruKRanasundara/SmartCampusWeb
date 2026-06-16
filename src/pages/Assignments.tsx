import { useState } from 'react'
import {
    FaArrowLeft,
    FaCheckCircle,
    FaClipboardList,
    FaFilter,
    FaPlus,
    FaSortAmountDown,
    FaTimes,
    FaTrash,
    FaWifi,
} from 'react-icons/fa'
import {
    AssignmentProvider,
    useAssignments,
} from '../context/AssignmentContext'
import type { Assignment, AssignmentPriority, AssignmentStatus } from '../context/AssignmentContext'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDueDate(iso: string): string {
    const d = new Date(iso)
    const now = new Date()
    const diff = d.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    if (days < 0) return `Overdue by ${Math.abs(days)}d`
    if (days === 0) return 'Due today'
    if (days === 1) return 'Due tomorrow'
    return `Due in ${days} days`
}

function dueDateColor(iso: string, completed: boolean): string {
    if (completed) return 'text-slate-400'
    const days = Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (days < 0) return 'text-rose-600 font-semibold'
    if (days <= 2) return 'text-amber-600 font-semibold'
    return 'text-slate-500'
}

const STATUS_STYLES: Record<AssignmentStatus, string> = {
    'Not Started': 'bg-slate-50 text-slate-600 ring-slate-200',
    'In Progress': 'bg-blue-50 text-blue-700 ring-blue-100',
    Draft: 'bg-amber-50 text-amber-700 ring-amber-100',
    Review: 'bg-violet-50 text-violet-700 ring-violet-100',
    Submitted: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
}

const PRIORITY_DOT: Record<AssignmentPriority, string> = {
    high: 'bg-rose-500',
    medium: 'bg-amber-400',
    low: 'bg-emerald-400',
}

// ─── Add-Assignment Modal ─────────────────────────────────────────────────────

function AddAssignmentModal({ onClose }: { onClose: () => void }) {
    const { addAssignment } = useAssignments()
    const [title, setTitle] = useState('')
    const [subject, setSubject] = useState('')
    const [course, setCourse] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [status, setStatus] = useState<AssignmentStatus>('Not Started')
    const [priority, setPriority] = useState<AssignmentPriority>('medium')
    const [notes, setNotes] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = () => {
        if (!title.trim() || !dueDate.trim()) {
            setError('Title and due date are required.')
            return
        }
        addAssignment({
            title: title.trim(),
            subject: subject.trim() || 'General',
            course: course.trim() || 'GEN',
            dueDate,
            status,
            priority,
            notes: notes.trim(),
            completed: false,
        })
        onClose()
    }

    const fieldClass = 'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100'

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />
            <div className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-lg -translate-y-1/2 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4">
                    <p className="font-semibold text-white">New Assignment</p>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 text-white hover:bg-white/25"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="space-y-4 p-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                Title <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Mobile UI Prototype"
                                className={fieldClass}
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="e.g. Human Computer Interaction"
                                className={fieldClass}
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Course code</label>
                            <input
                                type="text"
                                value={course}
                                onChange={(e) => setCourse(e.target.value)}
                                placeholder="e.g. HCI"
                                className={fieldClass}
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                Due date <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className={fieldClass}
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as AssignmentPriority)}
                                className={fieldClass}
                            >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as AssignmentStatus)}
                                className={fieldClass}
                            >
                                {(['Not Started', 'In Progress', 'Draft', 'Review', 'Submitted'] as const).map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Optional notes or reminders…"
                                rows={2}
                                className={`${fieldClass} resize-none`}
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</p>
                    )}

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="flex-1 rounded-2xl bg-gradient-to-r from-blue-700 to-sky-500 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                        >
                            Add assignment
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

// ─── Assignment Card ──────────────────────────────────────────────────────────

function AssignmentItem({ assignment }: { assignment: Assignment }) {
    const { toggleComplete, deleteAssignment, updateAssignment } = useAssignments()

    return (
        <article
            className={`flex items-start gap-3 rounded-3xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                assignment.completed
                    ? 'border-slate-100 bg-slate-50/70 opacity-70'
                    : 'border-slate-200 bg-white'
            }`}
        >
            <button
                type="button"
                onClick={() => toggleComplete(assignment.id)}
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                    assignment.completed
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-slate-300 hover:border-blue-400'
                }`}
                aria-label={assignment.completed ? 'Mark incomplete' : 'Mark complete'}
            >
                {assignment.completed && <FaCheckCircle className="text-xs" />}
            </button>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start gap-2">
                    <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[assignment.priority]}`} />
                    <h3
                        className={`text-sm font-semibold ${
                            assignment.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                        }`}
                    >
                        {assignment.title}
                    </h3>
                    <span
                        className={`ml-auto shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${STATUS_STYLES[assignment.status]}`}
                    >
                        {assignment.status}
                    </span>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                    {assignment.course} · {assignment.subject}
                </p>

                <p className={`mt-1 text-xs ${dueDateColor(assignment.dueDate, assignment.completed)}`}>
                    {formatDueDate(assignment.dueDate)}
                </p>

                {assignment.notes && (
                    <p className="mt-2 rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-600">{assignment.notes}</p>
                )}

                {/* Quick status update */}
                {!assignment.completed && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {(['In Progress', 'Draft', 'Review'] as AssignmentStatus[]).map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => updateAssignment(assignment.id, { status: s })}
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 transition ${
                                    assignment.status === s
                                        ? STATUS_STYLES[s]
                                        : 'bg-slate-50 text-slate-500 ring-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={() => {
                    if (window.confirm('Delete this assignment?')) deleteAssignment(assignment.id)
                }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                aria-label="Delete assignment"
            >
                <FaTrash className="text-xs" />
            </button>
        </article>
    )
}

// ─── Inner Page (must be inside AssignmentProvider) ───────────────────────────

type SortKey = 'dueDate' | 'priority' | 'status'
type FilterKey = 'all' | 'pending' | 'completed' | 'overdue'

const PRIORITY_ORDER: Record<AssignmentPriority, number> = { high: 0, medium: 1, low: 2 }

function AssignmentsInner() {
    const { state, getOverdue } = useAssignments()
    const [showModal, setShowModal] = useState(false)
    const [filter, setFilter] = useState<FilterKey>('all')
    const [sortBy, setSortBy] = useState<SortKey>('dueDate')

    const overdue = getOverdue()

    const filtered = state.items.filter((a) => {
        if (filter === 'pending') return !a.completed
        if (filter === 'completed') return a.completed
        if (filter === 'overdue') return !a.completed && new Date(a.dueDate).getTime() < Date.now()
        return true
    })

    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'dueDate') return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        if (sortBy === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
        return a.status.localeCompare(b.status)
    })

    const pending = state.items.filter((a) => !a.completed).length
    const completed = state.items.filter((a) => a.completed).length

    const filterOptions: { key: FilterKey; label: string; count: number }[] = [
        { key: 'all', label: 'All', count: state.items.length },
        { key: 'pending', label: 'Pending', count: pending },
        { key: 'overdue', label: 'Overdue', count: overdue.length },
        { key: 'completed', label: 'Done', count: completed },
    ]

    return (
        <main className="relative min-h-screen bg-slate-50 text-slate-900">
            <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-blue-100/70 via-sky-50/40 to-transparent" />

            <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
                    <a href="/dashboard" className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200">
                            <FaWifi className="text-lg" />
                        </span>
                        <span>
                            <span className="block text-[10px] font-bold uppercase tracking-[0.26em] text-blue-600">Smart Campus</span>
                            <span className="block text-sm font-semibold leading-tight text-slate-900">Assignments</span>
                        </span>
                    </a>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="inline-flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 px-4 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                        >
                            <FaPlus className="text-xs" />
                            Add
                        </button>
                        <a
                            href="/dashboard"
                            className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                            <FaArrowLeft className="text-xs" />
                            Dashboard
                        </a>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8 lg:py-8">

                {/* Hero */}
                <section className="mb-5 overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-6 text-white shadow-xl shadow-blue-200/60 lg:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100/90">Coursework tracker</p>
                    <h1 className="mt-2 text-2xl font-semibold tracking-tight lg:text-3xl">Your assignments</h1>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <div className="rounded-2xl bg-white/15 px-4 py-2 text-center">
                            <p className="text-xl font-semibold">{pending}</p>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-100">Pending</p>
                        </div>
                        <div className="rounded-2xl bg-white/15 px-4 py-2 text-center">
                            <p className="text-xl font-semibold text-rose-300">{overdue.length}</p>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-100">Overdue</p>
                        </div>
                        <div className="rounded-2xl bg-white/15 px-4 py-2 text-center">
                            <p className="text-xl font-semibold text-emerald-300">{completed}</p>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-100">Done</p>
                        </div>
                    </div>
                </section>

                {/* Overdue warning */}
                {overdue.length > 0 && (
                    <div className="mb-4 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                        <FaClipboardList className="shrink-0 text-rose-500" />
                        <span>
                            You have <strong>{overdue.length}</strong> overdue assignment{overdue.length > 1 ? 's' : ''}.
                        </span>
                    </div>
                )}

                {/* Filters + Sort */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {filterOptions.map((opt) => (
                            <button
                                key={opt.key}
                                type="button"
                                onClick={() => setFilter(opt.key)}
                                className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                                    filter === opt.key
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200/50'
                                        : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600'
                                }`}
                            >
                                <FaFilter className={`mr-1 inline text-[9px] ${filter === opt.key ? '' : 'opacity-0'}`} />
                                {opt.label}
                                {opt.count > 0 && (
                                    <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${filter === opt.key ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        {opt.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <FaSortAmountDown className="text-xs text-slate-400" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortKey)}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 outline-none transition focus:border-blue-300"
                        >
                            <option value="dueDate">By due date</option>
                            <option value="priority">By priority</option>
                            <option value="status">By status</option>
                        </select>
                    </div>
                </div>

                {/* List */}
                {sorted.length === 0 ? (
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-sm">
                        <FaClipboardList className="mx-auto text-3xl text-slate-300" />
                        <p className="mt-4 text-sm font-semibold text-slate-700">No assignments here</p>
                        <p className="mt-1 text-xs text-slate-400">
                            {filter === 'all' ? 'Add your first assignment to get started.' : 'Try a different filter.'}
                        </p>
                        {filter === 'all' && (
                            <button
                                type="button"
                                onClick={() => setShowModal(true)}
                                className="mt-5 inline-flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-sky-500 px-5 text-sm font-semibold text-white shadow-md"
                            >
                                <FaPlus className="text-xs" />
                                Add assignment
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sorted.map((a) => (
                            <AssignmentItem key={a.id} assignment={a} />
                        ))}
                    </div>
                )}
            </div>

            {showModal && <AddAssignmentModal onClose={() => setShowModal(false)} />}
        </main>
    )
}

// ─── Exported Page (wraps provider) ──────────────────────────────────────────

export default function Assignments() {
    return (
        <AssignmentProvider>
            <AssignmentsInner />
        </AssignmentProvider>
    )
}
