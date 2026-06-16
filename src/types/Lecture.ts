export interface Lecture {
    id: string
    subject: string
    lecturer: string
    time: string
    location: string
    building?: string
    endTime?: string
    isNext?: boolean
    isNow?: boolean
}
