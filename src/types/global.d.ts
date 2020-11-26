/** Global definitions for development **/

// for style loader
declare module '*.(css|scss|sass|less|styl|png|jpg|gif|svg)' {
    const content: any
    export default content
}

// declare module '*.svg' {
//     const content: any
//     export default content
// }

// Omit type https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-377567046
// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type PartialPick<T, K extends keyof T> = Partial<T> & Pick<T, K>
