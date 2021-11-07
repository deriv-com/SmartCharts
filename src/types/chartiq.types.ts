import '../../chartiq/development/js/chartiq.js';

export type TCIQChartEngineChart = typeof CIQ.ChartEngine.Chart;

export type TCIQAddEventListener<C> = {
    type: string | Array<string>;
    cb: C;
};

export type TCIQAppend<C> = {
    method: string;
    func: C;
};