/**
 * @jest-environment jsdom
 */
// yarn test useRawItem.spec.ts

import '@testing-library/jest-dom'
import React, { Fragment } from 'react'
import { render, screen, act } from '@testing-library/react'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { useRawItem } from './useRawItem'
import { GraphQuery } from 'src/constants/graph-query'

const mocks: MockedResponse<Record<string, any>>[] = [
    {
        request: {
            query: GraphQuery.GET_RAW_ITEMS,
            variables: {
                rawItems: [
                    {
                        _id: 'item-0',
                        checked: true,
                        title: 'item-0',
                        originTitle: 'item-0',
                        date: '1977-01-02',
                        debit: 100,
                        credit: 0,
                        category: '',
                        subCategory: '',
                    },
                ],
            },
        },
        result: {
            data: {
                rawItems: [
                    {
                        _id: 'item-0',
                        checked: false,
                        title: 'item-0',
                        originTitle: 'item-0',
                        date: '1977-01-02',
                        debit: 100,
                        credit: 0,
                        category: '',
                        subCategory: '',
                    },
                ],
            },
        },
    },
]

describe('useRawItem.ts', () => {
    let Component: () => JSX.Element
    const Wrapper = () => (
        <MockedProvider mocks={mocks} addTypename={false}>
            <Component />
        </MockedProvider>
    )

    it('rawItems', async () => {
        Component = (): JSX.Element => {
            const { rawItems } = useRawItem([
                {
                    _id: 'item-0',
                    checked: true,
                    title: 'item-0',
                    originTitle: 'item-0',
                    date: '1977-01-02',
                    debit: 100,
                    credit: 0,
                    category: '',
                    subCategory: '',
                },
            ])

            return (
                <Fragment>
                    {rawItems.map((item, index) => (
                        <div
                            data-testid={`rawItems-${index}`}
                            key={`rawItems-${index}`}
                        >
                            {item.checked ? 'true' : 'false'}
                        </div>
                    ))}
                </Fragment>
            )
        }
        render(<Wrapper />)
        await act(
            async () => await new Promise((resolve) => setTimeout(resolve, 0)),
        )
        expect(screen.getByTestId('rawItems-0')).toHaveTextContent('false')
    })
})
