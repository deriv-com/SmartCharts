import { createXAxis }            from './createXAxis';
import { drawCurrentPriceLine }   from './currentHR';
import { maintainHeadsUpHR }      from './headsUpHR';
// import { manageMasterDataLength } from './manageMasterDataLength';
import { maintainSpanSize }       from './resizing';
import { plotterDrawText }        from './plotterDrawText';
import { overideMeasure }         from './setMeasure';
import { yaxisZoom }              from './yaxisZoom';

const inject = (option) => {
    createXAxis();
    drawCurrentPriceLine();
    maintainHeadsUpHR();
    maintainSpanSize();
    // manageMasterDataLength();
    plotterDrawText();
    overideMeasure(option);
    yaxisZoom();
};

export default inject;
