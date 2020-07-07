export const registerHTMLElements = () => {
    /**
     * only home button click part modified to avoid calling
     * newChart() on home function while historical enable
     */
    CIQ.ChartEngine.prototype.registerHTMLElements = function () {
        const c = this.chart.container;
        for (const control in CIQ.ChartEngine.htmlControls) {
            if (typeof this.chart[control] === 'undefined' && typeof this.controls[control] === 'undefined') {
                if (!this.allowZoom && control === 'chartControls') continue;
                let el = this.container.querySelector(`.${control}`, c);
                if (el) {
                    this.chart[control] = el;
                    this.controls[control] = el;
                } else {
                    const rawHTML = CIQ.ChartEngine.htmlControls[control];
                    if (!rawHTML) continue;
                    const div = document.createElement('DIV');
                    div.innerHTML = rawHTML;
                    el = div.firstChild;
                    c.appendChild(el);
                    this.chart[control] = el;
                    this.controls[control] = el;
                    CIQ.appendClassName(el, control);
                }
            }
        }
        const chartControls = this.controls.chartControls, home = this.controls.home;
        if (chartControls) {
            const zoomIn = this.container.querySelector('.stx-zoom-in', chartControls);
            const zoomOut = this.container.querySelector('.stx-zoom-out', chartControls);

            CIQ.safeClickTouch(zoomIn, (function (self) { return function (e) { self.zoomIn(e); e.stopPropagation(); }; }(this)));
            CIQ.safeClickTouch(zoomOut, (function (self) { return function (e) { self.zoomOut(e); e.stopPropagation(); }; }(this)));
            if (!CIQ.touchDevice) {
                this.makeModal(zoomIn);
                this.makeModal(zoomOut);
            }
        }
        if (home) {
            CIQ.safeClickTouch(home, (function (self) {
                return function (e) {
                    e.stopPropagation();
                    self.home({ animate: true });
                };
            }(this)));
            if (!CIQ.touchDevice) {
                this.makeModal(home);
            }
        }
    };
};
