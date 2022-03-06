import React from 'react'
import { Link } from 'react-router-dom'
import { useAccountBookMatch } from 'src/client/hooks'
import { TableType } from 'src/constants'

export const AccountBookTypeSelector = (): JSX.Element => {
    const { year, month, type } = useAccountBookMatch()
    return (
        <div className="row">
            <div className="columns small-12">
                <div className="button-group flex flex--center">
                    <Link
                        to={`/app/${TableType.Daily}/${year}/${month}`}
                        className={`button tiny ${
                            type !== TableType.Daily && 'secondary hollow'
                        }`}
                    >
                        Daily
                    </Link>
                    <Link
                        to={`/app/${TableType.Weekly}/${year}`}
                        className={`button tiny ${
                            type !== TableType.Weekly && 'secondary hollow'
                        }`}
                    >
                        Weekly
                    </Link>
                    <Link
                        to={`/app/${TableType.BiWeekly}/${year}`}
                        className={`button tiny ${
                            type !== TableType.BiWeekly && 'secondary hollow'
                        }`}
                    >
                        BiWeekly
                    </Link>
                    <Link
                        to={`/app/${TableType.Monthly}/${year}`}
                        className={`button tiny ${
                            type !== TableType.Monthly && 'secondary hollow'
                        }`}
                    >
                        Monthly
                    </Link>
                    <Link
                        to={`/app/${TableType.Annual}`}
                        className={`button tiny ${
                            type !== TableType.Annual && 'secondary hollow'
                        }`}
                    >
                        Annual
                    </Link>
                </div>
            </div>
        </div>
    )
}
