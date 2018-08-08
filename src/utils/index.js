export function createObjectFromLocalStorage(key) {
    const val = CIQ.localStorage.getItem(key);
    const isValid = val !== null;
    if (isValid) {
        try {
            return JSON.parse(val);
        } catch (e) {
            return undefined;
        }
    }
    return undefined;
}

// load external script; unlike CIQ version, this one caches it to browser
export function loadScript(scriptName, cb) {
    if (!CIQ.loadedScripts) CIQ.loadedScripts = {};
    if (CIQ.loadedScripts[scriptName]) {
        if (cb) cb();
        return;
    }
    const script = document.createElement('SCRIPT');
    script.async = true;
    script.onload = function () {
        CIQ.loadedScripts[scriptName] = true;
        if (cb) cb();
    };
    script.src = scriptName;
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(script, s.nextSibling);
}

export function isValidProp(p) {
    return p !== undefined && !isNaN(p); // eslint-disable-line no-restricted-globals
}

export const getTimeUnit = ({ timeUnit, interval }) => {
    if (timeUnit === null && interval === 'day') {
        return 'day';
    }
    if (timeUnit === 'minute' && interval % 60 === 0) {
        return 'hour';
    }
    if (timeUnit === 'second') {
        return 'tick';
    }
    return timeUnit;
};
export const getIntervalInSeconds = ({ timeUnit, interval }) => {
    let unit = timeUnit;
    let interv = interval;
    if (interv === 'day') {
        unit = 86400;
        interv = 1;
    } else if (timeUnit === 'minute') {
        unit = 60;
    } else if (timeUnit === 'second') {
        unit = 1;
    }
    return unit * interv;
};

export function stableSort(arr, compare = (a, b) => a < b) {
    const original = arr.slice(0);

    arr.sort((a, b) => {
        const result = compare(a, b);
        return result === 0 ? original.indexOf(a) - original.indexOf(b) : result;
    });

    return arr;
}

export function sameBar(bar1, bar2) {
    return !((!bar1 || !bar2)
        || (+bar1.DT !== +bar2.DT)
        || (bar1.Close !== bar2.Close)
        || (bar1.Open !== bar2.Open)
        || (bar1.Volume !== bar2.Volume));
}

export function downloadFileInBrowser(filename, content, type) {
    const blob = new Blob([content], { type });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
        return;
    }
    const link = document.createElement('a');
    if (link.download !== undefined) { /* Evergreen Browsers */
        const url = type === 'image/png;' ? content : URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export function stxtap(el, func) {
    if (el && !el.safeClickTouchEvents) {
        CIQ.installTapEvent(el);
        el.addEventListener('stxtap', func);
    }
}

export function getUTCEpoch(date) {
    return (date.getTime() / 1000) - (date.getTimezoneOffset() * 60) | 0;
}

export function getUTCDate(epoch) {
    const UTCdate = new Date(epoch * 1000).toISOString();
    return UTCdate.substring(0, 19);
}

export function updatePropIfChanged(source, props, onChanged) {
    let isChanged = false;
    for (const attr in props) {
        if (props[attr] !== undefined && source[attr] !== props[attr]) {
            source[attr] = props[attr];
            isChanged = true;
        }
    }

    if (isChanged && onChanged) { onChanged(); }
}

export function calculateTimeUnitInterval(granularity) {
    let interval = 1;
    let timeUnit = 'second';

    if (granularity === 86400) {
        timeUnit = 'day';
    } else if (granularity > 0) {
        interval = granularity / 60;
        timeUnit = 'minute';
    }

    return { interval, timeUnit };
}

export function calculateGranularity(period, interval) {
    const toSeconds = {
        second: 0,
        minute: 60,
        day: 24 * 60 * 60,
    };

    return toSeconds[interval] * period;
}
