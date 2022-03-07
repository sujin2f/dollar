import { useRouteMatch } from 'react-router-dom'
import { TableType } from 'src/constants'
import { hasEnumValue } from 'src/utils'

type Match = { type?: string; year?: string; month?: string }

export const useAccountBookMatch = () => {
    const match = useRouteMatch<Match>()
    const year = match.params.year
        ? parseInt(match.params.year, 10)
        : new Date().getFullYear()
    const month = match.params.month
        ? parseInt(match.params.month, 10)
        : new Date().getMonth() + 1
    const type: TableType = hasEnumValue(TableType, match.params.type || '')
        ? (match.params.type as TableType)
        : TableType.Daily

    return { year, month, type }
}