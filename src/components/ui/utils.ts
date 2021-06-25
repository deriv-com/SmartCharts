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

// Auxiliary function that enables multiple inheritence with es6 classes: https://stackoverflow.com/a/45332959/1471258
export function aggregation(baseClass: any, ...mixins: any[]) {
    const copyProps = (target: any, source: any) => {
        // this function copies all properties and symbols, filtering out some special ones
        Object.getOwnPropertyNames(source)
            .concat(Object.getOwnPropertySymbols(source) as any)
            .forEach(prop => {
                if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) {
                    Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop) as any);
                }
            });
    };
    class base extends baseClass {
        constructor(...args: any[]) {
            super(...args);
            mixins.forEach(mixin => {
                copyProps(this, new mixin()); // eslint-disable-line new-cap
            });
        }
    }
    mixins.forEach(mixin => {
        // outside contructor() to allow aggregation(A,B,C).staticFunction() to be called etc.
        copyProps(base.prototype, mixin.prototype);
        copyProps(base, mixin);
    });
    return base;
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
