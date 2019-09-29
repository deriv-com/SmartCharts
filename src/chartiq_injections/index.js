import { createXAxis }            from './createXAxis';
import { drawCurrentPriceLine }   from './currentHR';
import { maintainHeadsUpHR }      from './headsUpHR';
// import { manageMasterDataLength } from './manageMasterDataLength';
import { maintainSpanSize }       from './resizing';
import { setMaxTicks }            from './setMaxTicks';
import { plotterDrawText }        from './plotterDrawText';
import { maintainDrawCurrentHR }  from './drawCurrentHR';

const inject = () => {
    createXAxis();
    drawCurrentPriceLine();
    maintainHeadsUpHR();
    maintainDrawCurrentHR();
    maintainSpanSize();
    // manageMasterDataLength();
    plotterDrawText();
    setMaxTicks();
};

export default inject;
