import { CIQ } from '../../js/chartiq';
import DialogContentTag from './UI/DialogContentTag';

/**
 * Timezone Dialog web component `<cq-timezone-dialog>`.
 */
class TimezoneDialog extends DialogContentTag {
/**
 * @alias save
 * @memberof WebComponents.cq-timezone-dialog
 */
    removeTimezone() {
        CIQ.ChartEngine.defaultDisplayTimeZone = null;
        let stx = this.context.stx;
        stx.displayZone = null;
        stx.setTimeZone();

        if (stx.displayInitialized) stx.draw();

        DialogContentTag.close.apply(this);
    }

    /**
 * @alias configure
 * @memberof WebComponents.cq-theme-dialog
 */
    open(params, ...args) {
        DialogContentTag.open.apply(this, args);
        let node = this.node;
        let self = this;

        this.context = params.context;
        let stx = this.context.stx;

        let ul = node.find('ul');
        let button = node.find('.ciq-btn');
        if (!this.template) {
            this.template = ul.find('li#timezoneTemplate')[0].cloneNode(true);
        }

        function setTimezone(zone) {
            return function () {
                DialogContentTag.close.apply(self);
                let translatedZone = CIQ.timeZoneMap[zone];
                CIQ.ChartEngine.defaultDisplayTimeZone = translatedZone;
                stx.setTimeZone(stx.dataZone, translatedZone);
                if (stx.chart.symbol) stx.draw();
            };
        }

        ul.empty();
        Object.keys(CIQ.timeZoneMap).forEach((val, key) => {
            let zone = key;
            let display = stx.translateIf(zone);
            let li = this.template.cloneNode(true);
            li.style.display = 'block';
            li.innerHTML = display;
            CIQ.safeClickTouch(li, setTimezone(zone));
            ul.append(li);
        });
        let currentUserTimeZone = node.find('#currentUserTimeZone');
        if (stx.displayZone) {
            let fullZone = stx.displayZone;
            Object.keys(CIQ.timeZoneMap).forEach((val, tz) => {
                if (val === stx.displayZone) fullZone = tz;
            });
            currentUserTimeZone.text(`${stx.translateIf('Current TimeZone is')} ${fullZone}`);
            button.show();
        } else {
            currentUserTimeZone.text(stx.translateIf('Your timezone is your current location'));
            button.hide();
        }
    }
}
export default TimezoneDialog;
CIQ.UI.TimezoneDialog = document.registerElement('cq-timezone-dialog', TimezoneDialog);

