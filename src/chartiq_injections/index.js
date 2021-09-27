import { createXAxis } from './createXAxis';
import { drawCurrentPriceLine } from './currentHR';
import { maintainHeadsUpHR } from './headsUpHR';
import { plotterDrawText } from './plotterDrawText';
import { overrideRenderEllipse } from './renderEllipse';
import { overrideRenderChannel } from './renderChannel';
import { overrideRenderGartley } from './renderGartley';
import { overideMeasure } from './setMeasure';
import { overrideRenderPitchfork } from './renderPitchfork';
import { BackingStore } from './backingStore';

const inject = option => {
    createXAxis();
    drawCurrentPriceLine();
    maintainHeadsUpHR();
    plotterDrawText();
    overrideRenderEllipse();
    overrideRenderChannel();
    overrideRenderGartley();
    overideMeasure(option);
    overrideRenderPitchfork();
    BackingStore();
};

export default inject;
