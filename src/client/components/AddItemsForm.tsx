import React, {
    Dispatch,
    SetStateAction,
    MouseEvent,
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
import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'
import { Input } from 'src/common/components/forms/Input'
import { Select } from 'src/common/components/forms/Select'
import { TableHeader } from 'src/types/table'
import { Button } from 'src/common/components/forms/Button'

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

    // States
    const [meta, changeMeta] = useState<RawItemMeta>(defaultMeta)
    const [fieldOptions, changeFieldOptions] = useState<Record<string, string>>(
        {},
    )

    // Field Values
    const [dateFormat, changeDateFormat] = useState<string>(meta.dateFormat)
    const [separator, changeSeparator] = useState<string>(meta.separate)
    const [date, changeDate] = useState<string>()
    const [title, changeTitle] = useState<string>()
    const [debit, changeDebit] = useState<string>()
    const [credit, changeCredit] = useState<string>()

    const onSubmit = (e?: MouseEvent) => {
        if (e) {
            e.preventDefault()
        }
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
            {},
        )

        changeDateFormat(changedMeta.dateFormat)
        changeSeparator(changedMeta.separate)
        changeDate(
            changedMeta.columns.date && changedMeta.columns.date[0].toString(),
        )
        changeTitle(
            changedMeta.columns.title &&
                changedMeta.columns.title[0].toString(),
        )
        changeDebit(
            changedMeta.columns.debit &&
                changedMeta.columns.debit[0].toString(),
        )
        changeCredit(
            changedMeta.columns.credit &&
                changedMeta.columns.credit[0].toString(),
        )

        changeMeta(changedMeta)
        changeFieldOptions({
            '': 'Please Select',
            ...options,
        })
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
                        label="Date Format"
                        id="date-format"
                        value={dateFormat}
                        onChange={(value) => {
                            changeDateFormat(value)
                        }}
                    />
                </Column>
                <Column small={6}>
                    <Input
                        label="Separator"
                        required
                        value={separator}
                        onChange={(e) => {
                            changeSeparator(
                                (e?.target as HTMLInputElement).value,
                            )
                        }}
                    />
                </Column>
            </Row>
            <Row>
                <Column small={3}>
                    <Select
                        options={fieldOptions}
                        label="Date Field"
                        value={date}
                        onChange={(value) => {
                            changeDate(value)
                        }}
                    />
                </Column>
                <Column small={3}>
                    <Select
                        options={fieldOptions}
                        label="Title Field"
                        value={title}
                        onChange={(value) => {
                            changeTitle(value)
                        }}
                    />
                </Column>
                <Column small={3}>
                    <Select
                        options={fieldOptions}
                        label="Debit Field"
                        value={debit}
                        onChange={(value) => {
                            changeDebit(value)
                        }}
                    />
                </Column>
                <Column small={3}>
                    <Select
                        options={fieldOptions}
                        label="Credit Field"
                        value={credit}
                        onChange={(value) => {
                            changeCredit(value)
                        }}
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
