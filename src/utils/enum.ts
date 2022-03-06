export const getEnumKeys = (
    target: Record<string, number | string>,
): string[] =>
    Object.keys(target).filter(
        (key) =>
            target[target[key]]?.toString() !== key || isNaN(parseInt(key, 10)),
    )

export const getEnumValues = (
    target: Record<string, number | string>,
): (string | number)[] => getEnumKeys(target).map((key) => target[key])
