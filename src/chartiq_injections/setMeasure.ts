// @ts-nocheck
export const overideMeasure = (option: { drawToolsStore: DrawToolsStore }) => {
    CIQ.ChartEngine.prototype.append('setMeasure', function (
        price1: number,
        price2: number,
        tick1: number,
        tick2: number,
        hover: boolean
    ) {
        let m = (this.drawingContainer || document).querySelector('.mMeasure');
        let message = '';
        if (!price1 && price1 !== 0) {
            if (!this.anyHighlighted && this.currentVectorParameters.vectorType === '') this.clearMeasure();
        } else {
            if (price2 !== false) {
                let distance = Math.round(Math.abs(price1 - price2) * this.chart.roundit) / this.chart.roundit;
                distance = distance.toFixed(this.chart.yAxis.printDecimalPlaces);
                if (this.internationalizer) {
                    message += this.internationalizer.numbers.format(distance);
                } else {
                    message += distance;
                }
                let pct;
                if (price1 > 0 && price2 > 0) {
                    pct = (price2 - price1) / price1;
                    if (Math.abs(pct) > 0.1) {
                        pct = Math.round(pct * 100);
                    } else if (Math.abs(pct) > 0.01) {
                        pct = Math.round(pct * 1000) / 10;
                    } else {
                        pct = Math.round(pct * 10000) / 100;
                    }
                    if (this.internationalizer) {
                        pct = this.internationalizer.percent.format(pct / 100);
                    } else {
                        pct += '%';
                    }
                    message += ` (${pct})`;
                }
            }
            if (tick2 !== false) {
                let ticks = Math.abs(tick2 - tick1);
                ticks = Math.round(ticks) + 1;
                const barsStr = this.translateIf('Bars');
                message += ` (${ticks} ${barsStr})`;
            }

            if (m) m.innerHTML = message;
        }

        if (this.activeDrawing) return; // Don't show measurement Sticky when in the process of drawing
        m = this.controls.mSticky;
        if (m) {
            const mStickyInterior = m.querySelector('.mStickyInterior');
            if (hover) {
                m.style.display = 'inline-block';
                mStickyInterior.style.display = 'inline-block';
                if (price1 || price1 === 0) {
                    mStickyInterior.innerHTML = message;
                }
                m.classList[message === '' ? 'add' : 'remove']('hide');
                this.positionSticky(m);
            } else {
                m.style.display = 'none';
                mStickyInterior.innerHTML = '';
            }
        }
    });
    CIQ.Drawing.BaseTwoPoint.prototype.measure = function () {
        if (this.p0 && this.p1) {
            this.stx.setMeasure(this.p0[1], this.p1[1], this.p0[0], this.p1[0], true, this.name);
            const mSticky = this.stx.controls.mSticky;
            const mStickyInterior = mSticky && mSticky.querySelector('.mStickyInterior');
            if (mStickyInterior) {
                const lines = [];
                let title = CIQ.capitalize(this.name);

                if (option.drawToolsStore) {
                    const drawingItem = option.drawToolsStore.findComputedDrawing(this);
                    if (drawingItem) {
                        title = `${drawingItem.prefix ? `${drawingItem.prefix} - ` : ''} ${t.translate(
                            drawingItem.text,
                            { num: drawingItem.num || ' ' }
                        )}`;
                    }
                }

                lines.push(title);
                if (this.getYValue) lines.push(this.field || this.stx.defaultPlotField || 'Close');
                lines.push(mStickyInterior.innerHTML);
                mStickyInterior.innerHTML = lines.join(' ');
            }
        }
    };
};
