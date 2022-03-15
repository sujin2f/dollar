import React from 'react'
import { Link } from 'react-router-dom'
import { useAccountBookMatch } from 'src/client/hooks'
import { TableType } from 'src/constants/accountBook'
import { Month } from 'src/constants/datetime'
import { addZero } from 'src/utils'

export const Header = (): JSX.Element => {
    const { year, month, type } = useAccountBookMatch()

    const today = new Date()
    const now = new Date(`${year}-${addZero(month)}-01`)
    const urlPrefix = `/app/${type}`
    let todayLink = `${urlPrefix}/${today.getFullYear()}`
    let prev = `${urlPrefix}/${now.getFullYear() - 1}`
    let next = `${urlPrefix}/${now.getFullYear() + 1}`

    let heading = year.toString()

    switch (type) {
        case TableType.Daily:
            now.setDate(now.getDate() - 5)
            prev = `${urlPrefix}/${now.getFullYear()}/${now.getMonth() + 1}`

            now.setMonth(now.getMonth() + 2)
            next = `${urlPrefix}/${now.getFullYear()}/${now.getMonth() + 1}`

            todayLink = `${todayLink}/${today.getMonth() + 1}`
            heading = `${Month[month]} ${year}`
            break
        case TableType.Annual:
            heading = ''
    }

    return (
        <div className="flex flex--space-between">
            <h1 className="table__heading">
                {heading}
                <span>&nbsp;</span>
            </h1>

            {type !== TableType.Annual && (
                <div className="button-group">
                    <Link to={prev} className="button tiny secondary hollow">
                        <i className="fi-arrow-left" />
                    </Link>
                    <Link
                        to={todayLink}
                        className="button tiny secondary hollow"
                    >
                        Today
                    </Link>
                    <Link to={next} className="button tiny secondary hollow">
                        <i className="fi-arrow-right" />
                    </Link>
                </div>
            )}
        </div>
    )
}
