interface CreditProgressProps {
    earned: number
    required: number
    gpa?: number | null
}

/**
 * Credit progress bar with optional GPA display.
 * Matches the blue/indigo design system used across the dashboard.
 */
export default function CreditProgress({ earned, required, gpa }: CreditProgressProps) {
    const percentage = Math.min(100, Math.round((earned / required) * 100))

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-slate-900">Credit Progress</p>
                    <p className="mt-0.5 text-sm text-slate-500">
                        {earned} of {required} completed
                    </p>
                </div>
                <span className="text-2xl font-semibold text-blue-600">{percentage}%</span>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-400 transition-all duration-700"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {gpa !== undefined && gpa !== null && (
                <div className="mt-4 border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-500">Current GPA</p>
                        <p className="text-base font-semibold text-slate-900">{gpa.toFixed(2)}</p>
                    </div>
                </div>
            )}

            <p className="mt-3 text-xs text-slate-400">
                {required - earned} credits remaining to graduation
            </p>
        </section>
    )
}
