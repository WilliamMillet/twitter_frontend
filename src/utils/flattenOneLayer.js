const flattenOneLayer = (obj) => {
    const result = {};
    for (const key in obj) {
        const { ...nestedObj } = obj[key];
        Object.assign(result, nestedObj);
    }
    return result;
}

export default flattenOneLayer;