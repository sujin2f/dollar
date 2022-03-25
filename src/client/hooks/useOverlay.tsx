import React, {
    useRef,
    MouseEvent,
    PropsWithChildren,
    CSSProperties,
} from 'react'
import { useGlobalOption } from './useGlobalOption'

export const useOverlay = () => {
    const { closeComponents } = useGlobalOption()
    const overlayRef = useRef<HTMLDivElement>(null)

    const mayCloseComponent = (e: MouseEvent) => {
        if (e.target !== overlayRef.current) {
            return
        }
        closeComponents()
    }

    type Props = PropsWithChildren<{
        className?: string
        style?: CSSProperties
    }>
    const Overlay = (props: Props): JSX.Element => {
        const { className, style } = props
        return (
            <div
                className={className}
                style={style}
                ref={overlayRef}
                onClick={(e) => mayCloseComponent(e)}
            >
                {props.children}
            </div>
        )
    }

    return { overlayRef, mayCloseComponent, Overlay }
}
