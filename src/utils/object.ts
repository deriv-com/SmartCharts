import { TObject } from 'src/types';

// Note that this function breaks on objects with circular references.
export const isDeepEqual = (a: any | any[], b: any | any[]): boolean => {
    if (typeof a !== typeof b) {
        return false;
    }
    if (Array.isArray(a)) {
        return isEqualArray(a, b);
    }
    if (a && b && typeof a === 'object') {
        return isEqualObject(a, b);
    }
    if (typeof a === 'number' && typeof b === 'number' && Number.isNaN(a) && Number.isNaN(b)) {
        return true;
    }
    // else
    return a === b;
};

export const isEqualArray = (arr1: any[], arr2: any[]): boolean =>
    arr1 === arr2 || (arr1.length === arr2.length && arr1.every((value, idx) => isDeepEqual(value, arr2[idx])));

export const isEqualObject = (obj1: TObject, obj2: TObject): boolean =>
    obj1 === obj2 ||
    (Object.keys(obj1).length === Object.keys(obj2).length &&
        Object.keys(obj1).every(key => isDeepEqual(obj1[key], obj2[key])));
