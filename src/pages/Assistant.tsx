import { useCallback, useEffect, useRef, useState } from 'react'
import {
    FaArrowLeft,
    FaPaperPlane,
    FaRobot,
    FaUser,
    FaWifi,
    FaLightbulb,
} from 'react-icons/fa'

const API_BASE = 'https://smart-campus-web-api.vercel.app'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

interface Topic {
    topic: string
    examples: string[]
}

const SUGGESTED_QUESTIONS = [
    'What classes do I have today?',
    'What assignments are pending?',
    'What are my grades?',
    'Is the library open?',
    'Show me upcoming events',
    'Any new announcements?',
]

export default function Assistant() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Hi! I'm your Smart Campus assistant. Ask me about your timetable, assignments, results, announcements, facilities, or upcoming events.",
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [topics, setTopics] = useState<Topic[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('token') || localStorage.getItem('smart-campus-token') || ''
            : ''

    useEffect(() => {
        fetch(`${API_BASE}/api/assistant/topics`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((d) => setTopics(d.topics ?? []))
            .catch(() => {})
    }, [token])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = useCallback(async (question: string) => {
        const trimmed = question.trim()
        if (!trimmed || loading) return

        const userMsg: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content: trimmed,
            timestamp: new Date(),
        }
        setMessages((prev) => [...prev, userMsg])
        setInput('')
        setLoading(true)

        try {
            const res = await fetch(`${API_BASE}/api/assistant/ask`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: trimmed }),
            })
            const data = await res.json()
            const answer: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: data.answer || 'Sorry, I could not get an answer. Please try again.',
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, answer])
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: "Sorry, I'm having trouble connecting. Please check your connection and try again.",
                    timestamp: new Date(),
                },
            ])
        } finally {
            setLoading(false)
            inputRef.current?.focus()
        }
    }, [loading, token])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        void sendMessage(input)
    }

    function formatTime(date: Date) {
        return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <main className="flex h-screen flex-col bg-slate-50 text-slate-900">
            {/* Header */}
            <header className="shrink-0 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
                    <a href="/dashboard" className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200">
                            <FaWifi className="text-lg" />
                        </span>
                        <span>
                            <span className="block text-[10px] font-bold uppercase tracking-[0.26em] text-blue-600">Smart Campus</span>
                            <span className="block text-sm font-semibold leading-tight text-slate-900">AI Assistant</span>
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

            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden px-4 lg:px-8">
                {/* Suggested questions — only when at welcome state */}
                {messages.length <= 1 && (
                    <div className="shrink-0 py-4">
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            <FaLightbulb className="text-amber-400" />
                            Try asking
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {SUGGESTED_QUESTIONS.map((q) => (
                                <button
                                    key={q}
                                    type="button"
                                    onClick={() => void sendMessage(q)}
                                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-left text-xs font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            {/* Avatar */}
                            <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl text-sm ${
                                    msg.role === 'assistant'
                                        ? 'bg-gradient-to-br from-blue-600 to-sky-500 text-white'
                                        : 'bg-slate-200 text-slate-600'
                                }`}
                            >
                                {msg.role === 'assistant' ? <FaRobot /> : <FaUser />}
                            </div>

                            {/* Bubble */}
                            <div className={`max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                                <div
                                    className={`rounded-3xl px-4 py-3 text-sm leading-6 whitespace-pre-line ${
                                        msg.role === 'user'
                                            ? 'bg-gradient-to-br from-blue-600 to-sky-500 text-white rounded-br-lg'
                                            : 'border border-slate-200 bg-white text-slate-800 rounded-bl-lg shadow-sm'
                                    }`}
                                >
                                    {msg.content}
                                </div>
                                <span className="mt-1 px-1 text-[10px] text-slate-400">
                                    {formatTime(msg.timestamp)}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {loading && (
                        <div className="flex items-end gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white text-sm">
                                <FaRobot />
                            </div>
                            <div className="rounded-3xl rounded-bl-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                                <div className="flex gap-1 items-center h-4">
                                    <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Topics chips — compact hint strip */}
                {topics.length > 0 && (
                    <div className="shrink-0 flex gap-2 overflow-x-auto border-t border-slate-100 py-2 pb-1">
                        {topics.map((t) => (
                            <button
                                key={t.topic}
                                type="button"
                                onClick={() => void sendMessage(t.examples[0])}
                                className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                                {t.topic}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <form onSubmit={handleSubmit} className="shrink-0 flex gap-3 border-t border-slate-100 py-4">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about timetable, assignments, results…"
                        className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-md transition hover:opacity-90 disabled:opacity-40"
                    >
                        <FaPaperPlane />
                    </button>
                </form>
            </div>
        </main>
    )
}
