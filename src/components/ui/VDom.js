
/**
 * Creates a virtual DOM and then compares contents before rendering. If the contents
 * are the same then no rendering is done. This prevents flicker, and if more efficient 
 * because it doesn't change the DOM unless it needs to.
 */

export class VirtualDom {
    constructor(element) {
        this.element = element;
    }

    setAttribute(attribute, value) {
        if (typeof value === 'undefined') value = 'true';
        const val = this.element.getAttribute(attribute);
        if (val === value) return;
        this.element.setAttribute(attribute, value);
        return this;
    }

    removeAttribute(attribute) {
        const val = this.element.getAttribute(attribute);
        if (!val && val !== '') return;
        this.element.removeAttribute(attribute);
        return this;
    }

    addClass(className) {
        const el = this.element;
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
        return this;
    }
    removeClass(className) {
        const el = this.element;
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
        return this;
    }

    // Returns a guaranteed width. For instance, cq-context or any other wrapping tag can have
    // a width of zero, so we need to go one level up to get the actual width
    guaranteedWidth() {
        let node = this.element;
        let w = node.getBoundingClientRect().width;
        while (!w) {
            node = node.parentNode;
            if (node.tagName === 'BODY' || node === window) {
                return window.innerWidth;
            }
            w = node.getBoundingClientRect().width;
        }
        return w;
    }
  
    // See guaranteedWidth
    guaranteedHeight() {
        let node = this.element;
        let h = node.getBoundingClientRect().height;
        while (!h) {
            node = node.parentNode;
            if (node.tagName === 'BODY' || node === window) {
                return window.innerHeight;
            }
            h = node.getBoundingClientRect().height;
        }
        return h;
    }
}

function VDom(element) {
    return new VirtualDom(element);
}

export default VDom;
