import React from 'react'

export const HeaderBanner = (): JSX.Element => {
    return (
        <div className="banner">
            <h1 className="banner__heading">SubZero</h1>
            <p className="banner__description">
                Keep Your Groceries Fresh and Cool
            </p>
            <a className="login" href="/auth/login">
                Login
            </a>
        </div>
    )
}
