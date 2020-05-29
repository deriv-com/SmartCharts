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

function mergeTicks(master, patch) {
    // detemine which comes first:
    let alpha, omega;
    if (+getLast(master.times) > +getLast(patch.times)) {
        [alpha, omega] = [patch, master];
    } else {
        [alpha, omega] = [master, patch];
    }

    const intersect = binarySearch(alpha.times, omega.times[0]);
    if (intersect === -1) {
        throw new Error('Cannot merge tick data with no overlaps!');
    }

    // Unlike candles, replacing overlaps with omega or alpha doesn't matter;
    // the tick data is the same
    return {
        prices: alpha.prices.slice(0, intersect).concat(omega.prices),
        times : alpha.times.slice(0, intersect).concat(omega.times),
    };
}

function mergeCandles(master, patch) {
    // detemine which comes first:
    let alpha, omega;
    let isPatchOmega = true;
    if (getLast(master).epoch > getLast(patch).epoch) {
        [alpha, omega] = [patch, master];
        isPatchOmega = false;
    } else {
        [alpha, omega] = [master, patch];
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
        if (isPatchOmega && intersect === alpha.length - 1) {
            [alphaEnd, omegaStart] = [alpha.length, intersect - 1];
        } else {
            [alphaEnd, omegaStart] = [alpha.length - 1, intersect];
        }
    } else if (isPatchOmega && intersect === alpha.length - 1) { // omega replaces alpha
        [alphaEnd, omegaStart] = [intersect, 0];
    } else {
        [alphaEnd, omegaStart] = [intersect + 1, 1];
    }

    return alpha.slice(0, alphaEnd).concat(omega.slice(omegaStart, omega.length));
}

export function mergeTickHistory(master, patch) {
    const merged = { ...master };
    if (master.candles) {
        merged.candles = mergeCandles(master.candles, patch.candles);
    } else {
        merged.history = mergeTicks(master.history, patch.history);
    }

    return merged;
}
