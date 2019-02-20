import { maintainSpanSize }     from './resizing';
import { drawCurrentPriceLine } from './currentHR';

const inject = () => {
    maintainSpanSize();
    drawCurrentPriceLine();
};

export default inject;
