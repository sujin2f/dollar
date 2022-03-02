import React from 'react'

export const PublicHeader = (): JSX.Element => {
    return (
        <header className="banner">
            <h1 className="banner__heading">$</h1>
            <p className="banner__description">Account Book</p>
            <a className="login" href="/auth/login">
                Login
            </a>
        </header>
    )
}
