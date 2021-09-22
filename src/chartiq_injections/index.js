import { createXAxis } from './createXAxis';
import { drawCurrentPriceLine } from './currentHR';
import { maintainHeadsUpHR } from './headsUpHR';
import { plotterDrawText } from './plotterDrawText';
import { overideMeasure } from './setMeasure';
import { overrideRenderRectangle } from './renderRectangle';
import { overrideRenderSegment } from './renderSegment';
import { BackingStore } from './backingStore';

const inject = option => {
    createXAxis();
    drawCurrentPriceLine();
    maintainHeadsUpHR();
    plotterDrawText();
    overideMeasure(option);
    overrideRenderRectangle();
    overrideRenderSegment();
    BackingStore();
};

export default inject;
