/**
 * @jest-environment jsdom
 */
// yarn test useAccountBookMatch.spec.ts

import '@testing-library/jest-dom'
import React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import { render } from '@testing-library/react'
import { useAccountBookMatch } from './useAccountBookMatch'
import { TableType } from 'src/constants/accountBook'

describe('useAccountBookMatch.ts', () => {
    let Component: () => JSX.Element
    let initialEntries = ''
    const Wrapper = () => (
        <MemoryRouter initialEntries={[initialEntries]}>
            <Route path={`/app/:type?/:year(\\d+)?/:month(\\d+)?`}>
                <Component />
            </Route>
        </MemoryRouter>
    )

    it('Auto Select', async () => {
        initialEntries = '/app'
        Component = (): JSX.Element => {
            const { year, month, type } = useAccountBookMatch()
            const date = new Date()
            expect(year).toBe(date.getFullYear())
            expect(month).toBe(date.getMonth() + 1)
            expect(type).toBe(TableType.Daily)

            return <div />
        }
        render(<Wrapper />)
    })

    it('Type Only', async () => {
        initialEntries = `/app/${TableType.Monthly}`
        Component = (): JSX.Element => {
            const { year, month, type } = useAccountBookMatch()
            const date = new Date()
            expect(year).toBe(date.getFullYear())
            expect(month).toBe(date.getMonth() + 1)
            expect(type).toBe(TableType.Monthly)

            return <div />
        }
        render(<Wrapper />)
    })

    it('Type and Year', async () => {
        initialEntries = `/app/${TableType.Monthly}/1977`
        Component = (): JSX.Element => {
            const { year, month, type } = useAccountBookMatch()
            const date = new Date()
            expect(year).toBe(1977)
            expect(month).toBe(date.getMonth() + 1)
            expect(type).toBe(TableType.Monthly)

            return <div />
        }
        render(<Wrapper />)
    })

    it('Type, Year, and Month', async () => {
        initialEntries = `/app/${TableType.Monthly}/1977/1`
        Component = (): JSX.Element => {
            const { year, month, type } = useAccountBookMatch()
            expect(year).toBe(1977)
            expect(month).toBe(1)
            expect(type).toBe(TableType.Monthly)

            return <div />
        }
        render(<Wrapper />)
    })
})
