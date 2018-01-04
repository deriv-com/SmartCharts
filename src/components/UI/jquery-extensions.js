import jQuery from 'jquery';
import { CIQ } from '../../../js/chartiq';

jQuery.fn.extend({
    stxtap(arg1, arg2) {
        return this.each(function () {
            CIQ.installTapEvent(this/* , {stopPropagation:true} */);
            if (typeof arg1 === 'string') {
                $(this).on('stxtap', arg1, function (e) {
                    arg2.call(this, e);
                });
            } else {
                $(this).on('stxtap', function (e) {
                    arg1.call(this, e);
                });
            }
        });
    },
});

jQuery.fn.extend($.expr[':'], {
    trulyvisible(node, j, attr) {
        let parents = $(node).parents();
        parents = parents.add(node);
        for (let i = 0; i < parents.length; i++) {
            let p = $(parents[i]);
            if (p.css('opacity') === '0') return false;
            if (p.css('visibility') === 'hidden') return false;
            if (p.css('height') === '0px' && p.css('overflow-y') == 'hidden') return false;
            if (!p.is(':visible')) return false;
        }
        return true;
    },
});

/**
 * Creates a virtual DOM and then compares contents before rendering. If the contents
 * are the same then no rendering is done. This prevents flicker. React style.
 */
jQuery.fn.extend({
    parentsAndMe(arg1) {
        let us = $(this).parents();
        us = us.add($(this));
        return us;
    },
    cqvirtual(arg1) {
        let virtual = this.clone();
        virtual.empty();
        virtual.original = this;
        return virtual;
    },
    cqrender(arg1) {
        if (this[0].innerHTML == this.original[0].innerHTML) return this.original;
        this.original.empty();
        let children = this.children();
        if (children.length) {
            let newStuff = children.detach();
            this.original.append(newStuff);
        }

        return this.original;
    },
    // Returns a guaranteed width. For instance, cq-context or any other wrapping tag can have
    // a width of zero, so we need to go one level up to get the actual width
    guaranteedWidth() {
        let node = this;
        let w = node.width();
        while (!w) {
            node = node.parent();
            if (node[0].tagName === 'BODY' || node[0] === window) {
                return window.innerWidth;
            }
            w = node.width();
        }
        return w;
    },
    // See guaranteedWidth
    guaranteedHeight() {
        let node = this;
        let h = node.height();
        while (!h) {
            node = node.parent();
            if (node[0].tagName === 'BODY' || node[0] === window) {
                return window.innerHeight;
            }
            h = node.height();
        }
        return h;
    },
    emptyExceptTemplate() {
        this.children().not('template').remove();
        return this;
    },
    // Returns true if an attribute exists, or is not explicitly set to false
    truthyAttr(arg1) {
        let val = this.attr(arg1);
        if (typeof (val) === 'undefined') return false;
        if (val.toLowerCase() == 'false') return false;
        if (val == '0') return false;
        return true;
    },
    // More efficient because it doesn't change the DOM unless it needs to. Returns true
    // if a change was made. Note that this does not support jquery chaining!
    attrBetter(attribute, value) {
        if (typeof value === 'undefined') value = 'true';
        let val = this.attr(attribute);
        if (val === value) return false;
        this.attr(attribute, value);
        return true;
    },
    // More efficient because it doesn't change the DOM unless it needs to. Returns true
    // if a change was made. Note that this does not support jquery chaining!
    removeAttrBetter(attribute) {
        let val = this.attr(attribute);
        if (!val && val !== '') return false;
        this.removeAttr(attribute);
        return true;
    },
    // More efficient because it doesn't change the DOM unless it needs to. Returns true
    // if a change was made. Note that this is a setter function only. It is not meant to replace
    // the getter aspect of jquery's built in text()
    textBetter(str) {
        if (this.text() === str) return false;
        this.text(str);
        return true;
    },
});


jQuery.queryString = function (sParam) {
    let sPageURL = window.location.search.substring(1);
    let sURLVariables = sPageURL.split('&');
    for (let i = 0; i < sURLVariables.length; i++) {
        let sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) return sParameterName[1];
    }
    return null;
};
