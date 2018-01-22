import Line from './Line';
import PriceLine from './PriceLine';

class DateLine extends Line {
    constructor({
        stx,
        lineColor = PriceLine.COLOR_GREEN,
        relative = false,
        visible = true,
        pipSize = 2,
        epoch,
        draggable = false,
    }) {
        super({
            stx, lineColor, visible, pipSize, draggable,
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
        this._date = date;
        this._draw();
    }

    set epoch(epoch) {
        const d = new Date(epoch * 1000);

        const fixedTo2Units = (str) => {
            if (str.length === 1) return '0' + str;
            return str;
        }

        const year = d.getFullYear();
        const month = fixedTo2Units((d.getMonth() + 1).toString());
        const day = fixedTo2Units(d.getDate().toString());
        const hours = fixedTo2Units(d.getHours().toString());
        const minutes = fixedTo2Units(d.getMinutes().toString());
        const dateStr = `${year}${month}${day}${hours}${minutes}`;
        this.date = dateStr;
    }

    get epoch() {
        const d = this._dateFromString(this.date);
        return d.getTime() / 1000;
    }

    _dateFromString(dateStr) {
        return new Date(
            dateStr.slice(0, 4),
            Number.parseInt(dateStr.slice(4, 6), 10) - 1,
            dateStr.slice(6, 8),
            dateStr.slice(8, 10),
            dateStr.slice(10, 12),
        );
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
