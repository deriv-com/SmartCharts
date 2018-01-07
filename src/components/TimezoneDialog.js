import { CIQ } from '../../js/chartiq';
import DialogContentTag from './ui/DialogContentTag';

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

        super.close();
    }

    /**
     * @alias configure
     * @memberof WebComponents.cq-theme-dialog
     */
    open(params) {
        super.open(arguments);
        let node = this.node;
        let self = this;

        this.context = params.context;
        let stx = this.context.stx;

        let ul = node.find('ul');
        let button = node.find('.ciq-btn');
        if (!this.template) {
            this.template = ul.find('li#timezoneTemplate')[0].cloneNode(true);
        }

        ul.empty();
        for (let key in CIQ.timeZoneMap) {
            let zone = key;
            let display = stx.translateIf(zone);
            let li = this.template.cloneNode(true);
            li.style.display = 'block';
            li.innerHTML = display;
            CIQ.safeClickTouch(li, setTimezone(zone));
            ul.append(li);
        }
        let currentUserTimeZone = node.find('#currentUserTimeZone');
        if (stx.displayZone) {
            let fullZone = stx.displayZone;
            for (let tz in CIQ.timeZoneMap) {
                if (CIQ.timeZoneMap[tz] === stx.displayZone) fullZone = tz;
            }
            currentUserTimeZone.text(`${stx.translateIf('Current TimeZone is')} ${fullZone}`);
            button.show();
        } else {
            currentUserTimeZone.text(stx.translateIf('Your timezone is your current location'));
            button.hide();
        }
    }

    setTimezone(zone) {
        let stx = this.context.stx;
        super.close();
        let translatedZone = CIQ.timeZoneMap[zone];
        CIQ.ChartEngine.defaultDisplayTimeZone = translatedZone;
        stx.setTimeZone(stx.dataZone, translatedZone);
        if (stx.chart.symbol) stx.draw();
    }
}


document.registerElement('cq-timezone-dialog', TimezoneDialog);
export default TimezoneDialog;