import { action, computed, observable, when, makeObservable } from 'mobx';
import moment from 'moment';
import Context from 'src/components/ui/Context';
import { TQuote } from 'src/types';
import MainStore from '.';
import { sameBar } from '../utils';

type TDupMap = {
    [key: string]: number;
};

type TRow = {
    name: string;
    value: string;
};

type TUpdateTooltipPositionParams = {
    left: number;
    top: number;
    rows: TRow[] | null;
};

type TBarData = {
    Ask?: number;
    Bid?: number;
    Close: number;
    DT: Date;
    Date: string;
    High?: number;
    Low?: number;
    Open?: number;
    atr: number;
    cache: { Close: number };
    candleWidth: number | null;
    chartJustAdvanced?: boolean;
    displayDate: Date;
    'hl/2': number;
    'hlc/3': number;
    'hlcc/4': number;
    iqPrevClose: number;
    'ohlc/4': number;
    ratio: number;
    tick: number;
    tickAnimationProgress?: number;
    trueRange: number;
};

type TMouseMoveCallback = (ev: MouseEvent) => void;

const MAX_TOOLTIP_WIDTH = 315;
class CrosshairStore {
    mainStore: MainStore;
    prev_arrow?: string;

    state: number | null = 2;

    constructor(mainStore: MainStore) {
        makeObservable(this, {
            activeSymbol: computed,
            decimalPlaces: computed,
            state: observable,
            toggleState: action.bound,
            updateProps: action.bound,
            setCrosshairState: action.bound,
        });

        this.mainStore = mainStore;
        when(() => !!this.context, this.onContextReady);
    }
    get activeSymbol() {
        return this.mainStore.chart.currentActiveSymbol;
    }
    get decimalPlaces() {
        return this.activeSymbol?.decimal_places;
    }
    get showOhl(): boolean {
        return this.mainStore.timeperiod.timeUnit != 'tick' && this.mainStore.chartType.isCandle;
    }
    get context(): Context | null {
        return this.mainStore.chart.context;
    }

    get isChartReady() {
        return this.mainStore.state.isChartReady;
    }

    node = null;
    lastBar = {};
    showChange = false;
    showSeries = false;
    showStudies = false;
    onCrosshairChanged: (state?: number | null) => void | null = () => null;
    onContextReady = () => {
        // const storedState = this.stx.layout.crosshair;
        // const state = typeof storedState !== 'number' ? 2 : storedState;
        const state = 2;
        this.setCrosshairState(state);
    };

    onMount = (onMouseMove: TMouseMoveCallback) => {
        const contentWindow = document.querySelector('iframe')?.contentWindow;
        if (contentWindow) {
            contentWindow.addEventListener('mousemove', this.renderCrosshairTooltip);
            contentWindow.addEventListener('mousemove', onMouseMove);
            contentWindow.addEventListener('mouseover', this.onMouseOver);
            contentWindow.addEventListener('mouseout', this.onMouseOut);
        }
    };

    onUnmount = (onMouseMove: TMouseMoveCallback) => {
        const contentWindow = document.querySelector('iframe')?.contentWindow;
        if (contentWindow) {
            contentWindow.removeEventListener('mousemove', this.renderCrosshairTooltip);
            contentWindow.removeEventListener('mousemove', onMouseMove);
            contentWindow.removeEventListener('mouseover', this.onMouseOver);
            contentWindow.removeEventListener('mouseout', this.onMouseOut);
        }
    };

    onMouseMove = (ev: MouseEvent) => {
        this.renderCrosshairTooltip(ev);
    };

    onMouseOver = () => {
        this.updateVisibility(true);
    };

    onMouseOut = () => {
        this.updateVisibility(false);
    };

    toggleState() {
        const state = ((this.state as number) + 1) % 3;
        this.setCrosshairState(state);
    }
    updateProps(onChange?: () => void) {
        this.onCrosshairChanged = onChange || (() => null);
    }
    setCrosshairState(state: number | null) {
        if (!this.context) {
            return;
        }
        this.state = state;

        this.mainStore.state.crosshairState = state;
        this.mainStore.state.saveLayout();
        this.onCrosshairChanged(this.state);
    }
    renderCrosshairTooltip = (ev: MouseEvent) => {
        // if no tooltip exists, then skip
        if (this.state !== 2) return;

        const { offsetX, offsetY } = ev;

        const epoch = this.mainStore.chartAdapter.getEpochFromX(offsetX);

        const data = this.mainStore.chart.feed?.getClosestQuoteForEpoch(epoch);
        if (!data || !this.isChartReady) {
            this.updateTooltipPosition({ left: -5000, top: 0, rows: null });
            return;
        }

        let rows = null;
        if (!sameBar(data, this.lastBar as TQuote)) {
            rows = this.calculateRows(data);
            this.lastBar = data;
        }
        this.updateTooltipPosition({
            left: offsetX,
            top: offsetY,
            rows,
        });
    };
    calculateRows(data: TQuote) {
        const dupMap = {} as TDupMap;
        const fields: {
            member: string;
            display: string;
        }[] = [];
        {
            // Access main chart panel and yAxis in this scope:
            fields.push({
                member: 'DT',
                display: 'DT',
            });
            dupMap.DT = dupMap.Close = 1;
            if (this.showChange) {
                //CIQ.ChartEngine.isDailyInterval(stx.layout.interval)
                fields.push({
                    member: 'Change',
                    display: 'Change',
                });
            }
            if (this.showOhl) {
                for (const el of ['Open', 'Close', 'High', 'Low']) {
                    fields.push({
                        member: el,
                        display: el,
                    });
                }
                dupMap.Open = dupMap.High = dupMap.Low = 1;
            }
            if (this.activeSymbol?.name) {
                const display = this.activeSymbol?.name as string;
                fields.push({
                    member: 'Close',
                    display,
                });
            }
        }

        const rows = [];
        for (const obj of fields) {
            const { member: name, display: displayName } = obj;

            let dsField = data[name as keyof typeof data];

            const fieldName = displayName?.replace(/^(Result )(.*)/, '$2');
            if (dsField && (name === 'DT' || typeof dsField !== 'object')) {
                let fieldValue = '';
                if (dsField.constructor === Number) {
                    fieldValue = dsField.toString();
                } else if (dsField.constructor === Date) {
                    fieldValue = moment(dsField).format(this.getDateTimeFormat());
                } else {
                    fieldValue = dsField as string;
                }
                rows.push({
                    name: fieldName.toUpperCase(),
                    value: fieldValue,
                });
            }
        }
        return rows;
    }
    updateVisibility = (visible: boolean) => {
        const crosshair = this.context?.topNode?.querySelector('.cq-crosshair');
        if (crosshair) {
            if (visible) crosshair.classList.add('active');
            else crosshair.classList.remove('active');
        }
    };
    // YES! we are manually patching DOM, Because we don't want to pay
    // for react reconciler & mox tracking observables.
    updateTooltipPosition({ top, left, rows }: TUpdateTooltipPositionParams) {
        const crosshair: HTMLElement | null | undefined = this.context?.topNode?.querySelector('.cq-crosshair-tooltip');

        if (crosshair) {
            crosshair.style.transform = `translate(${left}px, ${top}px)`;
            const tooltipRightLimit = this.mainStore.state.crosshairTooltipLeftAllow || MAX_TOOLTIP_WIDTH;
            const arrow = left <= tooltipRightLimit ? 'arrow-left' : 'arrow-right';
            if (arrow !== this.prev_arrow) {
                if (this.prev_arrow) {
                    crosshair.classList.remove(this.prev_arrow);
                }
                crosshair.classList.add(arrow);
                this.prev_arrow = arrow;
            }
            // if there is a need to update the rows.
            if (rows !== null) {
                const content = crosshair.querySelector('.cq-crosshair-content');
                if (content) {
                    content.innerHTML = rows
                        .map(
                            (r: TRow) => `
                <div class="row">
                    <span>${r.name !== 'DT' ? r.name : r.value}</span>
                    <span>${r.name !== 'DT' ? r.value : ''}</span>
                </div>
            `
                        )
                        .join('');
                }
            }
        }
    }

    getDateTimeFormat = () => {
        switch (this.mainStore.timeperiod.timeUnit) {
            case 'day':
                return 'DD/MM/YYYY';
            case 'hour':
            case 'minute':
                return 'DD/MM HH:mm';
            case 'tick':
                return 'DD/MM HH:mm:ss';
            default:
                return 'DD/MM HH:mm';
        }
    };
}
export default CrosshairStore;
