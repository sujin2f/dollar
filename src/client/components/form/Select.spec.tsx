/**
 * @jest-environment jsdom
 */
// yarn test src/client/components/form/Select.spec.ts

import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import { Select } from './Select'

describe('Select.ts', () => {
    const options = {
        '': 'Please Select',
        option1: 'Value 1',
        option2: 'Value 2',
    }

    it('Basic', async () => {
        const Component = (): JSX.Element => (
            <Select options={options} id="select" />
        )
        render(<Component />)
        expect(document.body.innerHTML).toMatch(
            '<div><select id="select" aria-describedby=""><option value="">Please Select</option><option value="option1">Value 1</option><option value="option2">Value 2</option></select></div>',
        )
    })

    it('Option Group', async () => {
        const optionsGroup = {
            '': 'Please Select',
            BMW: {
                z3: 'Z3',
                z4: 'Z4',
            },
            Smart: {
                forTwo: 'For Two',
                forFour: 'For Four',
            },
        }
        const Component = (): JSX.Element => (
            <Select options={optionsGroup} id="select" />
        )
        render(<Component />)
        expect(document.body.innerHTML).toMatch(
            '<div><select id="select" aria-describedby=""><option value="">Please Select</option><optgroup label="BMW"><option value="z3">Z3</option><option value="z4">Z4</option></optgroup><optgroup label="Smart"><option value="forTwo">For Two</option><option value="forFour">For Four</option></optgroup></select></div>',
        )
    })

    it('With props', async () => {
        const Component = (): JSX.Element => (
            <Select
                options={options}
                id="select"
                defaultValue="option1"
                label="Label"
                autoFocus
                disabled
                required
                helpText="helpText"
            />
        )
        render(<Component />)
        expect(document.body.innerHTML).toMatch(
            '<div><label for="select" class="form-label form-label--required">Label</label><select id="select" disabled="" required="" aria-describedby="select-help-text"><option value="">Please Select</option><option value="option1" selected="">Value 1</option><option value="option2">Value 2</option></select><p class="help-text" id="select-help-text">helpText</p></div>',
        )
    })
})
