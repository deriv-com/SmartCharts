import { drawCurrentPriceLine }   from './currentHR';
import { maintainHeadsUpHR }      from './headsUpHR';
// import { manageMasterDataLength } from './manageMasterDataLength';
import { maintainSpanSize }       from './resizing';
import { setMaxTicks }            from './setMaxTicks';
import { plotterDrawText }        from './plotterDrawText';

const inject = () => {
    drawCurrentPriceLine();
    maintainHeadsUpHR();
    maintainSpanSize();
    // manageMasterDataLength();
    plotterDrawText();
    setMaxTicks();
};

export default inject;
