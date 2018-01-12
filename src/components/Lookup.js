import $ from 'jquery';
import { CIQ } from '../../js/chartiq';
import ContextTag from './ui/ContextTag';

/**
     * Lookup component `<cq-lookup>`.
     *
     * Note, a {@link CIQ.UI.Lookup.Driver} must be provided.
     * If none is provided then the default will be used which displays no results.
     *
     * Set <cq-lookup cq-uppercase> to force free form text to be converted to uppercase
     *
     * To turn off the result window modify CSS  to `.stxMenuActive cq-lookup cq-menu { opacity: 0 }`
     *
     * @namespace WebComponents.cq-lookup
     * @example
<cq-lookup cq-keystroke-claim cq-keystroke-default>
    <cq-lookup-input cq-no-close>
        <input id="symbol" type="text" spellcheck="off" autocomplete="off" autocorrect="off" autocapitalize="off" name="symbol" placeholder="Enter Symbol">
        <cq-lookup-icon></cq-lookup-icon>
    </cq-lookup-input>
    <cq-lookup-results>
        <cq-lookup-filters cq-no-close>
            <cq-filter class="true">ALL</cq-filter>
            <cq-filter>STOCKS</cq-filter>
            <cq-filter>FX</cq-filter>
            <cq-filter>INDEXES</cq-filter>
            <cq-filter>FUNDS</cq-filter>
            <cq-filter>FUTURES</cq-filter>
        </cq-lookup-filters>
        <cq-scroll></cq-scroll>
    </cq-lookup-results>
</cq-lookup>
     *
     * @since  4.0.0 Added optional cq-uppercase attribute
     */
class Lookup extends ContextTag {
    attachedCallback() {
        if (this.attached) return;
        this.usingEmptyDriver = false;
        super.attachedCallback();
        this.attached = true;
        this.currentFilter = null;
        this.params = {};
    }

    setContext(context) {
        this.setDriver(this.context.lookupDriver);
        this.initialize();
    }

    attachDriver(driver) {
        this.driver = driver;
    }

    /**
     * Set a callback method for when the user selects a symbol
     * @param {Function} cb Callback method
     * @alias setCallback
     * @memberof WebComponents.cq-lookup
     */
    setCallback(cb) {
        this.params.cb = cb;
    }

    /**
     * Set a {@link CIQ.UI.Lookup.Driver}. If none is set then CIQ.UI.Context.lookupDriver will be used.
     * If none available then the input box will still be active but not present a drop down.
     * @param {CIQ.UI.Lookup.Driver} driver The driver
     * @alias setDriver
     * @memberof WebComponents.cq-lookup
     */
    setDriver(driver) {
        const self = this;
        driver.activeSymbolsPromise.then((activeSymbols) => {
            self.results(activeSymbols);
        });
        this.params.driver = driver;
    }

    initialize() {
        let node = $(this);
        this.resultList = node.find('cq-scroll');

        this.input = node.find('input');
        if (!this.input.length) {
            this.input = node.append($("<input type='hidden'>"));
            this.input[0].value = '';
        }
        let self = this;
        this.input.on('paste', (e) => {
            let input = e.target;
            setTimeout(() => {
                self.acceptText(input.value, self.currentFilter);
            }, 0);
        });
        let filters = node.find('cq-lookup-filters');
        if (filters) {
            filters.find('cq-filter').stxtap(function () {
                filters.find('cq-filter').removeClass('true');
                let t = $(this);
                t.addClass('true');
                let translate = t.find('translate');
                if (translate.length) { // if the filter text has been translated then it will be in a <translate> tag
                    self.currentFilter = translate.attr('original');
                } else {
                    self.currentFilter = this.innerHTML;
                }
                self.acceptText(self.input[0].value, self.currentFilter);
            });
        }

        // default key handler
        /* new CIQ.UI.Keystroke(this.input, function(obj){
            self.keyStroke(null, obj.key, obj.e, obj.keystroke);
        }); */

        if (typeof (node.attr('cq-keystroke-claim')) !== 'undefined') {
            // add keyboard claim for entire body
            this.addClaim(this);
        }
    }

    /**
     * Accepts a new symbol or symbolObject
     * @param  {Object} data The symbol object (in a form accepted by {@link CIQ.ChartEngine#newChart})
     * @param  {Object} params Settings to control callback action
     * @alias selectItem
     * @memberof WebComponents.cq-lookup
     */
    selectItem(data, params) {
        if (this.params.cb) {
            this.params.cb(this.context, data, params);
        }
    }

    open() {
        this.node.closest('cq-dialog,cq-menu').each(function () {
            this.open();
        });
    }

    close() {
        this.node.closest('cq-dialog,cq-menu').each(function () {
            this.close();
        });
    }

    isActive() {
        return this.input[0].value !== '';
    }

    acceptText(value, filter) {
        let self = this;
        if (!this.params.driver) {
            throw new Error('Please define a Driver for your Context!');
        }

        function closure(results) {
            self.results(results);
        }
        /**
         * With the decoupling of the uiHelper to the Lookup.Driver you must be sure to include both an argument for maxResults and the closure to handle the results.
         * maxResults must either be a number or a string to result in default value of 100.
         * @alias acceptText
         * @memberof WebComponents.cq-lookup
         * @since 3.0.0
         */
        this.params.driver.acceptText(value, filter, null, closure);
    }

    forceInput() {
        let input = this.input[0];
        this.selectItem({
            symbol: input.value,
        });
        CIQ.blur(this.input);
        this.close();
        input.value = '';
    }

    // Note that this captures keystrokes on the body. If the input box is focused then we need to allow the input box itself
    // to handle the strokes but we still want to capture them in order to display the lookup results. We first check
    // activeElement to see if the input is focused. If so then we bypass logic that manipulates the input.value. In order make
    // sure that the lookup menu is responding to an up-to-date input.value therefore we have to put all of those pieces of code
    // in setTimeout(0)
    //
    // Note that when comparisons are enabled, there are two Lookup components on the screen. Each keypress will therefore pass
    // through this function twice, once for each Lookup component. Only the active component will process the keystroke.
    keyStroke(hub, key, e, keystroke) {
        if (keystroke.ctrl || key === 91) return false;
        let domChain = $(this).parents().addBack();
        let input = this.input[0];
        let result = false;
        let focused = (document.activeElement === input); // If focused then we need to allow the input box to get most keystrokes
        if (!focused && document.activeElement &&
            (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return false; // some other input has focus

        let iAmActive = false,
            iAmDisplayed = false;
        if (domChain.hasClass('stxMenuActive')) {
            iAmDisplayed = true; // if my menu chain is active then I'm alive
        }
        if (focused || iAmDisplayed) iAmActive = true; // If my input is focused or I'm displayed, then I'm alive
        if (!iAmActive) { // Otherwise, I may still be alive under certain conditions
            if (typeof (this.node.attr('cq-keystroke-default')) === 'undefined') return; // I'm always alive if I have default body keystrokes
            if (!iAmDisplayed && this.uiManager.topMenu()) return; // unless there's another menu active and it isn't me
        }
        if (key === 32 && input.value === '') {
            return false;
        }
        let self = this;
        if (key >= 32 && key <= 222) {
            if (!focused) input.value += String.fromCharCode(key); // Changes the <input> value when keystrokes are registered against the body.
            self.acceptText(input.value, self.currentFilter);
            result = true;
        }
        if (key === 'delete' || key === 'backspace') {
            if (this.context.stx.anyHighlighted) return false;
            if (input.value.length) {
                // ctrl-a or highlight all text + delete implies remove all text
                if (window.getSelection().toString()) {
                    input.value = '';
                } else if (!focused) {
                    input.value = input.value.substring(0, input.value.length - 1);
                }

                result = true; // only capture delete key if there was something to delete
            }

            self.acceptText(input.value, self.currentFilter);

            if (key === 'backspace') result = true; // always capture backspace because otherwise chrome will navigate back
        }
        if (key === 'escape' && iAmDisplayed) {
            input.value = '';
            this.close();
            CIQ.blur(input);
            result = true;
        }
        if (key === 'enter' && input.value !== '') {
            if (this.isActive()) {
                let scrollable = this.node.find('cq-scroll');
                focused = scrollable.length && scrollable[0].focused(); // Using cursor keys to maneuver down lookup results
                if (focused && focused.selectFC) {
                    focused.selectFC(...{});
                } else {
                    let val = input.value;
                    let toUpperCase = this.node.truthyAttr('cq-uppercase');
                    if (toUpperCase) val = val.toUpperCase();
                    this.selectItem({
                        symbol: val,
                    });
                }
                CIQ.blur(this.input);
                this.close();
                input.value = '';
                result = true;
            }
        }
        if (result) {
            // If we're focused, then keep the lookup open unless we hit escape.
            // Otherwise, if there is no length close it (user hit "escape", "enter", or "backspace/delete" while unfocused)
            if (this.usingEmptyDriver || (!input.value.length && (key === 'escape' || key === 'enter' || !focused))) {
                this.close();
            } else {
                this.open();
            }
            if (focused) {
                return {
                    allowDefault: true,
                };
            }
            return true;
        }
    }

    /**
     * Processes an array of results and displays them.
     * The array should be of format:
     * [
     * {display:["A","Agilent Technologies Inc","NYSE"], data:{symbol:"A"}},
     * {display:["AA","Alcoa Inc","NYSE"], data:{symbol:"AA"}},
     * ]
     *
     * The lookup widget by default displays three columns as represented by the array. The data object
     * can be an format required by your QuoteFeed or it can be a simple string if you just need to support
     * a stock symbol.
     * @param  {Array} arr The array of results.
     * @alias results
     * @memberof WebComponents.cq-lookup
     */
    results(arr) {
        function closure(self, data) {
            return function (e) {
                CIQ.blur(self.input);
                // self.close();
                self.selectItem(data);
                self.input[0].value = '';
            };
        }

        this.resultList.empty();
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            let nodeText = '<cq-item>';
            for (let j = 0; j < item.display.length; j++) {
                nodeText += `<SPAN>${item.display[j]}</SPAN>`;
            }
            nodeText += '</cq-item>';
            let node = $(nodeText);
            this.resultList.append(node);
            node[0].selectFC = closure(this, item.data);
            node.stxtap(node[0].selectFC);
        }
        let scrollable = this.node.find('cq-scroll');
        if (scrollable.length) scrollable[0].top();
    }
}


document.registerElement('cq-lookup', Lookup);
export default Lookup;
