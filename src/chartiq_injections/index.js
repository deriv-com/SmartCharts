import { createXAxis } from './createXAxis';
import { drawCurrentPriceLine } from './currentHR';
import { maintainHeadsUpHR } from './headsUpHR';
import { plotterDrawText } from './plotterDrawText';
import { overrideDateFromTick } from './dateFromTick';
import { overideMeasure } from './setMeasure';
import { BackingStore } from './backingStore';

const inject = option => {
    createXAxis();
    drawCurrentPriceLine();
    maintainHeadsUpHR();
    plotterDrawText();
    overrideDateFromTick();
    overideMeasure(option);
    BackingStore();
};

export default inject;
