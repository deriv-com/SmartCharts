import { action, makeObservable, observable, when, runInAction, computed } from 'mobx';
import moment from 'moment';
import debounce from 'lodash.debounce';
import { TFlutterChart, TLoadHistoryParams, TQuote } from 'src/types';
import { createChartElement, runChartApp } from 'src/flutter-chart';
import Painter from 'src/flutter-chart/painter';
import { safeParse } from 'src/utils';
import { capitalize } from 'src/components/ui/utils';
import MainStore from '.';

export default class ChartAdapterStore {
    private mainStore: MainStore;
    isChartLoaded = false;
    flutterChart?: TFlutterChart;
    epochBounds = {
        leftEpoch: 0,
        rightEpoch: 0,
    };
    quoteBounds = {
        topQuote: 0,
        bottomQuote: 0,
    };
    isFeedLoaded = false;
    msPerPx?: number;
    drawingHoverIndex: number | undefined | null = null;
    isDataFitModeEnabled = false;
    isXScrollBlocked = false;
    painter = new Painter();
    drawingColor = 0;
    isScaled = false;
    crossHairValue?: {
        x: number;
        y: number;
        xLocal: number;
        yLocal: number;
        bottomIndex: number | undefined;
    } = {
            x: 0,
            y: 0,
            xLocal: 0,
            yLocal: 0,
            bottomIndex: 0,
        };
    touchValues: {
        deltaXTotal?: number;
        deltaYTotal?: number;
        multiTouch?: boolean;
        touchIds?: number[];
        x?: number;
        y?: number;
    } = {
            multiTouch: false,
            deltaXTotal: 0,
            deltaYTotal: 0,
            touchIds: [],
            x: 0,
            y: 0,
        };

    clearTouchDeltasTimer?: ReturnType<typeof setTimeout>;
    enableXScrollTimer?: ReturnType<typeof setTimeout>;
    enableYScrollTimer?: ReturnType<typeof setTimeout>;

    constructor(mainStore: MainStore) {
        makeObservable(this, {
            clearTouchDeltasTimer: observable,
            onMount: action.bound,
            onTickHistory: action.bound,
            onTouch: action.bound,
            onChartLoad: action.bound,
            onTick: action.bound,
            loadHistory: action.bound,
            onVisibleAreaChanged: action.bound,
            onQuoteAreaChanged: action.bound,
            setMsPerPx: action.bound,
            newChart: action.bound,
            enableXScrollTimer: observable,
            enableYScrollTimer: observable,
            scale: action.bound,
            scrollableChartParent: computed,
            toggleDataFitMode: action.bound,
            toggleXScrollBlock: action.bound,
            touchValues: observable,
            onCrosshairMove: action.bound,
            isDataFitModeEnabled: observable,
            isChartLoaded: observable,
            epochBounds: observable.ref,
            quoteBounds: observable.ref,
            msPerPx: observable,
            isFeedLoaded: observable,
            cleanChart: action.bound,
        });

        this.mainStore = mainStore;
        this.cleanChart();
        this.initFlutterCharts();
    }

    checkIndicatorHover = (
        dx: number,
        dy: number,
        dxLocal: number,
        dyLocal: number,
        bottomIndicatorIndex: number | undefined
    ) => {
        // dxLocal and dyLocal are the local position value correponding to the bottom indicator/main chart
        const epoch = this.flutterChart?.crosshair.getEpochFromX(dxLocal) || 0;
        const quote = (this.flutterChart?.crosshair.getQuoteFromY(dyLocal) || 0).toFixed(
            this.mainStore.crosshair.decimalPlaces
        );

        this.mainStore.crosshair.onMouseMove(dx, dy, epoch, quote);
        const getClosestEpoch = this.mainStore.chart.feed?.getClosestValidEpoch;
        const granularity = this.mainStore.chartAdapter.getGranularityInMs();

        const hoverIndex = this.flutterChart?.app.getIndicatorHoverIndex(
            dxLocal,
            dyLocal,
            getClosestEpoch,
            granularity,
            bottomIndicatorIndex
        );
        if (this.isScaled) {
            this.isScaled = false;
            return;
        }

        this.mainStore.studies.highlightIndicator(hoverIndex, dx, dy);
    };

    debouncedIndicatorHover = debounce(this.checkIndicatorHover, 5);

    initFlutterCharts() {
        window.jsInterop = {
            onChartLoad: this.onChartLoad,
            onMainSeriesPaint: this.painter.onPaint,
            onVisibleAreaChanged: this.onVisibleAreaChanged,
            onQuoteAreaChanged: this.onQuoteAreaChanged,
            loadHistory: this.loadHistory,
            onCrosshairDisappeared: () => {
                this.mainStore.crosshair.updateVisibility(false);
            },
            onCrosshairHover: (dx, dy, dxLocal, dyLocal, bottomIndicatorIndex) => {
                this.onCrosshairMove(dx, dy, dxLocal, dyLocal, bottomIndicatorIndex);

                if (this.drawingHoverIndex != null) {
                    const drawingRepoItems = this.mainStore.chartAdapter.flutterChart?.drawingTool
                        .getDrawingToolsRepoItems()
                        .map(item => safeParse(item))
                        .filter(item => item);

                    if (!drawingRepoItems) {
                        return;
                    }

                    const item = drawingRepoItems[this.drawingHoverIndex];

                    if (item) {
                        this.mainStore.crosshair.renderDrawingToolToolTip(
                            capitalize(item.name.replace('dt_', '')) || '',
                            dx,
                            dy
                        );
                    }
                }

                this.debouncedIndicatorHover(dx, dy, dxLocal, dyLocal, bottomIndicatorIndex);
            },
            indicators: {
                onRemove: (index: number) => {
                    this.mainStore.studies.deleteStudy(index);
                },
                onEdit: (index: number) => {
                    this.mainStore.studies.editStudyByIndex(index);
                },
                onSwap: (index1: number, index2: number) => {
                    const { activeItems } = this.mainStore.studies;
                    [activeItems[index1], activeItems[index2]] = [activeItems[index2], activeItems[index1]];
                },
            },
            drawingTool: {
                onAdd: () => {
                    this.mainStore.drawTools.onCreation();
                },
                onUpdate: () => {
                    this.mainStore.drawTools.onUpdate();
                },
                onLoad: (items: []) => {
                    this.mainStore.drawTools.onLoad(items);
                },
                onMouseEnter: (index: number) => {
                    this.drawingHoverIndex = index;
                },
                onMouseExit: () => {
                    this.drawingHoverIndex = null;
                    this.mainStore.crosshair.removeDrawingToolToolTip();
                },
            },
        };

        createChartElement({
            onChartLoad: this.onChartLoad,
        });
    }

    onMount(element: HTMLDivElement) {
        element.appendChild(window.flutterChartElement);
        const initState = window._flutter.initState;
        initState.isMounted = true;

        if (initState.isEngineIntialized && !initState.isInitialRunCompleted) {
            runChartApp();
        }

        window.flutterChartElement?.addEventListener('wheel', this.onWheel, { capture: true });
        window.flutterChartElement?.addEventListener('touchstart', this.onTouch, { capture: true });
        window.flutterChartElement?.addEventListener('touchmove', this.onTouch, { capture: true });
        window.flutterChartElement?.addEventListener('touchend', this.onTouch, { capture: true });
        window.flutterChartElement?.addEventListener('dblclick', this.onDoubleClick, { capture: true });
    }

    onUnmount() {
        window._flutter.initState.isMounted = false;

        window.flutterChartElement?.removeEventListener('wheel', this.onWheel, { capture: true });
        window.flutterChartElement?.removeEventListener('touchstart', this.onTouch, { capture: true });
        window.flutterChartElement?.removeEventListener('touchmove', this.onTouch, { capture: true });
        window.flutterChartElement?.removeEventListener('touchend', this.onTouch, { capture: true });
        window.flutterChartElement?.removeEventListener('dblclick', this.onDoubleClick, { capture: true });
        clearTimeout(this.clearTouchDeltasTimer);
        clearTimeout(this.enableXScrollTimer);
        clearTimeout(this.enableYScrollTimer);
    }

    onChartLoad() {
        this.flutterChart = window.flutterChart;
        this.isChartLoaded = true;
    }

    cleanChart() {
        // Clean charts if it's already loaded
        if (window.flutterChartElement) {
            this.updateLeftMargin();
            this.setShowInterval(false);
            this.setSymbolClosed(false);
        }
    }

    onTouch(e: TouchEvent) {
        // Prevent vertical scroll on the chart for touch devices by forcing scroll on a scrollable parent of the chart:
        const chartNode = this.mainStore.chart.chartNode;
        const flutterChart = document.querySelector('.flutter-chart') as HTMLElement;

        if (chartNode && this.scrollableChartParent && !this.mainStore.state.isVerticalScrollEnabled) {
            if (this.touchValues.multiTouch) {
                if (e.type === 'touchend') {
                    this.touchValues.touchIds = this.touchValues.touchIds?.filter(
                        id => id === e.changedTouches[0].identifier
                    );
                    this.touchValues = { multiTouch: !!this.touchValues.touchIds?.length };
                }
                return;
            }
            if (e.touches.length > 1) {
                this.touchValues = { multiTouch: true };
                this.touchValues.touchIds = Array.from(e.touches).map(touch => touch.identifier);
                return;
            }

            const { pageX, pageY } = e.changedTouches[0];

            if (['touchmove', 'touchend'].includes(e.type)) {
                const forcedScrollAreaWidth = chartNode.offsetWidth - this.mainStore.chart.yAxisWidth;
                const forcedScrollAreaHeight = chartNode.offsetHeight - this.mainStore.chart.xAxisHeight;

                const { top, left } = chartNode.getBoundingClientRect();
                const xCoord = pageX - left;
                const yCoord = pageY - top;
                const isForcedScrollArea = xCoord < forcedScrollAreaWidth && yCoord < forcedScrollAreaHeight;

                const isTouchOnYAxis = xCoord >= forcedScrollAreaWidth;

                if (this.touchValues.x && this.touchValues.y) {
                    const xDiff = this.touchValues.x - pageX;
                    const yDiff = this.touchValues.y - pageY;
                    const deltaXTotal = (this.touchValues.deltaXTotal ?? 0) + xDiff;
                    const deltaYTotal = (this.touchValues.deltaYTotal ?? 0) + yDiff;
                    const deltaX = e.type === 'touchend' ? Math.abs(deltaXTotal) : Math.abs(xDiff);
                    const deltaY = e.type === 'touchend' ? Math.abs(deltaYTotal) : Math.abs(yDiff);
                    const isVerticalScroll = deltaY > deltaX;
                    this.touchValues = { ...this.touchValues, deltaXTotal, deltaYTotal };

                    if (isForcedScrollArea && isVerticalScroll) {
                        if (!this.isXScrollBlocked) this.toggleXScrollBlock(true, flutterChart);
                    } else if (!this.isXScrollBlocked && isTouchOnYAxis) {
                        this.stopScroll(flutterChart);
                    }
                }
                this.touchValues = { ...this.touchValues, x: pageX, y: pageY };
                if (e.type === 'touchend' && this.isXScrollBlocked) {
                    this.enableXScrollTimer = setTimeout(() => {
                        this.toggleXScrollBlock(false, flutterChart);
                    }, 100);
                }
            }
            if (['touchstart', 'touchend'].includes(e.type)) {
                this.touchValues =
                    e.type === 'touchstart'
                        ? { x: pageX, y: pageY }
                        : { deltaYTotal: this.touchValues.deltaYTotal, deltaXTotal: this.touchValues.deltaXTotal };
            }
        }
    }

    onWheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Prevent vertical scroll on the chart on wheel devices by disabling pointer events to make chart parent scrollable:
        const chartNode = this.mainStore.chart.chartNode;
        if (chartNode && !this.mainStore.state.isVerticalScrollEnabled) {
            const nonScrollableAreaWidth = chartNode.offsetWidth - this.mainStore.chart.yAxisWidth;
            const { left } = chartNode.getBoundingClientRect();
            const isVerticalScroll = e.deltaY && e.deltaX === 0;
            const x = e.pageX - left;
            if (x < nonScrollableAreaWidth && isVerticalScroll) {
                if (this.enableYScrollTimer) return;
                chartNode.style.pointerEvents = 'none';
                this.enableYScrollTimer = setTimeout(() => {
                    chartNode.style.pointerEvents = 'auto';
                    this.enableYScrollTimer = undefined;
                }, 300);
                return;
            }
        }

        if (e.deltaX === 0 && e.deltaZ === 0) {
            const value = (100 - Math.min(10, Math.max(-10, e.deltaY))) / 100;
            this.scale(value);
        } else {
            window.flutterChart?.app.scroll(e.deltaX);
        }
        return false;
    };

    onDoubleClick = () => {
        if (this.drawingHoverIndex != null) {
            this.mainStore.drawTools.onSetting(this.drawingHoverIndex);
            this.mainStore.crosshair.removeDrawingToolToolTip();
        } else if (this.mainStore.studies.currentHoverIndex != null) {
            this.mainStore.studies.editStudyByIndex(this.mainStore.studies.currentHoverIndex);
            this.mainStore.studies.clearHoverItem(this.mainStore.studies.currentHoverIndex);
        }
    };

    onCrosshairMove(dx: number, dy: number, dxLocal: number, dyLocal: number, bottomIndicatorIndex?: number) {
        // dxLocal and dyLocal are the local position value correponding to the bottom indicator/main chart
        const epoch = this.flutterChart?.crosshair.getEpochFromX(dxLocal) || 0;
        const quote = (this.flutterChart?.crosshair.getQuoteFromY(dyLocal) || 0).toFixed(
            this.mainStore.crosshair.decimalPlaces
        );

        this.mainStore.crosshair.onMouseMove(dx, dy, epoch, quote);
        this.crossHairValue = {
            x: dx,
            y: dy,
            xLocal: dxLocal,
            yLocal: dyLocal,
            bottomIndex: bottomIndicatorIndex,
        };
    }

    onVisibleAreaChanged(leftEpoch: number, rightEpoch: number) {
        if (this.epochBounds.leftEpoch !== leftEpoch || this.epochBounds.rightEpoch !== rightEpoch) {
            this.epochBounds = {
                leftEpoch,
                rightEpoch,
            };
        }

        if (this.crossHairValue) {
            const { x, y, yLocal, xLocal, bottomIndex } = this.crossHairValue;
            if (x !== 0 && y !== 0) {
                this.onCrosshairMove(x, y, xLocal, yLocal, bottomIndex);
            }
        }
    }

    onQuoteAreaChanged(topQuote: number, bottomQuote: number) {
        this.quoteBounds = {
            topQuote,
            bottomQuote,
        };
    }

    getGranularityInMs() {
        const granularity: number = this.mainStore.state.granularity || 1;
        return granularity * 1000;
    }

    newChart = async () => {
        this.isFeedLoaded = false;
        this.isDataFitModeEnabled = this.mainStore.chart.startWithDataFitMode || false;

        await when(() => this.isChartLoaded);

        this.flutterChart?.app.newChart({
            symbol: this.mainStore.chart.currentActiveSymbol?.symbol,
            granularity: this.getGranularityInMs(),
            chartType: this.mainStore.state.chartType,
            isLive: this.mainStore.chart.isLive || false,
            startWithDataFitMode: this.isDataFitModeEnabled,
            theme: this.mainStore.chartSetting.theme,
            msPerPx: this.msPerPx,
            pipSize: this.mainStore.chart.pip,
            isMobile: this.mainStore.chart.isMobile || false,
            yAxisMargin: this.mainStore.state.yAxisMargin,
        });
    };

    async onTickHistory(quotes: TQuote[]) {
        this.isFeedLoaded = true;

        await when(() => this.isChartLoaded);

        this.mainStore.chart.feed?.updateQuotes(quotes, false);
        this.flutterChart?.feed.onTickHistory(quotes, false);
    }

    async onTick(quote: TQuote) {
        await when(() => this.isChartLoaded);

        const lastQuote = this.mainStore.chart.feed?.quotes[this.mainStore.chart.feed?.quotes.length - 1];
        if (lastQuote && new Date(lastQuote.Date) > new Date(quote.Date)) return;

        this.mainStore.chart.feed?.addQuote(quote);

        runInAction(() => {
            this.mainStore.chart.lastQuote = quote;
        });

        if (quote.ohlc) {
            this.flutterChart?.feed.onNewCandle(quote);
        } else if (this.getGranularityInMs() < 60000) {
            this.flutterChart?.feed.onNewTick(quote);
        }
    }

    loadHistory(payload: TLoadHistoryParams) {
        const { count, end } = payload;
        const { state, chart } = this.mainStore;
        const { granularity } = state;

        chart.feed?.fetchPaginationData(
            chart.currentActiveSymbol?.symbol as string,
            end,
            count,
            granularity,
            ({ quotes }) => {
                this.mainStore.chart.feed?.updateQuotes(quotes || [], true);
                this.flutterChart?.feed.onTickHistory(quotes || [], true);
            }
        );
    }

    updateChartStyle(chartType: string) {
        this.flutterChart?.config.updateChartStyle(chartType);
    }

    async updateTheme(theme: string) {
        await when(() => this.isChartLoaded);
        this.flutterChart?.config.updateTheme(theme);
    }

    async updateLeftMargin(leftMargin?: number) {
        await when(() => this.isChartLoaded);
        this.flutterChart?.config.updateLeftMargin(leftMargin);
    }

    async updateLiveStatus(isLive: boolean) {
        await when(() => this.isChartLoaded);
        this.flutterChart?.config.updateLiveStatus(isLive);
    }

    async setSymbolClosed(isClosed: boolean) {
        await when(() => this.isChartLoaded);
        this.flutterChart?.config.setSymbolClosed(isClosed);
    }

    async updateRightPadding(rightPadding?: number) {
        await when(() => this.isChartLoaded);
        this.flutterChart?.config.updateRightPadding(rightPadding);
    }

    async setShowInterval(showInterval: boolean) {
        await when(() => this.isChartLoaded);
        this.flutterChart?.config.toggleTimeIntervalVisibility(showInterval);
    }

    scale(scale: number) {
        if (this.mainStore.studies.currentHoverIndex !== null) {
            this.isScaled = true;
        }

        this.isDataFitModeEnabled = false;
        const msPerPx = this.flutterChart?.app.scale(scale);

        if (msPerPx != null) {
            this.setMsPerPx(msPerPx);
        }
    }

    toggleXScrollBlock = (isBlocked = true, flutterChart: HTMLElement) => {
        this.isXScrollBlocked = isBlocked;
        if (flutterChart) {
            if (isBlocked) {
                flutterChart.style.overflowY = 'scroll';
                flutterChart.style.overflowX = 'hidden';
                flutterChart.style.overscrollBehavior = 'contain';
                flutterChart.style.touchAction = 'pan-y';
            } else {
                this.allowScroll(flutterChart);
            }
        }
    };

    allowScroll = (element: HTMLElement) => {
        let lastScrollTop = element.scrollTop;
        let isScrolling = false;
        let scrollTimeout: ReturnType<typeof setTimeout>;

        const monitorScroll = () => {
            if (element.scrollTop !== lastScrollTop) {
                isScrolling = true;
                lastScrollTop = element.scrollTop;

                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    this.stopScroll(element);
                }, 200);
            } else {
                isScrolling = false;
            }

            if (isScrolling) {
                requestAnimationFrame(monitorScroll);
            }
        };
        requestAnimationFrame(monitorScroll);
    };

    stopScroll = (element: HTMLElement) => {
        element.style.removeProperty('overflow-y');
        element.style.removeProperty('overflow-x');
        element.style.removeProperty('touch-action');
    };

    toggleDataFitMode = () => {
        this.isDataFitModeEnabled = !this.isDataFitModeEnabled;
        window.flutterChart?.app.toggleDataFitMode(this.isDataFitModeEnabled);
    };

    async updateContracts(contractsMarker: any[]) {
        const transformedContractsMarker = contractsMarker
            .filter(c => c.markers?.length > 0)
            .map(c => {
                c.markers.forEach((m: any) => {
                    if (!m.quote) {
                        const { price } = this.getInterpolatedPositionAndPrice(m.epoch * 1000) || {};
                        m.quote = price;
                    }
                });
                return c;
            });

        await when(() => this.isFeedLoaded);

        this.flutterChart?.config.updateContracts(transformedContractsMarker);
    }

    getInterpolatedPositionAndPrice = (epoch: number) => {
        if (!epoch) return;

        const date = moment.utc(epoch).toDate();

        const tickIdx = this.mainStore.chart.feed?.getClosestQuoteIndexForEpoch(epoch);

        // To not place markers in the middle of ticks.
        let x: number = this.getXFromEpoch(epoch);

        if (typeof tickIdx === 'number' && tickIdx > -1) {
            const bar = this.mainStore.chart.feed?.quotes[tickIdx];

            let price = bar ? bar.Close : null;
            let delta_x, delta_y, ratio;

            // Here we interpolate the pixel distance between two adjacent ticks.
            if (bar && (bar.DT as Date) < date) {
                const barNext = this.mainStore.chart.feed?.quotes[tickIdx + 1];
                const barPrev = tickIdx > 0 ? this.mainStore.chart.feed?.quotes[tickIdx - 1] : null;

                if (barNext && barNext.Close && (barNext.DT as Date) > date) {
                    delta_x = this.getXFromEpoch((barNext.DT as Date).getTime()) - x;

                    ratio =
                        (((date as unknown) as number) - (bar.DT as Date).getTime()) /
                        ((barNext.DT as Date).getTime() - (bar.DT as Date).getTime());

                    if (price) delta_y = barNext.Close - price;
                } else if (barPrev && barPrev.Close) {
                    delta_x = x - this.getXFromEpoch((barPrev.DT as Date).getTime());

                    ratio =
                        (((date as unknown) as number) - (bar.DT as Date).getTime()) /
                        ((bar.DT as Date).getTime() - (barPrev.DT as Date).getTime());

                    if (price) delta_y = price - barPrev.Close;
                }
            }

            if (ratio) {
                if (delta_x) {
                    x += ratio * delta_x;
                }

                if (price && delta_y) {
                    price += ratio * delta_y;
                }
            }

            return {
                x,
                price,
            };
        }
    };

    setMsPerPx(msPerPx?: number) {
        this.msPerPx = msPerPx;
        this.mainStore.state.saveLayout();
    }

    getXFromEpoch(epoch: number) {
        return this.flutterChart?.app.getXFromEpoch(epoch) ?? 0;
    }

    getYFromQuote(quote: number) {
        return this.flutterChart?.app.getYFromQuote(quote) ?? 0;
    }

    getEpochFromX(x: number) {
        return this.flutterChart?.app.getEpochFromX(x) ?? 0;
    }

    getQuoteFromY(y: number) {
        return this.flutterChart?.app.getQuoteFromY(y) ?? 0;
    }

    get scrollableChartParent() {
        const chartNode = this.mainStore.chart.chartNode;
        if (!chartNode) return undefined;
        let parent = chartNode.parentElement;
        while (parent) {
            const { overflow } = window.getComputedStyle(parent);
            if (overflow.split(' ').every(o => o === 'auto' || o === 'scroll')) {
                return parent;
            }
            parent = parent.parentElement;
        }
        return document.documentElement;
    }
}
