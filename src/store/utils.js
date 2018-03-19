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
export function sameBar(bar1, bar2) {
    if (!bar1 || !bar2) {return false;}
    if (+bar1.DT != +bar2.DT) {return false;}
    if (bar1.Close != bar2.Close) {return false;}
    if (bar1.Open != bar2.Open) {return false;}
    if (bar1.Volume != bar2.Volume) {return false;}
    return true;
}

export function findAncestor (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls)){}
    return el;
}

export function downloadFileInBrowser(filename, content, type) {
    const blob = new Blob([content], { type: type });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
        return;
    }
    const link = document.createElement("a");
    if (link.download !== undefined) { /* Evergreen Browsers */
        const url = type === 'image/png;' ? content : URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
