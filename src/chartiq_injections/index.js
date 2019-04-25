import { maintainSpanSize }     from './resizing';
import { drawCurrentPriceLine } from './currentHR';
import { maintainHeadsUpHR } from './headsUpHR';

const inject = () => {
    maintainSpanSize();
    drawCurrentPriceLine();
    maintainHeadsUpHR();
};

export default inject;
