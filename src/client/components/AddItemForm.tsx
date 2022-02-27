import React, { useState, useRef, useEffect } from 'react'
import { createItem } from 'src/client/hooks'

export const AddItemForm = (): JSX.Element => {
    const [opened, updateOpened] = useState<boolean>(false)
    const formElement = useRef<HTMLFormElement>(null)
    const titleElement = useRef<HTMLInputElement>(null)
    const dateElement = useRef<HTMLInputElement>(null)

    const openForm = () => {
        updateOpened(true)
        titleElement.current && titleElement.current.focus()
    }
    const closeForm = (
        e: React.MouseEvent | React.KeyboardEvent | React.FormEvent,
    ) => {
        e.preventDefault()
        updateOpened(false)
    }
    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            closeForm(e)
        }
        if (e.key === 'Enter') {
            executeForm(e)
        }
    }
    const executeForm = (e: React.FormEvent) => {
        e.preventDefault()
        const title = titleElement.current?.value
        const expiration = dateElement.current?.value
        if (!title || !expiration) {
            // @todo Error
            return
        }
        createItem(title, expiration)
        titleElement.current!.value = ''
        dateElement.current!.value = ''
        closeForm(e)
    }

    useEffect(() => {
        opened && titleElement.current && titleElement.current.focus()
    }, [titleElement, opened])

    return (
        <section className="form__wrapper form--add-item">
            {opened && (
                <form ref={formElement} className="form" onSubmit={executeForm}>
                    <label htmlFor="name" className="form__label">
                        Item Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        className="form__field"
                        ref={titleElement}
                        onKeyDown={onKeyDown}
                        onFocus={openForm}
                    />
                    <label htmlFor="expiration" className="form__label">
                        Expiration Date
                    </label>
                    <input
                        id="expiration"
                        type="date"
                        className="form__field"
                        onKeyDown={onKeyDown}
                        ref={dateElement}
                    />
                    <div className="button__container">
                        <button onClick={closeForm} className="button">
                            Cancel
                        </button>
                        <button
                            className="button button--primary"
                            type="submit"
                        >
                            Add Item
                        </button>
                    </div>
                </form>
            )}
            {!opened && (
                <button
                    className="form--add-item__trigger"
                    aria-label="Add item"
                    onClick={openForm}
                >
                    <div />
                    <div />
                </button>
            )}
        </section>
    )
}
