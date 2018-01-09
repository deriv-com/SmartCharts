// jQuery parents() vanilla alternative: https://stackoverflow.com/a/12981248/1471258
export function getParents(el, parentSelector = 'body') {
    const parentElement = document.querySelector(parentSelector);

    if (!parentElement) return [];

    let parents = [];
    let p = el.parentNode;

    while (p !== parentElement) {
        // if parentElement is not in hierarchy
        if (p === null) return [];

        parents.push(p);
        p = p.parentNode;
    }

    // Include parent element in parents
    parents.push(parentElement);

    return parents;
}

export function createElement(html) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return wrapper.firstChild;
}
