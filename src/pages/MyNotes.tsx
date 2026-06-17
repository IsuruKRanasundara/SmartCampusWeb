import { useState } from 'react'
import {
    FaArrowLeft,
    FaCamera,
    FaChevronLeft,
    FaChevronRight,
    FaImages,
    FaPlus,
    FaTrash,
    FaWifi,
} from 'react-icons/fa'
import { deleteNote, loadNotes, type SavedNote } from '../utils/notesStorage'

function formatDate(iso: string) {
    return new Date(iso).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export default function MyNotes() {
    const [notes, setNotes] = useState<SavedNote[]>(() => loadNotes())
    const [viewingNote, setViewingNote] = useState<SavedNote | null>(null)
    const [pageIndex, setPageIndex] = useState(0)

    const handleDelete = (id: string) => {
        if (!window.confirm('Delete this note and all its pages?')) return
        deleteNote(id)
        setNotes(loadNotes())
        if (viewingNote?.id === id) {
            setViewingNote(null)
            setPageIndex(0)
        }
    }

    const openNote = (note: SavedNote) => {
        setViewingNote(note)
        setPageIndex(0)
    }

    const currentPage = viewingNote?.pages[pageIndex]

    return (
        <main className="relative min-h-screen bg-slate-50 text-slate-900">
            <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-blue-100/70 via-sky-50/40 to-transparent" />

            <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
                    <a href="/dashboard" className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200">
                            <FaWifi className="text-lg" />
                        </span>
                        <span>
                            <span className="block text-[10px] font-bold uppercase tracking-[0.26em] text-blue-600">
                                Smart Campus
                            </span>
                            <span className="block text-sm font-semibold leading-tight text-slate-900">
                                My Notes
                            </span>
                        </span>
                    </a>
                    <div className="flex items-center gap-2">
                        <a
                            href="/notes"
                            className="inline-flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 px-4 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                        >
                            <FaPlus className="text-xs" />
                           Note
                        </a>
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

            <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
                <section className="mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-6 text-white shadow-xl shadow-blue-200/60 lg:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100/90">Saved documents</p>
                    <h1 className="mt-2 text-2xl font-semibold tracking-tight lg:text-3xl">Your uploaded notes</h1>
                    <p className="mt-2 text-sm text-blue-50">
                        {notes.length} note{notes.length === 1 ? '' : 's'} stored on this device
                    </p>
                </section>

                {notes.length === 0 ? (
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-sm">
                        <FaCamera className="mx-auto text-4xl text-slate-300" />
                        <p className="mt-4 text-lg font-semibold text-slate-900">No notes yet</p>
                        <p className="mt-2 text-sm text-slate-500">
                            Capture document pages with your camera and they will appear here.
                        </p>
                        <a
                            href="/notes"
                            className="mt-6 inline-flex h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 px-5 text-sm font-semibold text-white shadow-lg"
                        >
                            <FaCamera />
                            Scan a document
                        </a>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {notes.map((note) => (
                            <article
                                key={note.id}
                                className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                <button
                                    type="button"
                                    onClick={() => openNote(note)}
                                    className="block w-full text-left"
                                >
                                    {note.pages[0] ? (
                                        <img
                                            src={note.pages[0].imageDataUrl}
                                            alt={note.title}
                                            className="h-40 w-full object-cover bg-slate-100"
                                        />
                                    ) : (
                                        <div className="flex h-40 items-center justify-center bg-slate-100 text-slate-400">
                                            <FaImages className="text-3xl" />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h3 className="truncate font-semibold text-slate-900">{note.title}</h3>
                                        <p className="mt-1 text-xs text-slate-500">{formatDate(note.createdAt)}</p>
                                        <p className="mt-2 text-xs font-medium text-blue-600">
                                            {note.pages.length} page{note.pages.length === 1 ? '' : 's'}
                                        </p>
                                    </div>
                                </button>
                                <div className="border-t border-slate-100 px-4 py-2">
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(note.id)}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                                    >
                                        <FaTrash />
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {viewingNote && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
                        onClick={() => setViewingNote(null)}
                        aria-hidden="true"
                    />
                    <div className="fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[90vh] max-w-3xl -translate-y-1/2 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4">
                            <div className="min-w-0">
                                <p className="truncate font-semibold text-white">{viewingNote.title}</p>
                                <p className="text-xs text-blue-100">
                                    Page {pageIndex + 1} of {viewingNote.pages.length}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setViewingNote(null)}
                                className="rounded-xl bg-white/15 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/25"
                            >
                                Close
                            </button>
                        </div>

                        {currentPage && (
                            <img
                                src={currentPage.imageDataUrl}
                                alt={`${viewingNote.title} page ${pageIndex + 1}`}
                                className="max-h-[60vh] w-full object-contain bg-slate-100"
                            />
                        )}

                        {viewingNote.pages.length > 1 && (
                            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
                                <button
                                    type="button"
                                    disabled={pageIndex === 0}
                                    onClick={() => setPageIndex((i) => i - 1)}
                                    className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                                >
                                    <FaChevronLeft />
                                    Previous
                                </button>
                                <div className="flex gap-1">
                                    {viewingNote.pages.map((_, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setPageIndex(i)}
                                            className={`h-2 w-2 rounded-full transition ${
                                                i === pageIndex ? 'bg-blue-600' : 'bg-slate-300'
                                            }`}
                                            aria-label={`Go to page ${i + 1}`}
                                        />
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    disabled={pageIndex === viewingNote.pages.length - 1}
                                    onClick={() => setPageIndex((i) => i + 1)}
                                    className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                                >
                                    Next
                                    <FaChevronRight />
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </main>
    )
}
