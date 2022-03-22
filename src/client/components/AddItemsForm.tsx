import React, {
    Dispatch,
    SetStateAction,
    FormEvent,
    useRef,
    Fragment,
    ChangeEvent,
    useState,
} from 'react'
import { RawItem } from 'src/types/model'
import {
    rawTextToRawItem,
    getRawItemMeta,
    RawItemMeta,
} from 'src/client/utils/item'
import { Column, Row, Button, Select, Input } from 'src/client/components'
import { TableHeader } from 'src/types/table'

type Props = {
    changeInput: Dispatch<SetStateAction<RawItem[]>>
}
export const AddItemsForm = (props: Props): JSX.Element => {
    const defaultMeta = {
        separate: '\t',
        columns: {} as Record<TableHeader, [number, string]>,
        dateFormat: '',
    }

    const rawTextField = useRef<HTMLTextAreaElement>(null)
    const dateFormatField = useRef<HTMLSelectElement>(null)
    const [meta, changeMeta] = useState<RawItemMeta>(defaultMeta)
    const [fieldOptions, changeFieldOptions] = useState<string[]>([])

    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
        const text = rawTextField.current?.value || ''
        props.changeInput(rawTextToRawItem(text, meta))
    }

    const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const changedMeta = getRawItemMeta(e.currentTarget.value)

        const options = Object.values(changedMeta.columns).map((col) => col[1])
        changeMeta(changedMeta)
        changeFieldOptions(['', ...options])
    }

    const onChangeOption = (field: string, e?: ChangeEvent<Element>) => {
        if (!e || !e.currentTarget) {
            return
        }

        const target = Object.keys(meta.columns)
            .filter(
                (key) => key === (e.currentTarget as HTMLInputElement).value,
            )
            .map((key) => meta.columns[key])
            .pop()

        if (target) {
            const newMeta = {
                ...meta,
                columns: {
                    ...meta.columns,
                    [field]: target,
                },
            }
            changeMeta(newMeta)
        }
    }

    return (
        <Fragment>
            <Row>
                <Column small={6}>
                    <Select
                        options={['Auto Detect', 'DD/MM/YYYY']}
                        reference={dateFormatField}
                        label="Date Format"
                        id="date-format"
                        value={meta.dateFormat}
                        onChange={(e) => onChangeOption('date-format', e)}
                    />
                </Column>
                <Column small={6}>
                    <Input
                        label="Separator"
                        value={meta.separate}
                        required
                        onChange={(e) => onChangeOption('separator', e)}
                    />
                </Column>
            </Row>
            <Row>
                <Column small={3}>
                    <Select
                        options={fieldOptions}
                        reference={dateFormatField}
                        label="Date Field"
                        id="date-filed"
                        value={meta.columns.date && meta.columns.date[1]}
                        onChange={(e) => onChangeOption('date', e)}
                    />
                </Column>
                <Column small={3}>
                    <Select
                        options={fieldOptions}
                        reference={dateFormatField}
                        label="Title Field"
                        id="title-field"
                        value={meta.columns.title && meta.columns.title[1]}
                        onChange={(e) => onChangeOption('title', e)}
                    />
                </Column>
                <Column small={3}>
                    <Select
                        options={fieldOptions}
                        reference={dateFormatField}
                        label="Debit Field"
                        id="debit-field"
                        value={meta.columns.debit && meta.columns.debit[1]}
                        onChange={(e) => onChangeOption('debit', e)}
                    />
                </Column>
                <Column small={3}>
                    <Select
                        options={fieldOptions}
                        reference={dateFormatField}
                        label="Credit Field"
                        id="credit-field"
                        value={meta.columns.credit && meta.columns.credit[1]}
                        onChange={(e) => onChangeOption('credit', e)}
                    />
                </Column>
            </Row>
            <Row>
                <Column>
                    <textarea
                        ref={rawTextField}
                        defaultValue=""
                        rows={12}
                        onChange={onChange}
                        autoFocus
                    />
                </Column>
            </Row>
            <Row>
                <Column>
                    <Button onClick={onSubmit} />
                </Column>
            </Row>
        </Fragment>
    )
}
