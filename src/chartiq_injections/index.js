import { createXAxis }            from './createXAxis';
import { maintainHeadsUpHR }      from './headsUpHR';
// import { manageMasterDataLength } from './manageMasterDataLength';
import { maintainSpanSize }       from './resizing';
import { setMaxTicks }            from './setMaxTicks';
import { plotterDrawText }        from './plotterDrawText';
import { overideMeasure }         from './setMeasure';
import { registerHTMLElements }   from './registerHTMLElements';
import { stickyInterior }         from './stickyInterior';

const inject = (option) => {
    createXAxis();
    maintainHeadsUpHR();
    maintainSpanSize();
    // manageMasterDataLength();
    plotterDrawText();
    setMaxTicks();
    overideMeasure(option);
    registerHTMLElements();
    stickyInterior(option);
};

export default inject;
