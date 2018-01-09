// jQuery parents() vanilla alternative: https://stackoverflow.com/a/12981248/1471258
export function getParents(el, parentSelector /* optional */) {
    // If no parentSelector defined will bubble up all the way to *document*
    if (parentSelector === undefined) {
        parentSelector = document;
    } else {
        parentSelector = document.querySelector(parentSelector);
    }

    let parents = [];
    let p = el.parentNode;

    while (p && p !== parentSelector) {
        let o = p;
        parents.push(o);
        p = o.parentNode;
    }
    parents.push(parentSelector); // Push that parentSelector you wanted to stop at

    return parents;
}

export function createElement(html) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return wrapper.firstChild;
}
