export const deepCopy = (items: any) => {
    return items.map((item: any) => {
        if (Array.isArray(item)) {
            return deepCopy(item)
        }

        if (typeof item === 'object') {
            return { ...item }
        }

        return item
    })
}
