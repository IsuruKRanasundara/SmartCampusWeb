import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import type { Assignment } from '../../types/Assignment'

interface AssignmentFormProps {
    onSave: (assignment: Assignment) => void
    onCancel?: () => void
}

/**
 * Inline assignment creation form.
 * For a full-featured modal version, see src/pages/Assignments.tsx (AddAssignmentModal).
 */
export default function AssignmentForm({ onSave, onCancel }: AssignmentFormProps) {
    const [title, setTitle] = useState('')
    const [subject, setSubject] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [error, setError] = useState('')

    const fieldClass =
        'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100'

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')

        if (!title.trim()) {
            setError('Please enter an assignment title.')
            return
        }
        if (!dueDate.trim()) {
            setError('Please enter a due date.')
            return
        }

        onSave({
            id: crypto.randomUUID(),
            title: title.trim(),
            subject: subject.trim() || 'General',
            dueDate: dueDate.trim(),
            completed: false,
        })

        setTitle('')
        setSubject('')
        setDueDate('')
        setError('')
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-blue-100 bg-blue-50/50 p-5 shadow-sm"
        >
            <p className="mb-4 text-sm font-semibold text-slate-800">New assignment</p>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                        Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Database ER Diagram"
                        className={fieldClass}
                        autoFocus
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">Subject</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Database Systems"
                        className={fieldClass}
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                        Due date <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className={fieldClass}
                    />
                </div>
            </div>

            {error && (
                <p className="mt-3 rounded-xl bg-rose-50 px-4 py-2 text-xs text-rose-700">{error}</p>
            )}

            <div className="mt-4 flex gap-3">
                <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                >
                    <FaPlus className="text-xs" />
                    Add assignment
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    )
}
