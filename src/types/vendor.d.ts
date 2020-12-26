declare namespace NodeJS {
    export interface Global {
        app: any
        handle: any
        scatter: any
    }
}

declare module '*.json' {
    const content: any
    export default content
}

declare module '*.styl' {
    const content: any
    export default content
}

declare module '*.svg' {
    const content: any
    export default content
}

declare module '*.png' {
    const content: any
    export default content
}

interface Window {
    wx: any
}

interface IContent<T> {
    current_page: number
    total: number
    data?: T
    results?: T
}

interface IAction {
    payload: IContent<any>
    error?: boolean
}

interface IGetList {
    search?: string
    per_page?: number
    page?: number
}
