import Line from './Line';
import { createElement } from '../components/ui/utils';

class DateLine extends Line {
    constructor({
        stx,
        visible = true,
        pipSize = 2,
        epoch,
        draggable = false,
        isFollowNow = false,
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
            this._date = this._stx.currentQuote().Date;
        }

        this._stx.append('draw', this._draw.bind(this));
        this._isFollowNow = isFollowNow;
    }

    get isFollowNow() {
        return this._isFollowNow;
    }

    set isFollowNow(value) {
        if (this._isFollowNow === value) return;

        this._isFollowNow = value;
        this._draw();
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

        this._date = newDate;
    }
    */

    set epoch(epoch) {
        const d = new Date(epoch * 1000);
        this._date = CIQ.yyyymmddhhmmssmmm(d);
        this._draw();
    }

    get epoch() {
        return this._dateStrToEpoch(this._date);
    }

    _dateStrToEpoch(dateStr) {
        const d = CIQ.strToDateTime(dateStr);
        return d.getTime() / 1000;
    }

    _pixelFromDate(dateStr) {
        return this._stx.pixelFromDate(dateStr);
    }

    _dateFromPixel(x) {
        const dateStr = this._stx.dateFromTick(this._stx.tickFromPixel(x));
        return dateStr;
    }

    _positionAtDate(date) {
        let left = this._pixelFromDate(date);
        left -= (this._line.offsetWidth / 2);

        this._line.style.left = `${left}px`;
    }

    _draw() {
        if (this.visible && this._chart.dataSet) {
            if (this._isFollowNow) {
                this._updateNowPosition();
            } else {
                this._positionAtDate(this._date);
            }
        }
    }

    _updateNowPosition() {
        const date = this._stx.currentQuote().Date;
        let left = this._pixelFromDate(date);
        if (this._chart.lastTickOffset) left += this._chart.lastTickOffset;
        left -= (this._line.offsetWidth / 2);

        // to prevent jitter, only update position when difference is noticeable
        const diff = Math.abs(CIQ.stripPX(this._line.style.left) - left);
        if (diff > 1) this._line.style.left = `${left | 0}px`;
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
