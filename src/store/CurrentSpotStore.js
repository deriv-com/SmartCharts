import { when } from 'mobx';

class CurrentSpotStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }
    get state() { return this.mainStore.state; }

    onContextReady = () => {
        if (this.mainStore.state.isAnimationEnabled) this.stx.append('draw', this.drawSpot);
    }

    drawSpot = () => {
        if (this.state.endEpoch) { return; }
        const stx = this.stx;
        const chart = stx.chart;
        const len = chart.dataSet.length;
        if (!len) { return; }
        const bar = chart.dataSet[len - 1];
        if (!bar || !bar.Close) { return; }
        const x = stx.pixelFromTick(len - 1, chart);
        const y = stx.pixelFromPrice(bar.Close, chart.panel);

        // glow is set by Animation.js
        let  glow = bar.current_spot_glow || 0;
        glow = Math.min(glow, 1);

        /** @type {CanvasRenderingContext2D} */
        const ctx = stx.chart.context;
        ctx.save();
        if (glow) {
            ctx.shadowBlur = (glow * 35 + 4) | 0;
            let opacity = Math.sqrt(1.0 - glow) * 255;
            opacity |= 0;
            opacity = opacity.toString(16);
            ctx.shadowColor = `#Ff9933${opacity}`;
        }
        ctx.fillStyle = '#FF9933';
        for (let i = 0; i < (glow ? 3 : 1); ++i) {
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        }
        ctx.restore();
    }
}

export default CurrentSpotStore;
