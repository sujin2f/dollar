/**
 * @jest-environment jsdom
 */
// yarn test src/client/components/form/Switch.spec.ts

import '@testing-library/jest-dom'
import React, { Fragment, useState } from 'react'
import { render, fireEvent, act, screen } from '@testing-library/react'
import { Switch } from './Switch'

describe('Switch.ts', () => {
    it('Basic', async () => {
        const Component = (): JSX.Element => <Switch id="switch" />
        const result = render(<Component />)
        expect(result.container.innerHTML).toMatch(
            '<input class="switch-input" id="switch" type="checkbox"><label class="switch-paddle" for="switch"><span class="show-for-sr"><span class="hidden"></span></span></label>',
        )
    })

    it.only('onChange', async () => {
        const Component = (): JSX.Element => {
            const [checked, ChangeChecked] = useState(false)
            const onChange = (value: boolean) => {
                ChangeChecked(value)
            }
            return (
                <Fragment>
                    <Switch id="switch" onChange={onChange} checked={checked} />
                    <div data-testid="checked">
                        {checked ? 'true' : 'false'}
                    </div>
                </Fragment>
            )
        }
        const result = render(<Component />)
        expect(screen.getByTestId('checked')).toHaveTextContent('false')

        const select = result.container.querySelector('#switch')
        fireEvent.click(select!)
        await act(
            async () => await new Promise((resolve) => setTimeout(resolve, 10)),
        )
        expect(screen.getByTestId('checked')).toHaveTextContent('true')
    })
})
