/**
 * @jest-environment jsdom
 */
// yarn test useUser.spec.ts

import '@testing-library/jest-dom'
import React, { Fragment } from 'react'
import { render, screen, act } from '@testing-library/react'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { useUser } from './useUser'
import { GraphQuery } from 'src/constants/graph-query'

const mocks: MockedResponse<Record<string, any>>[] = [
    {
        request: {
            query: GraphQuery.GET_USER,
        },
        result: {
            data: {
                user: {
                    _id: 'user-id',
                    name: 'user',
                    email: '',
                    photo: '',
                    darkMode: true,
                },
            },
        },
    },
]

describe('useUser.ts', () => {
    let Component: () => JSX.Element
    const Wrapper = () => (
        <MockedProvider mocks={mocks} addTypename={false}>
            <Component />
        </MockedProvider>
    )

    it('rawItems', async () => {
        Component = (): JSX.Element => {
            const { user } = useUser()

            return (
                <Fragment>
                    <div data-testid="user-name">{user?.name}</div>
                    <div data-testid="user-darkMode">
                        {user?.darkMode ? 'true' : 'false'}
                    </div>
                </Fragment>
            )
        }
        render(<Wrapper />)
        await act(
            async () => await new Promise((resolve) => setTimeout(resolve, 0)),
        )
        expect(screen.getByTestId('user-name')).toHaveTextContent('user')
        expect(screen.getByTestId('user-darkMode')).toHaveTextContent('true')
    })
})
