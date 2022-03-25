/**
 * @jest-environment jsdom
 */
// yarn test useItems.spec.ts

import '@testing-library/jest-dom'
import React, { Fragment } from 'react'
import { render, screen, act } from '@testing-library/react'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { useItems } from './useItems'
import { GraphQuery } from 'src/constants/graph-query'

const mocks: MockedResponse<Record<string, any>>[] = [
    {
        request: {
            query: GraphQuery.GET_ITEMS,
            variables: {
                year: 1977,
                month: 1,
                type: 'daily',
            },
        },
        result: {
            data: {
                items: [
                    {
                        _id: 'item-0',
                        title: 'item-0',
                        date: '1977-01-02',
                        debit: 100,
                        credit: 0,
                        category: {
                            _id: 'category-0',
                            title: 'category-0',
                            disabled: false,
                            color: 'red',
                            parent: '',
                            children: [],
                        },
                    },
                    {
                        _id: ' item-1',
                        title: 'item-1',
                        date: '1977-01-02',
                        debit: 0,
                        credit: 100,
                        category: {
                            _id: 'category-1',
                            title: 'category-1',
                            disabled: true,
                            color: 'red',
                            parent: '',
                            children: [],
                        },
                    },
                ],
            },
        },
    },
    {
        request: {
            query: GraphQuery.GET_ITEMS,
            variables: {
                year: 1977,
                type: 'monthly',
            },
        },
        result: {
            data: {
                items: [
                    {
                        _id: 'category-0-1977-01',
                        title: 'category-0',
                        date: '1977-01',
                        debit: 100,
                        credit: 0,
                        category: null,
                    },
                    {
                        _id: ' category-1-1977-02',
                        title: 'category-1',
                        date: '1977-02',
                        debit: 0,
                        credit: 100,
                        category: null,
                    },
                ],
            },
        },
    },
    {
        request: {
            query: GraphQuery.GET_CATEGORIES,
        },
        result: {
            data: {
                categories: [
                    {
                        _id: 'category-0',
                        title: 'category-0',
                        disabled: false,
                        color: 'red',
                        parent: '',
                        children: [],
                    },
                    {
                        _id: 'category-1',
                        title: 'category-1',
                        disabled: true,
                        color: 'red',
                        parent: '',
                        children: [],
                    },
                ],
            },
        },
    },
]

describe('useItems.ts', () => {
    let Component: () => JSX.Element
    const Wrapper = () => (
        <MockedProvider mocks={mocks} addTypename={false}>
            <Component />
        </MockedProvider>
    )

    it('Items', async () => {
        Component = (): JSX.Element => {
            const { items } = useItems(1977, 1, 'daily')

            return (
                <Fragment>
                    {items.map((item, index) => (
                        <div
                            data-testid={`item-id-${index}`}
                            key={`item-id-${index}`}
                        >
                            {item._id}
                        </div>
                    ))}
                </Fragment>
            )
        }
        render(<Wrapper />)
        await act(
            async () => await new Promise((resolve) => setTimeout(resolve, 0)),
        )
        expect(screen.getByTestId('item-id-0')).toHaveTextContent('item-0')
        expect(screen.getByTestId('item-id-1')).toHaveTextContent('item-1')
    })

    it('itemsToTableData', async () => {
        Component = (): JSX.Element => {
            const { itemsToTableData } = useItems(1977, 1, 'monthly')
            const items = itemsToTableData()

            return (
                <Fragment>
                    <div data-testid="total-credit">{items.totalCredit}</div>
                    <div data-testid="total-debit">{items.totalDebit}</div>
                    {items.items.map((item, index) => (
                        <div
                            data-testid={`item-${index}`}
                            key={`item-${index}`}
                        >
                            {item.date}
                        </div>
                    ))}
                </Fragment>
            )
        }
        render(<Wrapper />)
        await act(
            async () => await new Promise((resolve) => setTimeout(resolve, 10)),
        )
        expect(screen.getByTestId('item-1')).toHaveTextContent('1977-01')
        expect(screen.getByTestId('total-credit')).toHaveTextContent('0')
        expect(screen.getByTestId('total-debit')).toHaveTextContent('100')
    })
})
