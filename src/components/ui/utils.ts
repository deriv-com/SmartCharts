// jQuery parents() vanilla alternative: https://stackoverflow.com/a/12981248/1471258
export function getParents(el: HTMLElement, parentSelector = 'body') {
    const parentElement = document.querySelector(parentSelector);

    if (!parentElement) {
        return [];
    }

    const parents = [];
    let p = el.parentNode;

    while (p !== parentElement) {
        // if parentElement is not in hierarchy
        if (p === null) {
            return [];
        }

        parents.push(p);
        p = p.parentNode;
    }

    // Include parent element in parents
    parents.push(parentElement);

    return parents;
}

export function createElement(html: string) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return wrapper.firstChild;
}

export function setHidden(element: HTMLElement, isHidden: boolean) {
    if (isHidden) {
        element.setAttribute('hidden', 'true');
    } else {
        element.removeAttribute('hidden');
    }
}

export function downloadURI(uri: string, name: string) {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function getUniqueId() {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    return '__' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4() + '__';
}

export function hexToInt(color: string) {
    // Tranforms hex color code to integer so that dart can create Color object from it.
    // Eg: #443a49 -> 0xff443a49 -> 4282661449 or 0xff443a49 -> 4282661449
    const colorCode = color.replace('#', '0xff');
    return parseInt(colorCode, 16);
}
export function capitalize(str: string) {
    if (!str || typeof str !== 'string') {
        return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function intToHexColor(intColor: number): string {
    // Convert the integer color to a hexadecimal string without the "0x" prefix.
    const hexString = (intColor & 0xffffff).toString(16).toUpperCase();

    // Pad the hexadecimal string with zeros to ensure it has 6 digits.
    const paddedHexString = ('000000' + hexString).slice(-6);

    // Add the "#" prefix to the padded hexadecimal string.
    return `#${paddedHexString}`;
}