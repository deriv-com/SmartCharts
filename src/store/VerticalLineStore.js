import { observable } from 'mobx';

export default class VerticalLineStore {
    get stx() { return this.mainStore.chart.stxx; }
    get chart() { return this.stx.chart; }

    constructor(mainStore) {
        this.mainStore = mainStore;
        this._injectionId = this.stx.append('draw', this._draw);
    }
    destructor() {
        this.stx.removeInjection(this._injectionId);
    }

    @observable left = 0;

    _followsCurrentQuote = false;
    get followsCurrentQuote() { return this._followsCurrentQuote; }
    set followsCurrentQuote(value) {
        this._followsCurrentQuote = value;
        this._draw();
    }

    get epoch() { return this._dateStrToEpoch(this.date); }
    set epoch(epoch) {
        if (epoch) {
            this.date = CIQ.yyyymmddhhmmssmmm(new Date(epoch * 1000));
        } else if (this.stx.currentQuote()) {
            this.date = this.stx.currentQuote().Date;
        }
        this._draw();
    }

    _draw = () => {
        if (!this.chart.dataSet) { return; }
        if (!this.stx.currentQuote()) { return; }
        if (!this.date) {
            this.date = this.stx.currentQuote().Date;
        }

        if (this.followsCurrentQuote) {
            this._updateNowPosition();
        } else if (this.date) {
            this._positionAtDate(this.date);
        }
    }

    _offsetWidth = 22;
    _positionAtDate(date) {
        let left = this._pixelFromDate(date);
        left -= (this._offsetWidth / 2);

        this.left = left;
    }
    _updateNowPosition() {
        const currentQuote = this.stx.currentQuote();
        if (!currentQuote) { return; }

        const date = currentQuote.Date;
        let left = this._pixelFromDate(date);
        if (this.chart.lastTickOffset) { left += this.chart.lastTickOffset; }
        left -= (this._offsetWidth / 2);

        // to prevent jitter, only update position when difference is noticeable
        const diff = Math.abs(this.left - left);
        if (diff > 1) {
            this.left = left | 0;
        }
    }

    _dateStrToEpoch(dateStr) { return CIQ.strToDateTime(dateStr).getTime() / 1000; }
    _pixelFromDate(dateStr) { return this.stx.pixelFromDate(dateStr); }
    _dateFromPixel(x) { return this.stx.dateFromTick(this.stx.tickFromPixel(x)); }
}
