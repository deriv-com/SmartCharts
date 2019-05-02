import { maintainSpanSize }     from './resizing';
import { drawCurrentPriceLine } from './currentHR';
import { maintainHeadsUpHR } from './headsUpHR';
import { plotterDrawText } from './plotterDrawText';

const inject = () => {
    maintainSpanSize();
    drawCurrentPriceLine();
    maintainHeadsUpHR();
    plotterDrawText();
};

export default inject;
