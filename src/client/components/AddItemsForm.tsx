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

    // References
    const rawTextField = useRef<HTMLTextAreaElement>(null)
    const dateFormatField = useRef<HTMLSelectElement>(null)
    // States
    const [meta, changeMeta] = useState<RawItemMeta>(defaultMeta)
    const [fieldOptions, changeFieldOptions] = useState<Record<string, string>>(
        {},
    )

    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
        const text = rawTextField.current?.value || ''
        props.changeInput(rawTextToRawItem(text, meta))
    }

    const onTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const changedMeta = getRawItemMeta(e.currentTarget.value)

        const options = Object.values(changedMeta.columns).reduce(
            (arr, col) => ({
                ...arr,
                [col[0]]: col[1],
            }),
            { '': 'Please Select' },
        )
        changeMeta(changedMeta)
        changeFieldOptions(options)
    }

    const onChangeOption = (field: string, select: string) => {
        const target = Object.keys(meta.columns)
            .filter((key) => key === select)
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
                        options={{
                            '': 'Auto Detect',
                            'DD/MM/YYYY': 'DD/MM/YYYY',
                        }}
                        ref={dateFormatField}
                        label="Date Format"
                        id="date-format"
                        value={meta.dateFormat}
                        onChange={(select) =>
                            onChangeOption('date-format', select)
                        }
                    />
                </Column>
                <Column small={6}>
                    <Input
                        label="Separator"
                        value={meta.separate}
                        required
                        onChange={(e) =>
                            onChangeOption(
                                'separator',
                                (e &&
                                    (e.currentTarget as HTMLInputElement)
                                        .value) ||
                                    '',
                            )
                        }
                    />
                </Column>
            </Row>
            <Row>
                <Column small={3}>
                    <Select
                        options={fieldOptions}
                        ref={dateFormatField}
                        label="Date Field"
                        id="date-filed"
                        value={meta.columns.date && meta.columns.date[1]}
                        onChange={(e) => onChangeOption('date', e)}
                    />
                </Column>
                <Column small={3}>
                    <Select
                        options={fieldOptions}
                        ref={dateFormatField}
                        label="Title Field"
                        id="title-field"
                        value={meta.columns.title && meta.columns.title[1]}
                        onChange={(e) => onChangeOption('title', e)}
                    />
                </Column>
                <Column small={3}>
                    <Select
                        options={fieldOptions}
                        ref={dateFormatField}
                        label="Debit Field"
                        id="debit-field"
                        value={meta.columns.debit && meta.columns.debit[1]}
                        onChange={(e) => onChangeOption('debit', e)}
                    />
                </Column>
                <Column small={3}>
                    <Select
                        options={fieldOptions}
                        ref={dateFormatField}
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
                        onChange={onTextAreaChange}
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
