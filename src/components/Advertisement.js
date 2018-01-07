import ModalTag from './ui/ModalTag';
import { CIQ } from '../../js/chartiq';

/**
 * Advertisement web component `<cq-advertisement>`.
 *
 * Displays an advertisement banner as a "marker" (inside the chart, use CSS to position absolutely against the chart panel).
 * The advertisement should contain content that can be enabled by calling {@link CIQ.UI.Advertisement#show} based on your
 * business logic.
 *
 * The advertisement will automatically adjust the height to accommodate the content (assuming overflow-y: auto)
 *
 * @namespace WebComponents.cq-advertisement
 * @example
<cq-advertisement style="display: block; height: 106px;">
    <cq-close class="ciq-tight"></cq-close>
    <div class="sample ciq-show">
        <div cq-desktop="">
            <div><translate original="$1 Trades">$1 Trades</translate></div>
            <div><translate original="Use code ">Use code </translate><strong><translate original="Sample">Sample</translate></strong></div>
            <a target="_blank" href="https://yourURL?codeSample&desktop"><translate original="Click to learn more">Click to learn more</translate></a>
        </div>
        <div cq-phone="">
            <div><translate original="$1 Trades">$1 Trades</translate></div>
            <a target="_blank" href="https://yourURL?codeSample&mobile"><translate original="Click to learn more">Click to learn more</translate></a>
        </div>
    </div>
</cq-advertisement>
     *
     */
class Advertisement extends ModalTag {
    attachedCallback() {
        if (this.attached) return;
        super.attachedCallback();
        this.nameValueStore = new CIQ.NameValueStore();
        this.attached = true;
    }

    /**
     * Sets the sleep time for this amount of time before re-displaying
     * @param  {Number} units    Units
     * @param  {string} unitType Unit type. Value values "minute","hour","day","week"
     * @alias setSleepAmount
     * @memberof WebComponents.cq-advertisement
     */
    setSleepAmount(units, unitType) {
        this.sleepAmount = {
            units,
            unitType,
        };
    }

    setNameValueStore(nameValueStore) {
        this.nameValueStore = nameValueStore;
    }

    makeMarker() {
        if (this.markerExists) return;
        new CIQ.Marker({
            stx: this.context.stx,
            xPositioner: 'none',
            label: 'advertisement',
            permanent: true,
            node: this.node[0],
        });
        this.markerExists = true;
    }

    /**
     * Show the advertisement. This should be a div inside of the web component.
     * @param  {Selector} [selector]    A selector. If none specified then the first div will be selected.
     * @param  {Boolean} [ignoreSleep=false] If true then ignore sleep
     * @alias show
     * @memberof WebComponents.cq-advertisement
     */
    show(selector, ignoreSleep) {
        if (this.selector) {
            let priorContent = this.node.find(this.selector);
            priorContent.removeClass('ciq-show');
        }
        this.selector = selector;
        if (!this.selector) {
            let div = this.node.find('div:first-of-type');
            this.selector = `.${div.attr('class')}`;
        }
        this.ignoreSleep = ignoreSleep;
        let self = this;

        function doIt() {
            self.makeMarker();
            self.node.css({
                display: 'block',
            });
            let content = self.node.find(self.selector);
            content.addClass('ciq-show');

            // resize content
            self.node.css({
                height: '0px',
            });
            setTimeout(() => {
                self.node.css({
                    height: `${self.node[0].scrollHeight}px`,
                });
            }, 0);
        }
        if (!ignoreSleep) {
            this.nameValueStore.get('cq-advertisement', (err, ls) => {
                if (err) return;
                if (!ls || typeof (ls) !== 'object') ls = {};
                let ms = ls[self.selector];
                if (ms && ms > Date.now()) return; // still surpressed
                doIt();
            });
        } else {
            doIt();
        }
    }

    /**
     * Hides the advertisement and surpresses it for 24 hours by storing it in local storage.
     * If the selector itself changes however then the ad will reappear.
     * @alias close
     * @memberof WebComponents.cq-advertisement
     */
    close() {
        this.node.css({
            display: 'none',
        });
        let self = this;
        this.nameValueStore.get('cq-advertisement', (err, ls) => {
            if (err) return;
            let future = new Date();
            if (!self.sleepAmount) {
                self.sleepAmount = {
                    units: 1,
                    unitType: 'day',
                };
            }
            let u = self.sleepAmount.units;
            let ut = self.sleepAmount.unitType;
            if (ut === 'minute') future.setMinutes(future.getMinutes() + u);
            else if (ut === 'hour') future.setHours(future.getHours() + u);
            else if (ut === 'day') future.setDate(future.getDate() + u);
            else if (ut === 'week') future.setDate(future.getDate() + (u * 7));
            else if (ut === 'month') future.setMonth(future.getMonth() + u);
            let ms = future.getTime();
            if (!ls || typeof (ls) !== 'object') ls = {};
            ls[self.selector] = ms;
            self.nameValueStore.set('cq-advertisement', ls);
        });
    }

    /**
     * Call this to force the advertisement to monitor the nameValueStore for updates. It will do this by
     * polling. This is useful when running in multiple windows, do that if the advertisement is closed in one
     * window then it will automatically close in the other windows.
     * @param {Number} [ms=1000] Number of milliseconds to poll.
     * @alias watchForRemoteClose
     * @memberof WebComponents.cq-advertisement.prototype
     */
    watchForRemoteClose(ms) {
        if (!ms) ms = 1000;
        let self = this;
        setInterval(() => {
            if (self.node.css('display') === 'none') return; // already closed, do nothing
            self.nameValueStore.get('cq-advertisement', (err, ls) => {
                if (err) return;
                if (!ls || typeof (ls) !== 'object') ls = {};
                let ms = ls[self.selector];
                if (ms && ms > Date.now()) {
                    self.close();
                }
            });
        }, ms);
    }
}


document.registerElement('cq-advertisement', Advertisement);
export default Advertisement;
