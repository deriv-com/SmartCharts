import { action, computed, observable, when, makeObservable } from 'mobx';
import moment from 'moment';
import Context from 'src/components/ui/Context';
import { TQuote } from 'src/types';
import MainStore from '.';
import { sameBar } from '../utils';
import { getTooltipLabels } from 'src/Constant';

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

type TCrosshairRefs = {
    crosshairRef: React.RefObject<HTMLDivElement>;
    crossHairXRef: React.RefObject<HTMLDivElement>;
    crossHairYRef: React.RefObject<HTMLDivElement>;
    floatDateRef: React.RefObject<HTMLDivElement>;
    floatPriceRef: React.RefObject<HTMLDivElement>;
};

const MAX_TOOLTIP_WIDTH = 315;
class CrosshairStore {
    mainStore: MainStore;
    prev_arrow?: string;

    state?: number = 2;

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

    refs?: TCrosshairRefs;

    isOverChartContainer = false;

    onCrosshairChanged: (state?: number) => void = () => null;

    onMount = async (refs: TCrosshairRefs) => {
        await when(() => this.mainStore.chartAdapter.isChartLoaded);
        const contentWindow = document.querySelector('.chartContainer');
        if (contentWindow) {
            contentWindow.addEventListener('mouseover', this.onMouseOver);
            contentWindow.addEventListener('mouseout', this.onMouseOut);
        }
        this.refs = refs;
    };

    onUnmount = () => {
        const contentWindow = document.querySelector('.chartContainer');
        if (contentWindow) {
            contentWindow.removeEventListener('mouseover', this.onMouseOver);
            contentWindow.removeEventListener('mouseout', this.onMouseOut);
        }
        this.refs = undefined;
    };

    onMouseMove = (dx: number, dy: number, epoch: number, quote: String) => {
        if (!this.isOverChartContainer) return;

        this.setPositions(dx, dy, epoch, quote);
        this.renderCrosshairTooltip(dx, dy);

        this.mainStore.crosshair.updateVisibility(true);
    };

    onMouseOver = () => {
        this.isOverChartContainer = true;
        this.updateVisibility(true);
    };

    onMouseOut = () => {
        this.isOverChartContainer = false;
        this.updateVisibility(false);
    };

    toggleState() {
        const state = ((this.state as number) + 1) % 3;
        this.setCrosshairState(state);
    }
    updateProps(onChange?: () => void) {
        this.onCrosshairChanged = onChange || (() => null);
    }

    setPositions = (offsetX: number, offsetY: number, epoch: number, quote: String) => {
        if (!this.refs) return;
        const { crossHairXRef, crossHairYRef, floatDateRef, floatPriceRef } = this.refs;

        if (crossHairXRef.current) crossHairXRef.current.style.transform = `translate(${offsetX}px, 0px)`;
        if (crossHairYRef.current) crossHairYRef.current.style.transform = `translate(0px, ${offsetY}px)`;
        if (floatDateRef.current) {
            const width = floatDateRef.current.clientWidth;
            floatDateRef.current.innerText = moment.utc(epoch).format(this.getDateTimeFormat());
            floatDateRef.current.style.transform = `translate(${offsetX - width / 2}px, 0px)`;
        }
        if (floatPriceRef.current) {
            const height = floatPriceRef.current.clientHeight;
            const price = this.mainStore.chartAdapter.getQuoteFromY(offsetY);

            if (price >= 0) {
                floatPriceRef.current.innerText = `${quote}`;
            }
            floatPriceRef.current.style.transform = `translate(0px, ${offsetY - height / 2}px)`;
        }
    };

    setCrosshairState(state?: number) {
        if (!this.context) {
            return;
        }
        this.state = state;

        this.mainStore.state.crosshairState = state;
        this.mainStore.state.saveLayout();
        this.onCrosshairChanged(this.state);

        const isCrosshairVisible = state !== 0;
        this.mainStore.chartAdapter.flutterChart?.config.updateCrosshairVisibility(isCrosshairVisible);
    }
    renderCrosshairTooltip = (offsetX: number, offsetY: number) => {
        // if no tooltip exists, then skip
        if (this.state !== 2) return;

        if (!this.mainStore.chartAdapter.isChartLoaded) return;

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

        const tooltipContent = window.flutterChart.indicators.getTootipContent(data.DT!.getTime());

        tooltipContent?.forEach(item => {
            const labels = getTooltipLabels(item.name)?.labels || [];

            labels.forEach((label, i) => {
                rows.push({
                    name: label,
                    value: item.values[i],
                });
            });
        });

        return rows;
    }
    updateVisibility = (visible: boolean) => {
        const crosshair = this.refs?.crosshairRef.current;
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
