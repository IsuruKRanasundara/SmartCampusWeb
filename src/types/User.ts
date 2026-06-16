export interface User {
    id: string
    name: string
    email: string
    registrationNumber: string
    faculty: string
    year: string
    avatarUrl: string | null
    completedCredits: number
    totalCredits: number
    gpa?: number | null
}
