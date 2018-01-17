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

// Auxiliary function that enables multiple inheritence with es6 classes: https://stackoverflow.com/a/45332959/1471258
export function aggregation(baseClass, ...mixins) {
    let copyProps = (target, source) => { // this function copies all properties and symbols, filtering out some special ones
        Object.getOwnPropertyNames(source)
            .concat(Object.getOwnPropertySymbols(source))
            .forEach((prop) => {
                if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) { Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop)); }
            });
    };
    class base extends baseClass {
        constructor(...args) {
            super(...args);
            mixins.forEach((mixin) => {
                copyProps(this, (new mixin())); // eslint-disable-line new-cap
            });
        }
    }
    mixins.forEach((mixin) => { // outside contructor() to allow aggregation(A,B,C).staticFunction() to be called etc.
        copyProps(base.prototype, mixin.prototype);
        copyProps(base, mixin);
    });
    return base;
}

export function setHidden(element, isHidden) {
    if (isHidden) {
        element.setAttribute('hidden', true);
    } else {
        element.removeAttribute('hidden');
    }
}
