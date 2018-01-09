// jQuery parents() vanilla alternative: https://stackoverflow.com/a/12981248/1471258
export function getParents(el, parentSelector /* optional */) {
    // If no parentSelector defined will bubble up all the way to *document*
    if (parentSelector === undefined) {
        parentSelector = document.body;
    } else {
        parentSelector = document.querySelector(parentSelector);
        if (!parentSelector) return [];
    }

    let parents = [];
    let p = el.parentNode;

    try {
        while (p !== parentSelector) {
            let o = p;
            parents.push(o);
            p = o.parentNode;
        }
    } catch (e) {
        // if parentSelector do not exist in the hierarchy
        if (e instanceof TypeError) {
            return [];
        }

        throw e;
    }

    parents.push(parentSelector); // Push that parentSelector you wanted to stop at

    return parents;
}

export function createElement(html) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return wrapper.firstChild;
}
