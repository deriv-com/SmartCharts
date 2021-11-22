import { createXAxis } from './createXAxis';
import { drawCurrentPriceLine } from './currentHR';
import { maintainHeadsUpHR } from './headsUpHR';
import { plotterDrawText } from './plotterDrawText';
import { overrideCalculateAwesome } from './calculateAwesome';
import { overideMeasure } from './setMeasure';
import { overrideRenderEllipse } from './renderEllipse';
import { overrideRenderChannel } from './renderChannel';
import { overrideRenderGartley } from './renderGartley';
import { overrideRenderPitchfork } from './renderPitchfork';
import { overrideRenderRectangle } from './renderRectangle';
import { overrideRenderSegment } from './renderSegment';
import { overrideResizeObserver } from './resizeObserver';
import { BackingStore } from './backingStore';

const inject = option => {
    createXAxis();
    drawCurrentPriceLine();
    maintainHeadsUpHR();
    plotterDrawText();
    overrideCalculateAwesome();
    overideMeasure(option);
    overrideRenderEllipse();
    overrideRenderChannel();
    overrideRenderGartley();
    overrideRenderPitchfork();
    overrideRenderRectangle();
    overrideRenderSegment();
    overrideResizeObserver();
    BackingStore();
};

export default inject;
