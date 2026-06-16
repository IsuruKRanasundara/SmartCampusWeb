import { useCallback, useEffect, useRef, useState } from 'react'
import {
    FaArrowLeft,
    FaCamera,
    FaCheck,
    FaImage,
    FaRedo,
    FaTrash,
    FaUpload,
    FaWifi,
} from 'react-icons/fa'
import { loadNotes, saveNote, type NotePage } from '../utils/notesStorage'

type CameraStatus = 'idle' | 'active' | 'denied' | 'unsupported'

export default function NotesUpload() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)

    const [cameraStatus, setCameraStatus] = useState<CameraStatus>('idle')
    const [pages, setPages] = useState<NotePage[]>([])
    const [title, setTitle] = useState('')
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [uploadSuccess, setUploadSuccess] = useState(false)
    const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')

    const [cameraRetry, setCameraRetry] = useState(0)

    const stopCamera = useCallback(() => {
        streamRef.current?.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        if (videoRef.current) videoRef.current.srcObject = null
    }, [])

    useEffect(() => {
        let cancelled = false

        async function initCamera() {
            if (!navigator.mediaDevices?.getUserMedia) {
                if (!cancelled) setCameraStatus('unsupported')
                return
            }

            stopCamera()

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode,
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                    },
                    audio: false,
                })
                if (cancelled) {
                    stream.getTracks().forEach((track) => track.stop())
                    return
                }
                streamRef.current = stream
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                    await videoRef.current.play()
                }
                setCameraStatus('active')
            } catch {
                if (!cancelled) setCameraStatus('denied')
            }
        }

        void initCamera()
        return () => {
            cancelled = true
            stopCamera()
        }
    }, [facingMode, cameraRetry, stopCamera])

    const capturePage = () => {
        const video = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas || cameraStatus !== 'active') return

        const width = video.videoWidth
        const height = video.videoHeight
        if (!width || !height) return

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.drawImage(video, 0, 0, width, height)
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.92)
        const page: NotePage = {
            id: crypto.randomUUID(),
            imageDataUrl,
            capturedAt: new Date().toISOString(),
        }

        setPages((prev) => [...prev, page])
        setSelectedPageId(page.id)
    }

    const removePage = (id: string) => {
        setPages((prev) => prev.filter((p) => p.id !== id))
        setSelectedPageId((current) => (current === id ? null : current))
    }

    const handleUpload = async () => {
        if (pages.length === 0 || !title.trim()) return

        setUploading(true)
        setUploadSuccess(false)

        await new Promise((resolve) => setTimeout(resolve, 600))

        saveNote({
            id: crypto.randomUUID(),
            title: title.trim(),
            pages,
            createdAt: new Date().toISOString(),
        })

        setUploading(false)
        setUploadSuccess(true)
        setPages([])
        setTitle('')
        setSelectedPageId(null)
    }

    const savedCount = loadNotes().length
    const selectedPage = pages.find((p) => p.id === selectedPageId) ?? pages[pages.length - 1]

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
                                Document Notes
                            </span>
                        </span>
                    </a>
                    <div className="flex items-center gap-2">
                        <a
                            href="/my-notes"
                            className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                            My notes
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
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100/90">Scan &amp; save</p>
                    <h1 className="mt-2 text-2xl font-semibold tracking-tight lg:text-3xl">
                        Capture document pages with your camera
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-blue-50">
                        Position each page inside the frame, capture all sides, then upload as a single note.
                        {savedCount > 0 && ` You have ${savedCount} saved note${savedCount === 1 ? '' : 's'} locally.`}
                    </p>
                </section>

                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    {/* Camera panel */}
                    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                            <div className="flex items-center gap-2">
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <FaCamera />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Camera preview</p>
                                    <p className="text-xs text-slate-500">Align the full document in view</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFacingMode((m) => (m === 'environment' ? 'user' : 'environment'))}
                                className="rounded-2xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                                Flip camera
                            </button>
                        </div>

                        <div className="relative aspect-[4/3] bg-slate-900">
                            {cameraStatus === 'active' && (
                                <>
                                    <video
                                        ref={videoRef}
                                        playsInline
                                        muted
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="pointer-events-none absolute inset-6 rounded-2xl border-2 border-dashed border-white/50" />
                                    <div className="pointer-events-none absolute bottom-4 left-0 right-0 text-center text-xs font-medium text-white/80">
                                        Fit entire page inside the frame
                                    </div>
                                </>
                            )}

                            {cameraStatus === 'idle' && (
                                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                    Starting camera…
                                </div>
                            )}

                            {cameraStatus === 'denied' && (
                                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                                    <FaCamera className="text-3xl text-slate-500" />
                                    <p className="text-sm font-medium text-slate-300">Camera access denied</p>
                                    <p className="text-xs text-slate-500">
                                        Allow camera permission in your browser settings, then retry.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setCameraRetry((n) => n + 1)}
                                        className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                                    >
                                        <FaRedo /> Retry
                                    </button>
                                </div>
                            )}

                            {cameraStatus === 'unsupported' && (
                                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-400">
                                    Camera is not supported in this browser.
                                </div>
                            )}

                            <canvas ref={canvasRef} className="hidden" />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-4">
                            <p className="text-sm text-slate-500">
                                {pages.length} page{pages.length === 1 ? '' : 's'} captured
                            </p>
                            <button
                                type="button"
                                onClick={capturePage}
                                disabled={cameraStatus !== 'active'}
                                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-200/60 transition hover:opacity-90 disabled:opacity-40"
                            >
                                <FaCamera />
                                Capture page
                            </button>
                        </div>
                    </div>

                    {/* Upload panel */}
                    <div className="space-y-4">
                        {selectedPage && (
                            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                                <div className="border-b border-slate-100 px-5 py-3">
                                    <p className="text-sm font-semibold text-slate-900">Latest preview</p>
                                </div>
                                <img
                                    src={selectedPage.imageDataUrl}
                                    alt="Captured document page"
                                    className="max-h-56 w-full object-contain bg-slate-100"
                                />
                            </div>
                        )}

                        {pages.length > 0 && (
                            <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
                                <p className="mb-3 text-sm font-semibold text-slate-900">Captured pages</p>
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {pages.map((page, index) => (
                                        <div key={page.id} className="relative shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedPageId(page.id)}
                                                className={`block overflow-hidden rounded-xl border-2 transition ${
                                                    selectedPage?.id === page.id
                                                        ? 'border-blue-500 ring-2 ring-blue-100'
                                                        : 'border-slate-200'
                                                }`}
                                            >
                                                <img
                                                    src={page.imageDataUrl}
                                                    alt={`Page ${index + 1}`}
                                                    className="h-20 w-16 object-cover"
                                                />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removePage(page.id)}
                                                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white shadow"
                                                aria-label={`Remove page ${index + 1}`}
                                            >
                                                <FaTrash />
                                            </button>
                                            <span className="mt-1 block text-center text-[10px] text-slate-400">
                                                {index + 1}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                            <label htmlFor="note-title" className="text-sm font-semibold text-slate-900">
                                Note title
                            </label>
                            <input
                                id="note-title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Database Systems — Lecture 4"
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                            />

                            <button
                                type="button"
                                onClick={() => void handleUpload()}
                                disabled={uploading || pages.length === 0 || !title.trim()}
                                className="mt-4 flex w-full h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 text-sm font-semibold text-white shadow-lg shadow-blue-200/60 transition hover:opacity-90 disabled:opacity-40"
                            >
                                {uploading ? (
                                    'Uploading…'
                                ) : (
                                    <>
                                        <FaUpload /> Upload note ({pages.length} page{pages.length === 1 ? '' : 's'})
                                    </>
                                )}
                            </button>

                            {uploadSuccess && (
                                <div className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                                    <div className="flex items-center gap-2">
                                        <FaCheck />
                                        Note saved successfully!
                                    </div>
                                    <a href="/my-notes" className="mt-2 inline-block font-semibold underline">
                                        View in My Notes
                                    </a>
                                </div>
                            )}

                            {pages.length === 0 && (
                                <p className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                                    <FaImage />
                                    Capture at least one page to upload
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
