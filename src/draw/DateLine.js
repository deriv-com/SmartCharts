import Line from './Line';
import PriceLine from './PriceLine';
import { createElement } from '../components/ui/utils';

class DateLine extends Line {
    constructor({
        stx,
        relative = false,
        visible = true,
        pipSize = 2,
        epoch,
        draggable = false,
    }) {
        super({
            stx, visible, pipSize, draggable,
        });
        CIQ.appendClassName(this._line, 'vertical');

        const holder = this._chart.panel.subholder;
        holder.appendChild(this._line);

        if (epoch) {
            this.epoch = epoch;
        } else {
            this.date = this._stx.currentQuote().Date;
        }

        this._stx.append('draw', this._draw.bind(this));
    }

    /** TODO: Dragging causes it to snap in odd ways. I suspect it's something the ChartIQ guys will need to look into
    _startDrag(e) {
        super._startDrag(e);
        this._initialPosition = CIQ.stripPX(this._line.style.left);
    }

    _dragLine(e) {
        const newWidth = this._initialPosition + e.displacementX;
        const newCenter = newWidth + (this._line.offsetWidth / 2);
        let newDate = this._dateFromPixel(newCenter);

        this.date = newDate;
    }
    */

    get date() {
        return this._date;
    }

    set date(date) {
        if (this._date === date) return;

        this._date = date;
        this._draw();
    }

    set epoch(epoch) {
        const d = new Date(epoch * 1000);
        this.date = CIQ.yyyymmddhhmmssmmm(d);
    }

    get epoch() {
        const d = CIQ.strToDateTime(this.date);
        return d.getTime() / 1000;
    }

    _pixelFromDate(dateStr) {
        return this._stx.pixelFromDate(dateStr);
    }

    _dateFromPixel(x) {
        const dateStr = this._stx.dateFromTick(this._stx.tickFromPixel(x));
        console.log(this._stx.tickFromPixel(x));
        return dateStr;
    }

    _positionAtDate(date) {
        let left = this._pixelFromDate(date);
        left -= (this._line.offsetWidth / 2);

        this._line.style.left = `${left}px`;
    }

    _draw() {
        if (this.visible && this._chart.dataSet) {
            this._positionAtDate(this.date);
        }
    }
}

export default DateLine;

export class TradeStart extends DateLine {
    constructor({
        stx,
        relative = false,
        visible = true,
        pipSize = 2,
        epoch,
        draggable = false,
    }) {
        super({
            stx, visible, pipSize, draggable, epoch, relative,
        });

        CIQ.appendClassName(this._line, 'trade-start-line');
        const tradeText = createElement('<div class="trade-text">Trade Start</div>');
        this._line.appendChild(tradeText);
    }
}

export class TradeEnd extends DateLine {
    constructor({
        stx,
        relative = false,
        visible = true,
        pipSize = 2,
        epoch,
        draggable = false,
    }) {
        super({
            stx, visible, pipSize, draggable, epoch, relative,
        });

        CIQ.appendClassName(this._line, 'trade-end-line');
        const tradeText = createElement('<div class="trade-text">Trade End</div>');
        const tradeEndFlag = createElement('<div class="trade-end-flag"><div class="circle"></div><div class="ic-flag"></div></div>');
        this._line.appendChild(tradeText);
        this._line.appendChild(tradeEndFlag);
    }
}
