import NodeCache from 'node-cache'

const minuteInSeconds = 60
const hourInSeconds = minuteInSeconds * 60
const dayInSeconds = hourInSeconds * 24

export const cache = new NodeCache({
    stdTTL: parseInt(process.env.MYSQL_CACHE_TTL || `${dayInSeconds}`, 10),
})
