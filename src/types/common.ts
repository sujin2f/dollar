export type Fn<T extends unknown[] = void[], R = void> = (...param: T) => R

export type Nullable<T> = T | null | undefined

export interface ReactChildrenProps {
    children?: string | JSX.Element[] | JSX.Element
}
