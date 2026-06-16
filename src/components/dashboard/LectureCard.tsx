import { FaClock, FaMapMarkerAlt } from 'react-icons/fa'
import type { Lecture } from '../../types/Lecture'

interface LectureCardProps {
    lecture: Lecture
    isNext?: boolean
}

/**
 * Compact lecture card for use in lists and widgets.
 * Pass `isNext` to highlight it as the upcoming lecture.
 */
export default function LectureCard({ lecture, isNext = false }: LectureCardProps) {
    return (
        <article
            className={`rounded-3xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                isNext
                    ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-white ring-1 ring-blue-100'
                    : 'border-slate-200 bg-white'
            }`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-slate-900">{lecture.subject}</h3>
                        {isNext && (
                            <span className="shrink-0 rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                Next
                            </span>
                        )}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{lecture.lecturer}</p>
                </div>
            </div>

            <div className="mt-3 grid gap-1.5 text-xs text-slate-600 sm:grid-cols-2">
                <span className="flex items-center gap-1.5">
                    <FaClock className="shrink-0 text-blue-500" />
                    {lecture.time}
                </span>
                <span className="flex items-center gap-1.5">
                    <FaMapMarkerAlt className="shrink-0 text-blue-500" />
                    {lecture.location}
                </span>
            </div>
        </article>
    )
}
