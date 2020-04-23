import { createXAxis }            from './createXAxis';
import { drawCurrentPriceLine }   from './currentHR';
import { maintainHeadsUpHR }      from './headsUpHR';
// import { manageMasterDataLength } from './manageMasterDataLength';
import { maintainSpanSize }       from './resizing';
import { setMaxTicks }            from './setMaxTicks';
import { plotterDrawText }        from './plotterDrawText';
import { overideMeasure }         from './setMeasure';

const inject = (option) => {
    createXAxis();
    drawCurrentPriceLine();
    maintainHeadsUpHR();
    maintainSpanSize();
    // manageMasterDataLength();
    plotterDrawText();
    setMaxTicks();
    overideMeasure(option);
};

export default inject;
