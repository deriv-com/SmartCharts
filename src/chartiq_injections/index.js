import { createXAxis } from './createXAxis';
import { drawCurrentPriceLine } from './currentHR';
import { maintainHeadsUpHR } from './headsUpHR';
import { plotterDrawText } from './plotterDrawText';
import { overrideCreateXAxis } from './overrideCreateXAxis';
import { overideMeasure } from './setMeasure';
import { overrideSetPoint } from './setPoint';
import { BackingStore } from './backingStore';

const inject = option => {
    createXAxis();
    drawCurrentPriceLine();
    maintainHeadsUpHR();
    plotterDrawText();
    overrideCreateXAxis();
    overideMeasure(option);
    overrideSetPoint();
    BackingStore();
};

export default inject;
