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
