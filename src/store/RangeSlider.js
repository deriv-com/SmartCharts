import $ from 'jquery';

/**
 * Add-On that puts a range slider under the chart. This allows the datasegment to be selectable as a portion of the dataset.
 *
 * Requires `addOns.js`
 *
 * Once instantiated, use the slider `display(true/false)` function to add it or remove it from the chart. See example.
 *
 * If using chatIQ webComponents, it needs to be created before the UI manager (startUI) is called for custom themes to apply.
 *
 * Visual Reference:<br>
 * ![rangeSlider](img-rangeSlider.png "rangeSlider")
 *
 * @param {object} params Configuration parameters
 * @param {CIQ.ChartEngine} [params.stx] The chart object
 * @param {number} [params.height=95] Height of range slider panel
 * @param {number} [params.chartContainer=$("#chartContainer")] jquery handle to the main chart container
 * @constructor
 * @name  CIQ.RangeSlider
 * @since 4.0.0
 * @example
 *  // instantiate a range slider
 *    const slider = new RangeSlider({stx:stxx,height:95,chartContainer:$("#chartContainer")});
 *
 *  // display the slider
 *    slider.display(true);
 *
 *  // hide the slider
 *    slider.display(false);
 */
export class RangeSlider {
    constructor(params) {
        const stx = params.stx;
        this.stx = stx;
        stx.slider = this;
        const sliderHeight = params.height ? params.height : 95;
        const chartContainer = params.chartContainer ? $(params.chartContainer) : $(params.stx.container);

        const ciqSlider = this.ciqSlider = $('<div class="ciq-slider"></div>');
        const sliderContainer = $('<div class="chartContainer" id="sliderContainer"></div>');
        ciqSlider.insertAfter(chartContainer)
            .append(sliderContainer);
        ciqSlider.css('height', `${sliderHeight}px`)
            .css('padding-top', '5px')
            .hide();
        sliderContainer.css('height', `${ciqSlider.height()}px`);
        sliderContainer.prop('dimensionlessCanvas', true);
        const self = this.slider = new CIQ.ChartEngine({
            container: sliderContainer[0],
            preferences: {
                labels: false,
                whitespace: 0,
            },
        });
        self.xaxisHeight = 30;
        self.manageTouchAndMouse = false;
        self.chart.yAxis.drawCurrentPriceLabel = false;
        self.chart.baseline.userLevel = false;
        self.initializeChart();
        const subholder = this.subholder = self.chart.panel.subholder;
        const style = this.style = stx.canvasStyle('stx_range_slider shading');
        stx.addEventListener('layout', (obj) => {
            obj.stx.slider.acceptLayoutChange(obj.stx.layout);
        });
        stx.addEventListener('symbolChange', (obj) => {
            if (obj.action === 'master') obj.stx.slider.setSymbol(obj.symbol);
        });
        stx.addEventListener('symbolImport', (obj) => {
            if (obj.action === 'master') obj.stx.slider.setSymbol(obj.symbol);
            obj.stx.slider.acceptLayoutChange(obj.stx.layout);
        });
        stx.addEventListener('theme', (obj) => {
            self.clearPixelCache();
            self.styles = {};
            self.chart.container.style.backgroundColor = '';
            const helper = new CIQ.ThemeHelper({ stx: obj.stx });
            helper.params.stx = self;
            helper.update();
        });
        stx.append('createDataSet', function () {
            this.slider.copyData(this.chart);
        });
        stx.append('draw', function () {
            if (!ciqSlider.is(':visible')) return;
            if (!self.chart.dataSet) return;
            self.chart.baseline.defaultLevel = this.chart.baseline.actualLevel;
            self.draw();
            this.slider.drawSlider();
        });
        stx.prepend('resizeChart', () => {
            const ciqChart = chartContainer.parent();
            const heightOffset = ciqChart.height() - chartContainer.height();
            ciqChart.height(ciqChart.parent()
                .height() - (ciqSlider.is(':visible') ? sliderHeight : 0));
            chartContainer.height(ciqChart.height() - heightOffset);
        });
        $(subholder)
            .on('mousedown touchstart pointerdown', (e) => {
                const start = e.offsetX || e.originalEvent.layerX;
                if (!start && start !== 0) return; // wrong event
                const s = $(self);
                s.prop('startDrag', start)
                    .prop('startPixelLeft', self.pixelLeft)
                    .prop('startPixelRight', self.pixelRight);
                const bw = parseInt(style.borderLeftWidth, 10);
                if (start < self.pixelRight - bw) s.prop('needsLeft', true);
                if (start > self.pixelLeft + bw) s.prop('needsRight', true);
                if (CIQ.touchDevice) return;
                CIQ.appendClassName(e.target, 'stx-drag-chart');
            });
        $(subholder)
            .on('mouseup mouseout touchend pointerup', (e) => {
                CIQ.unappendClassName(e.target, 'stx-drag-chart');
                const s = $(self);
                s.prop('startDrag', null)
                    .prop('needsLeft', false)
                    .prop('needsRight', false);
            });
        $(subholder)
            .on('mousemove touchmove pointermove', (e) => {
                const s = $(self);
                const startDrag = s.prop('startDrag');
                if (!startDrag && startDrag !== 0) return;
                const touches = e.originalEvent.touches;
                let movement = (touches && touches.length) ? touches[0].pageX - e.target.offsetLeft : e.offsetX;
                if (!movement && movement !== 0) return;  // wrong event
                movement -= startDrag;
                let tickLeft = self.tickLeft,
                    tickRight = self.tickRight;
                let startPixelLeft = s.prop('startPixelLeft'),
                    startPixelRight = s.prop('startPixelRight');
                let needsLeft = s.prop('needsLeft'),
                    needsRight = s.prop('needsRight');
                if (needsLeft) {
                    if (startPixelLeft + movement < 0) movement = -startPixelLeft;
                    tickLeft = self.tickFromPixel(startPixelLeft + movement);
                    if (needsRight) tickRight = self.tickRight + tickLeft - self.tickLeft;
                } else if (needsRight) {
                    tickRight = Math.min(self.tickFromPixel(startPixelRight + movement), stx.chart.dataSet.length - 1);
                } else {
                    return;
                }

                const newCandleWidth = stx.chart.width / (tickRight - tickLeft + 1);
                if (tickRight >= tickLeft && newCandleWidth >= stx.minimumCandleWidth) {
                    self.tickLeft = tickLeft;
                    self.tickRight = tickRight;
                    stx.chart.scroll = stx.chart.dataSet.length - tickLeft;
                    if (!needsLeft || !needsRight) {
                        stx.setCandleWidth(newCandleWidth);
                    }
                    stx.micropixels = 0;
                    stx.draw();
                }
            });
        this.copyData(stx.chart);
    }


    display(on) {
        this.ciqSlider[on ? 'show' : 'hide']();
        this.stx.resizeChart();
        if (!on) return;
        this.slider.resizeChart();
        this.slider.initializeChart();
        this.slider.draw();
        this.drawSlider();
    }

    setSymbol(symbol) {
        this.slider.chart.symbol = symbol;
        this.slider.adjustPanelPositions();
        this.slider.setMainSeriesRenderer();
        this.slider.resizeChart();
        this.drawSlider();
    }

    acceptLayoutChange(layout) {
        let doDraw = false;
        if (this.slider.layout.rangeSlider !== layout.rangeSlider) {
            this.stx.slider.display(layout.rangeSlider);
        }
        const relevantLayoutPropertiesForRedraw = ['chartType', 'aggregationType',
            'periodicity', 'interval', 'timeUnit',
            'chartScale', 'extended', 'marketSessions', 'rangeSlider',
            'kagi', 'rangebars', 'renko', 'priceLines', 'pandf'];
        relevantLayoutPropertiesForRedraw.forEach((x) => {
            if (!CIQ.equals(this.slider.layout[x], layout[x])) {
                this.slider.layout[x] = layout[x];
                doDraw = true;
            }
        });
        if (!this.ciqSlider.is(':visible')) return;
        if (doDraw) {
            this.slider.setMainSeriesRenderer();
            this.slider.draw();
            this.drawSlider();
        }
    }

    copyData(chart) {
        // if(!ciqSlider.is(":visible")) return;
        if (!chart.dataSet) return;
        let scrollOffset = 0;
        if (this.stx.quoteDriver && this.stx.quoteDriver.behavior && this.stx.quoteDriver.behavior.bufferSize) {
            if (chart.moreAvailable) scrollOffset = this.stx.quoteDriver.behavior.bufferSize;
        }
        const myChart = this.slider.chart;
        myChart.symbol = chart.symbol;
        myChart.masterData = this.slider.masterData = chart.masterData;
        myChart.dataSet = chart.dataSet;
        myChart.state = chart.state;
        myChart.baseline.defaultLevel = chart.baseline.actualLevel;
        myChart.scroll = Math.max(1, myChart.dataSet.length - scrollOffset);
        myChart.maxTicks = myChart.scroll + 1;
        this.slider.layout.candleWidth = chart.width / (myChart.maxTicks + 1);
        this.slider.draw();
        this.drawSlider();
    }

    drawSlider() {
        if (!this.ciqSlider.is(':visible')) return;
        if (!this.stx.chart.dataSet || !this.stx.chart.dataSet.length) return;
        let chartPanel = this.stx.chart.panel,
            ctx = this.slider.chart.context,
            segmentImage = this.slider.chart.segmentImage || [],
            halfCandle = this.slider.layout.candleWidth / 2;
        const left = this.slider.tickLeft = Math.max(this.stx.tickFromPixel(chartPanel.left + halfCandle), 0);
        const right = this.slider.tickRight = Math.min(this.stx.tickFromPixel(chartPanel.right - halfCandle), this.stx.chart.dataSet.length - 1);
        const pLeft = this.slider.pixelLeft = this.slider.pixelFromTick(left) - (segmentImage[left] ? segmentImage[left].candleWidth / 2 : halfCandle);
        const pRight = this.slider.pixelRight = this.slider.pixelFromTick(right) + (segmentImage[right] ? segmentImage[right].candleWidth / 2 : halfCandle);
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.style.backgroundColor;
        ctx.fillRect(this.subholder.offsetLeft, this.subholder.offsetTop, pLeft - this.subholder.offsetLeft, this.subholder.offsetHeight);
        ctx.fillRect(this.subholder.offsetWidth, this.subholder.offsetTop, pRight - this.subholder.offsetWidth, this.subholder.offsetHeight);
        ctx.strokeStyle = this.style.borderColor;
        ctx.lineWidth = parseInt(this.style.borderWidth, 10);
        ctx.moveTo(pLeft, this.subholder.offsetTop);
        ctx.lineTo(pLeft, this.subholder.offsetTop + this.subholder.offsetHeight);
        ctx.moveTo(pRight, this.subholder.offsetTop);
        ctx.lineTo(pRight, this.subholder.offsetTop + this.subholder.offsetHeight);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = parseInt(this.style.width, 10);
        ctx.lineCap = 'round';
        ctx.moveTo(pLeft, this.subholder.offsetTop + this.subholder.offsetHeight / 4);
        ctx.lineTo(pLeft, this.subholder.offsetTop + 3 * this.subholder.offsetHeight / 4);
        ctx.moveTo(pRight, this.subholder.offsetTop + this.subholder.offsetHeight / 4);
        ctx.lineTo(pRight, this.subholder.offsetTop + 3 * this.subholder.offsetHeight / 4);
        ctx.stroke();
        ctx.restore();
    }
}

