export interface NotePage {
    id: string
    imageDataUrl: string
    capturedAt: string
}

export interface SavedNote {
    id: string
    title: string
    pages: NotePage[]
    createdAt: string
}

const STORAGE_KEY = 'smart-campus-notes'

export function loadNotes(): SavedNote[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        return JSON.parse(raw) as SavedNote[]
    } catch {
        return []
    }
}

export function saveNote(note: SavedNote): void {
    const notes = loadNotes()
    notes.unshift(note)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export function deleteNote(id: string): void {
    const notes = loadNotes().filter((note) => note.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export function getNoteById(id: string): SavedNote | undefined {
    return loadNotes().find((note) => note.id === id)
}
