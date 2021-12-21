import Context from 'src/components/ui/Context';

export const overrideCalculateAwesome = () => {
    // Adding zoomOut() to the method in order to load more quotes for Awesome Oscillator when less than 34 quotes.
    CIQ.Studies.calculateAwesomeOscillator = function (stx: Context['stx'], sd: typeof CIQ.Studies.StudyDescriptor) {
        const quotes = sd.chart.scrubbed;
        if (quotes.length <= 33) {
            stx.zoomOut(null, 1.33);
            return;
        }

        CIQ.Studies.MA('simple', 5, 'hl/2', 0, '_MA5', stx, sd);
        CIQ.Studies.MA('simple', 34, 'hl/2', 0, '_MA34', stx, sd);

        for (let i = Math.max(sd.startFrom, 33); i < quotes.length; i++) {
            if (!quotes[i]) continue;
            quotes[i][`${sd.name}_hist`] = quotes[i][`_MA5 ${sd.name}`] - quotes[i][`_MA34 ${sd.name}`];
        }
        sd.outputMap = {};
        sd.outputMap[`${sd.name}_hist`] = '';
    };
    CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
        Awesome: {
            name: 'Awesome Oscillator',
            seriesFN: CIQ.Studies.displayAwesomeOscillator,
            calculateFN: CIQ.Studies.calculateAwesomeOscillator,
            inputs: {},
            outputs: { 'Increasing Bar': '#00DD00', 'Decreasing Bar': '#FF0000' },
        },
    });
};
