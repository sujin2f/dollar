import React from 'react'
import { Link } from 'react-router-dom'
import { useAccountBookMatch } from 'src/client/hooks'
import { TableType } from 'src/constants/accountBook'

export const TypeSelector = (): JSX.Element => {
    const { year, month, type } = useAccountBookMatch()
    return (
        <div className="button-group flex flex--center">
            <Link
                to={`/app/${TableType.Daily}/${year}/${month}`}
                className={`button tiny secondary ${
                    type !== TableType.Daily && 'hollow'
                }`}
            >
                Daily
            </Link>
            <Link
                to={`/app/${TableType.Monthly}/${year}`}
                className={`button tiny secondary ${
                    type !== TableType.Monthly && 'hollow'
                }`}
            >
                Monthly
            </Link>
            <Link
                to={`/app/${TableType.Annual}`}
                className={`button tiny secondary ${
                    type !== TableType.Annual && 'hollow'
                }`}
            >
                Annual
            </Link>
        </div>
    )
}
