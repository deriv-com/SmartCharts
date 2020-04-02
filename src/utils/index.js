export function createObjectFromLocalStorage(key) {
    const val = localStorage.getItem(key);
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

export function downloadFileInBrowser(filename, content, type, newTab) {
    const blob = new Blob([content], { type });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
        return;
    }
    const url = type === 'image/png;' ? content : URL.createObjectURL(blob);
    const link = document.createElement('a');
    if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
    }
    if (newTab) {
        if (type === 'image/png;') {
            newTab.document.write(`<iframe src="${url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
        } else {
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                newTab.document.write(`${lines[i]}<br/>`);
            }
        }
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

export function getLocalDate(epoch) {
    return new Date(epoch * 1000);
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
    } else if (granularity > 59) {
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

export function displayMilliseconds(ms) {
    const totalSec = ms / 1000;
    if (totalSec <= 0) { return null; }
    const padNum = n => (`0${n}`).slice(-2);
    const seconds = padNum(Math.trunc((totalSec) % 60));
    const minutes = padNum(Math.trunc((totalSec / 60) % 60));
    let hours = Math.trunc((totalSec / 3600) % 24);
    hours = hours ? `${hours}:` : '';
    return `${hours}${minutes}:${seconds}`;
}

export function cloneCategory(category, transformItem = x => x) {
    const categoryData = [];
    const categoryCopy = { ...category, data: categoryData };
    if (category.hasSubcategory) {
        for (const subcategory of category.data) {
            const subcategoryData = [];
            const subcategoryCopy = { ...subcategory, data: subcategoryData };
            for (const item of subcategory.data) {
                subcategoryData.push(transformItem(item));
            }
            categoryData.push(subcategoryCopy);
        }
    } else {
        for (const item of category.data) {
            categoryData.push(transformItem(item));
        }
    }

    return categoryCopy;
}

export function cloneCategories(categories, transformItem = x => x) {
    const categorized = [];
    for (const category of categories) {
        categorized.push(cloneCategory(category, transformItem));
    }

    return categorized;
}

// Get a raw callback with underlying canvas2dcontext
// This component is used to render directly into the chart canvas.
//
// Props:
//
//  - epoch_array: array of epoch values to get coordinates for.
//  - price_array: array of price values to get y-coordinates for.
//  - draw_callback: called on every frame with ({ctx, points, prices}).
//  -- points will be an array of [{left, top, epoch}] in pixels.
//  -- ctx is the Context2dDrawingContext


// Unfortunately chartiq.js does a Math.floor() on pixel values,
// Which causes a jerky effect on the markers in auto-scroll,
// However we need the pixel value down to the decimal points.
// This is copy from chartiq.js file WITHOUT rounding down the pixel value.

export function patchPixelFromChart(stx) {
    stx.pixelFromTick = function (tick, _chart) {
        const chart = _chart || stx.chart;
        const dataSegment = chart.dataSegment,
            dataSet = chart.dataSet,
            segmentImage = chart.segmentImage,
            mp = stx.micropixels,
            length = dataSegment ? dataSegment.length : 0;
        const panel = chart.panel,
            scroll = chart.scroll;
        const bar = tick - dataSet.length + scroll;
        let quote = length ? dataSegment[bar] : null;

        if (segmentImage) quote = segmentImage[bar];
        if (quote && quote.leftOffset) {
            // return Math.floor(panel.left + quote.leftOffset + mp)
            return panel.left + quote.leftOffset + mp;
        }
        let rightOffset = 0, dsTicks = 0;
        quote = length ? dataSegment[length - 1] : null;
        if (segmentImage) quote = segmentImage[length - 1];
        if (quote && quote.leftOffset) {
            if (length < tick - dataSet.length + scroll) {
                rightOffset = quote.leftOffset - quote.candleWidth / 2;
                dsTicks = length;
            }
        }
        // return Math.floor(/* ... */)
        return rightOffset + panel.left
            + (tick - dsTicks - dataSet.length + scroll + 0.5)
            * stx.layout.candleWidth + mp;
    };
}

export const ARROW_HEIGHT = 39;

export const ARROW_COLORS = Object.freeze({
    GREEN: '#4bb4b3',
    ORANGE: '#ff6444',
});

export const DIRECTIONS = Object.freeze({
    UP: 'UP',
    DOWN: 'DOWN',
});
