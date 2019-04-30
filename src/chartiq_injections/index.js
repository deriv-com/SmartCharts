import { drawCurrentPriceLine }   from './currentHR';
import { maintainHeadsUpHR }      from './headsUpHR';
import { manageMasterDataLength } from './manageMasterDataLength';
import { maintainSpanSize }       from './resizing';
import { setMaxTicks }            from './setMaxTicks';

const inject = () => {
    drawCurrentPriceLine();
    maintainHeadsUpHR();
    maintainSpanSize();
    manageMasterDataLength();
    setMaxTicks();
};

export default inject;
