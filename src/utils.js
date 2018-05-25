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