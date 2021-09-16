import { createXAxis } from './createXAxis';
import { drawCurrentPriceLine } from './currentHR';
import { maintainHeadsUpHR } from './headsUpHR';
import { plotterDrawText } from './plotterDrawText';
import { overrideCreateXAxis } from './overrideCreateXAxis';
import { overrideDateFromTick } from './dateFromTick';
import { overideMeasure } from './setMeasure';
import { overrideSetPoint } from './setPoint';
import { BackingStore } from './backingStore';

const inject = option => {
    createXAxis();
    drawCurrentPriceLine();
    maintainHeadsUpHR();
    plotterDrawText();
    overrideCreateXAxis();
    overrideDateFromTick();
    overideMeasure(option);
    overrideSetPoint();
    BackingStore();
};

export default inject;
