export const removeEmpty = (object: Record<string, unknown>) =>
    Object.keys(object)
        .filter((key) => object[key])
        .reduce((acc, key) => ({ ...acc, [key]: object[key] }), {})
