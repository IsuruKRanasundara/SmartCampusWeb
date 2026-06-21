import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Shows a native-feeling install banner when the browser fires
 * beforeinstallprompt (Android/Chrome). Dismissed state is persisted
 * so it doesn't keep nagging the user.
 */
export default function PwaInstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [dismissed, setDismissed] = useState(
        () => localStorage.getItem('pwa-banner-dismissed') === '1'
    )

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault() // prevent default mini-infobar on mobile
            setDeferredPrompt(e as BeforeInstallPromptEvent)
        }
        window.addEventListener('beforeinstallprompt', handler)
        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    if (!deferredPrompt || dismissed) return null

    const install = async () => {
        if (!deferredPrompt) return
        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') setDeferredPrompt(null)
        dismiss()
    }

    const dismiss = () => {
        localStorage.setItem('pwa-banner-dismissed', '1')
        setDismissed(true)
    }

    return (
        /* Fixed to bottom on mobile, sits above bottom nav (z-index 45) */
        <div className="fixed bottom-[72px] left-3 right-3 z-45 flex items-center gap-3 rounded-2xl border border-blue-200 bg-white px-4 py-3 shadow-xl shadow-blue-100/60 lg:bottom-4 lg:left-auto lg:right-6 lg:w-80">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Download size={18} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">Install Smart Campus</p>
                <p className="text-xs text-slate-500">Add to home screen for offline access</p>
            </div>
            <button
                onClick={install}
                className="shrink-0 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition active:scale-95"
            >
                Install
            </button>
            <button
                onClick={dismiss}
                className="shrink-0 text-slate-400 transition hover:text-slate-600"
                aria-label="Dismiss"
            >
                <X size={16} />
            </button>
        </div>
    )
}
