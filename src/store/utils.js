export const getTimeUnit = ({ timeUnit, interval }) => {
    if (timeUnit === null && interval === 'day') {
        return 'day';
    } else if (timeUnit === 'minute' && interval % 60 === 0) {
        return 'hour';
    } else if (timeUnit === 'second') {
        return 'tick';
    }
    return timeUnit;
};

export function stableSort(arr, compare = (a, b) => a < b) {
    var original = arr.slice(0);

    arr.sort(function(a, b){
        var result = compare(a, b);
        return result === 0 ? original.indexOf(a) - original.indexOf(b) : result;
    });

    return arr;
}
