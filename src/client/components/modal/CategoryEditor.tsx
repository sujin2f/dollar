import React, { Fragment, useRef, useState } from 'react'
import { useCategory, useGlobalOption } from 'src/client/hooks'
import { Button, Input, ColorPicker } from 'src/client/components'
import { BW } from 'src/constants/color'

export const CategoryEditor = (): JSX.Element => {
    const { categoryEditorOpened: category, closeCategoryEditor } =
        useGlobalOption()
    const { updateCategory } = useCategory()

    const nameRef = useRef<HTMLInputElement>(null)
    const [nameError, setNameError] = useState<string>('')
    const [categoryColor, setCategoryColor] = useState<string>(
        category?.color || BW.BLACK,
    )

    const onColorChange = (color: string) => {
        setCategoryColor(color)
    }

    const isError = () => {
        let error = false
        if (!nameRef.current?.value) {
            setNameError('Name is required.')
            error = true
        }
        return error
    }

    const onSubmit = () => {
        if (isError()) {
            return
        }
        console.log({
            _id: category?._id,
            title: nameRef.current?.value,
            color: categoryColor,
            disabled: category?.disabled,
            children: [],
            parent: '',
        })
        return
        updateCategory({
            variables: {
                category: {
                    _id: category?._id,
                    title: nameRef.current?.value,
                    color: categoryColor,
                    disabled: category?.disabled,
                    children: [],
                    parent: '',
                },
            },
        })
        closeCategoryEditor()
    }

    return (
        <Fragment>
            <h1>Update Category</h1>
            <form onSubmit={onSubmit}>
                <Input
                    label="Name"
                    defaultValue={category?.title}
                    reference={nameRef}
                    errorMessage={nameError}
                    onEnterKeyDown={onSubmit}
                    required
                />

                <ColorPicker
                    color={categoryColor}
                    onChange={onColorChange}
                    label="Color"
                />
            </form>
            <Button onClick={onSubmit} autoFocus title="Update Category" />
        </Fragment>
    )
}
