import type { Assignment } from '../../types/Assignment'

interface AssignmentCardProps {
    assignment: Assignment
    onToggleComplete?: (id: string) => void
}

const STATUS_STYLES: Record<string, string> = {
    Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    Pending: 'bg-blue-50 text-blue-700 ring-blue-100',
}

/**
 * Compact assignment card for use in lists and widgets.
 * For the full-featured page with edit/delete/filter, see src/pages/Assignments.tsx.
 */
export default function AssignmentCard({ assignment, onToggleComplete }: AssignmentCardProps) {
    const isPast = new Date(assignment.dueDate).getTime() < Date.now()
    const statusLabel = assignment.completed ? 'Completed' : isPast ? 'Overdue' : 'Pending'
    const statusStyle = assignment.completed
        ? STATUS_STYLES.Completed
        : isPast
            ? 'bg-rose-50 text-rose-700 ring-rose-100'
            : STATUS_STYLES.Pending

    return (
        <article
            className={`flex items-start gap-3 rounded-3xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                assignment.completed
                    ? 'border-slate-100 bg-slate-50/70 opacity-70'
                    : 'border-slate-200 bg-white'
            }`}
        >
            {onToggleComplete && (
                <button
                    type="button"
                    onClick={() => onToggleComplete(assignment.id)}
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                        assignment.completed
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-slate-300 hover:border-blue-400'
                    }`}
                    aria-label={assignment.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                    {assignment.completed && (
                        <svg viewBox="0 0 10 8" className="h-2.5 w-2.5" fill="currentColor">
                            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </button>
            )}

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <h3
                        className={`text-sm font-semibold ${
                            assignment.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                        }`}
                    >
                        {assignment.title}
                    </h3>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${statusStyle}`}>
                        {statusLabel}
                    </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{assignment.subject}</p>
                <p className={`mt-1 text-xs font-medium ${
                    !assignment.completed && isPast ? 'text-rose-600' : 'text-slate-500'
                }`}>
                    Due {new Date(assignment.dueDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                })}
                </p>
            </div>
        </article>
    )
}
