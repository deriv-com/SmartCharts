import { TCategorizedSymbolItem, TSubCategory, TSubCategoryDataItem } from 'src/binaryapi/ActiveSymbols';
import Context from 'src/components/ui/Context';
import MarkerStore from 'src/store/MarkerStore';
import { TGranularity, TQuote } from 'src/types';

type TTransferItem = (item: TSubCategoryDataItem | TSubCategory) => TSubCategoryDataItem | TSubCategory;

export function createObjectFromLocalStorage(key: string) {
    const val = localStorage.getItem(key);
    if (val !== null) {
        try {
            return JSON.parse(val);
        } catch (e) {
            return undefined;
        }
    }
    return undefined;
}

export function isValidProp(p: number) {
    return p !== undefined && !isNaN(p); // eslint-disable-line no-restricted-globals
}

export const getTimeUnit = ({ timeUnit, interval }: { timeUnit?: string; interval: string | number }) => {
    if (timeUnit === null && interval === 'day') {
        return 'day';
    }
    if (timeUnit === 'minute' && typeof interval === 'number' && interval % 60 === 0) {
        return 'hour';
    }
    if (timeUnit === 'second') {
        return 'tick';
    }
    return timeUnit;
};

export const getIntervalInSeconds = ({
    timeUnit,
    interval,
}: {
    timeUnit?: string | number;
    interval?: string | number;
}) => {
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

    if (unit !== undefined && interv !== undefined) {
        if (typeof unit === 'string') {
            unit = Number(unit);
        }
        if (typeof interv === 'string') {
            interv = Number(interv);
        }
        return unit * interv;
    }

    return 0;
};

export const is_browser = {
    Chrome: () =>
        navigator.userAgent.indexOf('Chrome') !== -1 && !navigator.userAgent.match(/OPR|Opera|Chromium|Edg|Edge/i),
    Chromium: () => navigator.userAgent.indexOf('Chromium') !== -1,
    Edge: () => !!navigator.userAgent.match(/Edg|Edge/i) && !document.documentMode,
    Firefox: () => navigator.userAgent.indexOf('Firefox') !== -1 && navigator.userAgent.indexOf('Seamonkey') === -1,
    IE: () => navigator.userAgent.match(/MSIE|Trident/i) || !!document.documentMode,
    Opera: () => !!navigator.userAgent.match(/OPR|Opera/i),
    Safari: () => navigator.userAgent.indexOf('Safari') !== -1 && !navigator.userAgent.match(/Chrome|Chromium/i),
    Seamonkey: () => navigator.userAgent.indexOf('Seamonkey') !== -1,
};

export function stableSort<T>(arr: T[], compare: (a: T, b: T) => number) {
    const original = arr;

    const newArray = arr.slice(0).sort((a: T, b: T) => {
        const result = compare(a, b);
        return result === 0 ? original.indexOf(a) - original.indexOf(b) : result;
    });

    return newArray;
}

export function sameBar(bar1: TQuote, bar2: TQuote) {
    return !(
        !bar1 ||
        !bar2 ||
        +(bar1.DT as Date) !== +(bar2.DT as Date) ||
        bar1.Close !== bar2.Close ||
        bar1.Open !== bar2.Open ||
        bar1.Volume !== bar2.Volume
    );
}

export function downloadFileInBrowser(filename: string, content: string, type: string, newTab: Window | null) {
    const blob = new Blob([content], { type });
    if (navigator.msSaveBlob) {
        // IE 10+
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
            newTab.document.write(
                `<iframe src="${url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
            );
        } else {
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                newTab.document.write(`${lines[i]}<br/>`);
            }
        }
    }
}

export function stxtap(el: HTMLElement, func: EventListenerOrEventListenerObject) {
    if (el && !(el as any).safeClickTouchEvents) {
        CIQ.installTapEvent(el);
        el.addEventListener('stxtap', func);
    }
}

export function getUTCEpoch(date: Date) {
    return (date.getTime() / 1000 - date.getTimezoneOffset() * 60) | 0;
}

export function getUTCDate(epoch: number) {
    const UTCdate = new Date(epoch * 1000).toISOString();
    return UTCdate.substring(0, 19);
}

export function getLocalDate(epoch: number) {
    return new Date(epoch * 1000);
}

export function updatePropIfChanged(
    source: MarkerStore,
    props: Record<string, string | number | Date | boolean | undefined>,
    onChanged: () => void
) {
    let isChanged = false;
    for (const attr in props) {
        if (props[attr] !== undefined && source[attr as keyof MarkerStore] !== props[attr]) {
            (source as any)[attr] = props[attr];
            isChanged = true;
        }
    }

    if (isChanged && onChanged) {
        onChanged();
    }
}

export function calculateTimeUnitInterval(granularity: TGranularity | undefined) {
    let interval = 1;
    let timeUnit = 'second';

    if (granularity === 86400) {
        timeUnit = 'day';
    } else if (granularity && granularity > 59) {
        interval = granularity / 60;
        timeUnit = 'minute';
    }

    return { interval, timeUnit };
}

export function calculateGranularity(period: number, interval: string): TGranularity {
    const toSeconds = {
        second: 0,
        minute: 60,
        day: 24 * 60 * 60,
    };

    return (toSeconds[interval as keyof typeof toSeconds] * period) as TGranularity;
}

export function displayMilliseconds(ms: number) {
    const totalSec = ms / 1000;
    if (totalSec <= 0) {
        return null;
    }
    const padNum = (n: number) => `0${n}`.slice(-2);
    const seconds = padNum(Math.trunc(totalSec % 60));
    const minutes = padNum(Math.trunc((totalSec / 60) % 60));
    let hours: string | number = Math.trunc((totalSec / 3600) % 24);
    hours = hours ? `${hours}:` : '';
    return `${hours}${minutes}:${seconds}`;
}

export function cloneCategory<T>(
    category: TCategorizedSymbolItem<TSubCategoryDataItem | TSubCategory>,
    transformItem: TTransferItem = x => x
): TCategorizedSymbolItem<T> {
    const categoryData: (TSubCategoryDataItem | TSubCategory)[] = [];
    const categoryCopy: TCategorizedSymbolItem<T> = {
        ...category,
        data: (categoryData as unknown) as T[],
    };
    if (category.hasSubcategory) {
        for (const subcategory of category.data) {
            if ('data' in subcategory) {
                const subcategoryData: TSubCategoryDataItem[] = [];
                const subcategoryCopy: TSubCategory = { ...subcategory, data: subcategoryData };
                for (const item of subcategory.data) {
                    subcategoryData.push(transformItem(item) as TSubCategoryDataItem);
                }
                categoryData.push(subcategoryCopy);
            }
        }
    } else {
        for (const item of category.data) {
            categoryData.push(transformItem(item));
        }
    }

    return categoryCopy;
}

export function cloneCategories<T>(
    categories: TCategorizedSymbolItem<TSubCategoryDataItem | TSubCategory>[],
    transformItem: TTransferItem = x => x
): TCategorizedSymbolItem<T>[] {
    const categorized: TCategorizedSymbolItem<T>[] = [];
    for (const category of categories) {
        categorized.push(cloneCategory<T>(category, transformItem));
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

export function patchPixelFromChart(stx: Context['stx']) {
    stx.pixelFromTick = function (tick: number, _chart: typeof CIQ.ChartEngine.Chart) {
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
        let rightOffset = 0,
            dsTicks = 0;
        quote = length ? dataSegment[length - 1] : null;
        if (segmentImage) quote = segmentImage[length - 1];
        if (quote && quote.leftOffset) {
            if (length < tick - dataSet.length + scroll) {
                rightOffset = quote.leftOffset - quote.candleWidth / 2;
                dsTicks = length;
            }
        }
        // return Math.floor(/* ... */)
        return (
            rightOffset + panel.left + (tick - dsTicks - dataSet.length + scroll + 0.5) * stx.layout.candleWidth + mp
        );
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

export const formatCamelCase = (s: string) => {
    const capitalized = s.charAt(0).toUpperCase() + s.slice(1);
    return capitalized.replace(/([a-z](?=[A-Z]))/g, '$1 ');
};

export const prepareIndicatorName = (name: string) => {
    const StudyNameRegex = /\((.*)\)/; /* eslint-disable-line */
    const getStudyBars = (str: string) => (str.match(StudyNameRegex) || []).pop();
    // const capitalizeFirstLetter = (string) => {
    //     const str = string.replace(StudyNameRegex, '');
    //     return str.charAt(0).toUpperCase() + str.slice(1);
    // };
    const bars = getStudyBars(name);
    return {
        name: formatCamelCase(name.replace(`(${bars})`, '').replace('-', ' ')).trim(),
        bars,
    };
};

export const renderSVGString = (icon: React.SVGAttributes<SVGAElement>) => {
    const vb = icon.viewBox?.split(' ').slice(2) || [];
    return `<svg id="${icon.id}" width="${vb[0]}" height="${vb[1]}"><use xlink:href="${
        __webpack_public_path__ + (icon as any).url
    }" /></svg>`;
};
export const wrapText = (str: string, letter_count: number) => {
    if (str.length > letter_count) {
        let wrappedStr = str;
        const count = Math.floor(str.length / letter_count);
        for (let i = 1; i <= count; i++) {
            wrappedStr = `${wrappedStr.slice(0, letter_count * i)} ${wrappedStr.slice(
                letter_count * i,
                wrappedStr.length
            )}`;
        }
        return wrappedStr;
    }
    return str;
};

export const stringToSlug = (str: string) =>
    str
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
