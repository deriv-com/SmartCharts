import { TCategorizedSymbolItem, TSubCategory, TSubCategoryDataItem } from 'src/binaryapi/ActiveSymbols';
import { TDragEvents, TGranularity, TSettingsParameter, TQuote } from 'src/types';

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

export function saveToLocalStorage(key: string, value: any) {
    const string = JSON.stringify(value);
    localStorage.setItem(key, string);
}

export function getStringValue(p: number | string, pipSize: number) {
    return typeof p === 'string' ? p : p.toFixed(pipSize);
}

export const getTimeUnit = (granularity: TGranularity) => {
    if (granularity !== undefined) {
        if (granularity === 86400) {
            return 'day';
        }
        if (granularity === 0) {
            return 'tick';
        }
        if (granularity >= 60 && granularity <= 1800) {
            return 'minute';
        }
        return 'hour';
    }
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
        document.body?.removeChild?.(link);
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

export const ARROW_HEIGHT = 41;

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

const movingAverageShortCode = {
    doubleExponential: 'dema',
    exponential: 'ema',
    hull: 'hma',
    simple: 'ma',
    timeSeries: 'tsma',
    triangular: 'tma',
    tripleExponential: 'tema',
    variable: 'vma',
    weighted: 'wma',
    wellesWilder: 'smma',
    zeroLag: 'zma',
};

const fieldTypeShortCode = {
    open: 'O',
    high: 'H',
    close: 'C',
    low: 'L',
    'Hl/2': 'hl/2',
    'Hlc/3': 'hlc/3',
    'Hlcc/4': 'hlcc/4',
    'Ohlc/4': 'ohlc/4',
};

export const prepareIndicatorName = (name: string, parameters: TSettingsParameter[] = []) => {
    const getStudyBars = () => {
        const bars = parameters
            .filter(p => p.type === 'number' || p.path === 'movingAverageType' || p.path === 'fieldType')
            .map(p => {
                if (p.path === 'movingAverageType') {
                    return movingAverageShortCode[p.value as keyof typeof movingAverageShortCode];
                } else if (p.path === 'fieldType') {
                    return fieldTypeShortCode[p.value as keyof typeof fieldTypeShortCode];
                }
                return p.value || p.defaultValue;
            })
            .join(',');
        return bars ? bars : undefined;
    };

    const bars = getStudyBars();
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

export const makeElementDraggable = (
    el: HTMLElement,
    zone: HTMLElement,
    { onDragStart, onDrag, onDragReleased }: TDragEvents
) => {
    el.addEventListener('mousedown', dragMouseDown);

    let isDragging = false;

    function dragMouseDown(ev: MouseEvent) {
        window.addEventListener('mousemove', elementDrag);
        zone.addEventListener('mouseup', closeDragElement);

        isDragging = true;

        onDragStart?.(ev);
    }

    function isEventWithinTheElement(ev: MouseEvent) {
        const bounds = el.getBoundingClientRect();

        return (
            ev.clientX >= bounds.left &&
            ev.clientX <= bounds.right &&
            ev.clientY >= bounds.top &&
            ev.clientY <= bounds.bottom
        );
    }

    function elementDrag(ev: MouseEvent) {
        if (isDragging) {
            if (isEventWithinTheElement(ev)) {
                onDrag?.(ev);
            } else {
                closeDragElement(ev);
            }
        }
    }

    function closeDragElement(ev: MouseEvent) {
        isDragging = false;
        onDragReleased?.(ev);

        window.removeEventListener('mousemove', elementDrag);
        zone.removeEventListener('mouseup', closeDragElement);
    }
};

export const lerp = (a: number, b: number, t: number) => {
    a = a ?? 0;
    b = b ?? 0;

    return a * (1.0 - t) + b * t;
};
