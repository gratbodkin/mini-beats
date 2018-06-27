export function objToMap(inObj)
{
    if(utils.isMap(inObj))
    {
        return inObj;
    }
    const map = new Map();
    Object.keys(inObj).forEach(key => { map.set(key, inObj[key]); });
    return map;
}

export const RMS = values => Math.sqrt(
  values.reduce((sum, value) => sum + Math.pow(value, 2), 0) / values.length
);
export const avg = values => values.reduce((sum, value) => sum + value, 0) / values.length;
export const max = values => values.reduce((max, value) => Math.max(max, value), 0);

