import React, { Fragment, useRef, useState } from 'react'
import { useCategory, useGlobalOption } from 'src/client/hooks'
import { Button } from 'src/common/components/forms/Button'
import { Input } from 'src/common/components/forms/Input'
import { Select } from 'src/common/components/forms/Select'
import { ColorPicker } from 'src/common/components/forms/ColorPicker'
import { BW } from 'src/constants/color'

export const CategoryEditor = (): JSX.Element => {
    const { categoryEditorOpened: category, closeCategoryEditor } =
        useGlobalOption()
    const { getRootCategories, updateCategory } = useCategory()

    // References
    const nameRef = useRef<HTMLInputElement>(null)
    const colorRef = useRef<HTMLInputElement>(null)
    const parentRef = useRef<HTMLSelectElement>(null)

    const [nameError, setNameError] = useState<string>('')

    const categoryOptions = getRootCategories().reduce(
        (acc, cat) => ({
            ...acc,
            [cat._id]: cat.title,
        }),
        {
            '': 'No Parent',
        },
    )

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

        updateCategory({
            variables: {
                category: {
                    _id: category?._id,
                    disabled: category?.disabled,
                    title: nameRef.current?.value,
                    color: colorRef.current?.value,
                    parent: parentRef.current?.value,
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
                    color={category?.color || BW.GREY}
                    label="Color"
                    ref={colorRef}
                />

                {(!category?.children || !category.children.length) && (
                    <Select
                        label="Parent"
                        defaultValue={category?.parent}
                        options={categoryOptions}
                        ref={parentRef}
                    />
                )}
            </form>
            <Button onClick={onSubmit} autoFocus title="Update Category" />
        </Fragment>
    )
}
