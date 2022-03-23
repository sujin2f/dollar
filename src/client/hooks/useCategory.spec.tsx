/**
 * @jest-environment jsdom
 */
// yarn test useCategory.spec.ts

import '@testing-library/jest-dom'
import React, { Fragment } from 'react'
import { render, screen, act } from '@testing-library/react'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { useCategory } from './useCategory'
import { GraphQuery } from 'src/constants/graph-query'

const mocks: MockedResponse<Record<string, any>>[] = [
    {
        request: {
            query: GraphQuery.GET_CATEGORIES,
        },
        result: {
            data: {
                categories: [
                    {
                        _id: 'category1',
                        title: 'category1',
                        disabled: false,
                        color: 'red',
                        parent: '',
                        children: [],
                    },
                    {
                        _id: 'category2',
                        title: 'category2',
                        disabled: false,
                        color: 'red',
                        parent: '',
                        children: [
                            {
                                _id: 'category3',
                                title: 'category3',
                                disabled: false,
                                color: 'red',
                                parent: 'category2',
                            },
                        ],
                    },
                    {
                        _id: 'category3',
                        title: 'category3',
                        disabled: false,
                        color: 'red',
                        parent: 'category2',
                        children: [],
                    },
                    {
                        _id: 'category4',
                        title: 'category4',
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

describe('useCategory.ts', () => {
    let Component: () => JSX.Element
    const Wrapper = () => (
        <MockedProvider mocks={mocks} addTypename={false}>
            <Component />
        </MockedProvider>
    )

    it('Categories', async () => {
        Component = (): JSX.Element => {
            const { categories } = useCategory()

            return (
                <Fragment>
                    {categories.map((category, index) => (
                        <div
                            data-testid={`category-id-${index}`}
                            key={`category-id-${index}`}
                        >
                            {category._id}
                        </div>
                    ))}
                </Fragment>
            )
        }
        render(<Wrapper />)
        await act(
            async () => await new Promise((resolve) => setTimeout(resolve, 0)),
        )
        expect(screen.getByTestId('category-id-0')).toHaveTextContent(
            'category1',
        )
        expect(screen.getByTestId('category-id-1')).toHaveTextContent(
            'category2',
        )
        expect(screen.getByTestId('category-id-2')).toHaveTextContent(
            'category3',
        )
        expect(screen.getByTestId('category-id-3')).toHaveTextContent(
            'category4',
        )
    })

    it('getCategoryById()', async () => {
        Component = (): JSX.Element => {
            const { getCategoryById } = useCategory()

            const category = getCategoryById('category1')

            return <div data-testid="category-id">{category?._id}</div>
        }
        render(<Wrapper />)
        await act(
            async () => await new Promise((resolve) => setTimeout(resolve, 0)),
        )
        expect(screen.getByTestId('category-id')).toHaveTextContent('category1')
    })

    it('isCategoryHidden()', async () => {
        Component = (): JSX.Element => {
            const { isCategoryHidden } = useCategory()

            const category1 = isCategoryHidden('category1')
            const category4 = isCategoryHidden('category4')

            return (
                <Fragment>
                    <div data-testid="category-1">
                        {category1 ? 'true' : 'false'}
                    </div>
                    <div data-testid="category-4">
                        {category4 ? 'true' : 'false'}
                    </div>
                </Fragment>
            )
        }
        render(<Wrapper />)
        await act(
            async () => await new Promise((resolve) => setTimeout(resolve, 0)),
        )
        expect(screen.getByTestId('category-1')).toHaveTextContent('false')
        expect(screen.getByTestId('category-4')).toHaveTextContent('true')
    })

    it('getCategoryByTitle()', async () => {
        Component = (): JSX.Element => {
            const { getCategoryByTitle } = useCategory()

            const category1 = getCategoryByTitle('category1')
            const category4 = getCategoryByTitle('category4')

            return (
                <Fragment>
                    <div data-testid="category-id-1">{category1?._id}</div>
                    <div data-testid="category-id-4">{category4?._id}</div>
                </Fragment>
            )
        }
        render(<Wrapper />)
        await act(
            async () => await new Promise((resolve) => setTimeout(resolve, 0)),
        )
        expect(screen.getByTestId('category-id-1')).toHaveTextContent(
            'category1',
        )
        expect(screen.getByTestId('category-id-4')).toHaveTextContent(
            'category4',
        )
    })

    it('getRootCategories()', async () => {
        Component = (): JSX.Element => {
            const { getRootCategories } = useCategory()

            const categories = getRootCategories()

            return (
                <Fragment>
                    {categories.map((category, index) => (
                        <div
                            data-testid={`category-id-${index}`}
                            key={`category-id-${index}`}
                        >
                            {category._id}
                        </div>
                    ))}
                </Fragment>
            )
        }
        render(<Wrapper />)
        await act(
            async () => await new Promise((resolve) => setTimeout(resolve, 0)),
        )
        expect(screen.getByTestId('category-id-0')).toHaveTextContent(
            'category1',
        )
        try {
            screen.getByTestId('category-id-3')
            expect(true).toBeFalsy()
        } catch (e) {
            expect(true).toBeTruthy()
        }
        expect(screen.getByTestId('category-id-2')).toHaveTextContent(
            'category4',
        )
    })

    it('getSubCategories()', async () => {
        Component = (): JSX.Element => {
            const { getSubCategories } = useCategory()

            const categories = getSubCategories('category2')

            return (
                <Fragment>
                    {categories.map((category, index) => (
                        <div
                            data-testid={`category-id-${index}`}
                            key={`category-id-${index}`}
                        >
                            {category._id}
                        </div>
                    ))}
                </Fragment>
            )
        }
        render(<Wrapper />)
        await act(
            async () => await new Promise((resolve) => setTimeout(resolve, 0)),
        )
        expect(screen.getByTestId('category-id-0')).toHaveTextContent(
            'category3',
        )
    })
})
