import React from 'react'
import { Link } from 'react-router-dom'
import { useAccountBookMatch } from 'src/client/hooks'
import { TableType } from 'src/constants/accountBook'
import { Month } from 'src/constants/datetime'
import { addZero } from 'src/utils'

export const Header = (): JSX.Element => {
    const { year, month, type } = useAccountBookMatch()

    const todayObject = new Date()
    const now = new Date(`${year}-${addZero(month)}-01`)
    let today = ''
    let prev = ''
    let next = ''
    let heading = year.toString()
    switch (type) {
        case TableType.Daily:
            now.setDate(now.getDate() - 5)
            prev = `/app/${TableType.Daily}/${now.getUTCFullYear()}/${
                now.getUTCMonth() + 1
            }`
            now.setMonth(now.getMonth() + 2)
            next = `/app/${TableType.Daily}/${now.getUTCFullYear()}/${
                now.getUTCMonth() + 1
            }`
            today = `/app/${TableType.Daily}/${todayObject.getUTCFullYear()}/${
                todayObject.getUTCMonth() + 1
            }`
            heading = `${Month[month]} ${year}`
            break
        case TableType.Monthly:
            today = `/app/${TableType.Monthly}/${todayObject.getUTCFullYear()}`
            break
        case TableType.Annual:
            today = `/app/${TableType.Annual}`
            heading = ' '
            break
    }

    return (
        <div className="flex flex--space-between">
            <h1>{heading}</h1>
            <div className="button-group">
                <Link to={prev} className="button tiny secondary hollow">
                    <i className="fi-arrow-left" />
                </Link>
                <Link to={today} className="button tiny secondary hollow">
                    Today
                </Link>
                <Link to={next} className="button tiny secondary hollow">
                    <i className="fi-arrow-right" />
                </Link>
            </div>
        </div>
    )
}
