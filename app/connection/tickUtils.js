function getLast(arr) { return arr[arr.length - 1]; }

function binarySearch(arr, val, cmp = a => a) {
    let start = 0;
    let end = arr.length - 1;

    while (start <= end) {
        const mid = (start + end) >> 1;

        if (cmp(arr[mid]) === cmp(val)) {
            return mid;
        }

        if (cmp(val) < cmp(arr[mid])) {
            end = mid - 1;
        } else {
            start = mid + 1;
        }
    }

    return -1;
}

function mergeTicks(a, b) {
    // detemine which comes first:
    let alpha, omega;
    if (+getLast(a.times) > +getLast(b.times)) {
        [alpha, omega] = [b, a];
    } else {
        [alpha, omega] = [a, b];
    }

    const intersect = binarySearch(alpha.times, omega.times[0]);
    if (intersect === -1) {
        return {
            prices: alpha.prices.concat(omega.prices),
            times : alpha.times.concat(omega.times),
        };
    }

    // Unlike candles, replacing overlaps with omega or alpha doesn't matter;
    // the tick data is the same
    return {
        prices: alpha.prices.slice(0, intersect).concat(omega.prices),
        times : alpha.times.slice(0, intersect).concat(omega.times),
    };
}

// with overlapping data, b will _always_ replace a
function mergeCandles(a, b) {
    // detemine which comes first:
    let alpha, omega;
    let isBOmega = true;
    if (getLast(a).epoch > getLast(b).epoch) {
        [alpha, omega] = [b, a];
        isBOmega = false;
    } else {
        [alpha, omega] = [a, b];
    }

    let alphaEnd, omegaStart;
    const cmp = x => x.epoch;
    // To merge candle data; there *must* be an overlap, either
    // the first element in future patch has same epoch in past data
    // or last element in past patch has same epoch in future data
    let intersect = binarySearch(alpha, omega[0], cmp);
    if (intersect === -1) {
        intersect = binarySearch(omega, getLast(alpha), cmp);
        if (intersect === -1) {
            throw new Error('Candle data cannot be merged!');
        }

        // alpha replaces omega
        if (isBOmega && intersect === alpha.length - 1) {
            alphaEnd = alpha.length;
            omegaStart = intersect - 1;
        } else {
            alphaEnd = alpha.length - 1;
            omegaStart = intersect;
        }
    } else if (isBOmega && intersect === alpha.length - 1) { // omega replaces alpha
        alphaEnd = intersect;
        omegaStart = 0;
    } else {
        alphaEnd = intersect + 1;
        omegaStart = 1;
    }

    return alpha.slice(0, alphaEnd).concat(omega.slice(omegaStart, omega.length));
}

export function mergeTickHistory(a, b) {
    if (Array.isArray(a)) {
        return mergeCandles(a, b);
    }
    return mergeTicks(a, b);
}

