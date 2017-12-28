var Dispatcher = require('./Dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');


const constants = {
    "ADD_COMPARISON_SERIES": "ADD_COMPARISON_SERIES",
    "REMOVE_COMPARISON_SERIES": "REMOVE_COMPARISON_SERIES",
    "TOGGLE_DRAWING_TOOLBAR": "TOGGLE_DRAWING_TOOLBAR",
    "SHOW_LOADER": "SHOW_LOADER",
    "HIDE_LOADER": "HIDE_LOADER",
    "SET_SPAN": "SET_SPAN",
    "UPDATE_CHART_CONTAINER_SIZE": "UPDATE_CHART_CONTAINER_SIZE",
    "SET_SYMBOL": "SET_SYMBOL",
    "SET_PERIODICITY": "SET_PERIODICITY",
    "SET_CHARTTYPE": "SET_CHARTTYPE"
};

var ChartStore = assign({}, EventEmitter.prototype, {
    initialize: function () {
    },
    values: { comparisons: [], toolbarActive: false, ciq: null, chartAreaPadding: null },
    setChart: function (chart) {
        this.values.ciq = chart;
        //default cIQ Styling puts 15 px on the left and right of the chartContainer.
        let chartAreaPadding = 30;
        let rawChartAreaPadding = getComputedStyle(document.querySelector('.ciq-chart-area')).padding;
        if (rawChartAreaPadding) {
            chartAreaPadding = 2 * Number(rawChartAreaPadding.replace('px', ''));
        }
        this.values.chartAreaPadding = chartAreaPadding;
    },
    getChart: function () {
        return this.values.ciq;
    },
    getChartAreaPadding: function () {
        return this.values.chartAreaPadding;
    },
    getComparisons: function () {
        return this.values.comparisons;
    },
    addComparison: function (series) {
        this.values.comparisons.push(series);
    },
    removeComparison: function (series) {
        var index = this.values.comparisons.indexOf(series, 0);
        if (index > -1) {
            this.values.comparisons.splice(index, 1);
        }
    },
    addListener: function (events, callback) {
        for (var i = 0; i < events.length; i++) {
            this.on(events[i], callback);
        }
    },
    removeListener: function (events, callback) {
        for (var i = 0; i < events.length; i++) {
            this.removeListener(events[i], callback);
        }
    },
    toggleDrawingToolbar: function () {
        this.values.toolbarActive = !this.values.toolbarActive;
    },
    getToolbarStatus: function () {
        return this.values.toolbarActive;
    }
});

Dispatcher.register(function (action) {
    var actions = {
        "ADD_COMPARISON_SERIES": function () {
            ChartStore.addComparison(action.data);
            ChartStore.emit("comparisonsChange");
        },
        "REMOVE_COMPARISON_SERIES": function () {
            ChartStore.removeComparison(action.data);
            ChartStore.emit("comparisonsChange");
        },
        "TOGGLE_DRAWING_TOOLBAR": function () {
            ChartStore.toggleDrawingToolbar();
            ChartStore.emit("drawingToolbarChange");
        },
        "SET_SPAN": function () {
            let ciq = ChartStore.getChart();
            let { span, multiplier } = action.data;
            Dispatcher.dispatch({
                actionType: constants.SHOW_LOADER
            });
            ciq.setSpan({ span: span, multiplier: multiplier });

            setTimeout(function () {
                Dispatcher.dispatch({
                    actionType: constants.HIDE_LOADER
                });
            }, 1000);
        },
        "SHOW_LOADER": function () {
            ChartStore.emit("showLoader");
        },
        "HIDE_LOADER": function () {
            ChartStore.emit("hideLoader");
        },
        "UPDATE_CHART_CONTAINER_SIZE": function () {
            let ciq = ChartStore.getChart();
            let CHART_AREA_PADDING = ChartStore.getChartAreaPadding();
            let chartContainer = document.getElementById("chartContainer");
            let chartArea = document.querySelector('.ciq-chart-area');
            chartContainer.style.width = (chartArea.innerWidth - CHART_AREA_PADDING) + "px";
            chartContainer.style.height = (chartArea.innerHeight - CHART_AREA_PADDING) + "px";
            ciq.resizeChart();
        },
        "SET_SYMBOL": function () {
            let ciq = ChartStore.getChart();
            ciq.newChart(action.data);
            ChartStore.emit('symbolChange');
        },
        "SET_PERIODICITY": function () {
            let ciq = ChartStore.getChart();
            let { period, interval } = actions.data;
            ciq.setPeriodicityV2(period, interval);
            ChartStore.emit('periodChange');
        },
        "SET_CHARTTYPE": function () {
            let ciq = ChartStore.getChart();
            let type = action.data;
            if ((type.aggregationEdit && ciq.layout.aggregationType != type.type) || type.type == 'heikinashi') {
                ciq.setChartType('candle');
                ciq.setAggregationType(type.type);
            } else {
                ciq.setChartType(type.type);
                ciq.setAggregationType('ohlc');
            }
            ChartStore.emit("chartTypeChange");
            ChartStore.emit("aggregationChange");
        }
    };
    if (actions[action.actionType]) {
        actions[action.actionType]();
    }
});

var Actions = {
    addComparisonSeries: function (comparisons) {
        Dispatcher.dispatch({
            actionType: constants.ADD_COMPARISON_SERIES,
            data: comparisons
        });
    },
    removeComparisonSeries: function (comparisons) {
        Dispatcher.dispatch({
            actionType: constants.REMOVE_COMPARISON_SERIES,
            data: comparisons
        });
    },
    toggleDrawingToolbar: function () {
        Dispatcher.dispatch({
            actionType: constants.TOGGLE_DRAWING_TOOLBAR,
        });
    },
    setSpan: function (data) {
        Dispatcher.dispatch({
            actionType: constants.SET_SPAN,
            data: data
        });
    },
    updateChartContainerSize: function () {
        Dispatcher.dispatch({
            actionType: constants.UPDATE_CHART_CONTAINER_SIZE
        });
    },
    setSymbol: function (data) {
        Dispatcher.dispatch({
            actionType: constants.SET_SYMBOL,
            data: data
        });
    },
    setChartType: function (data) {
        Dispatcher.dispatch({
            actionType: constants.SET_CHARTTYPE,
            data: data
        });
    },
    hideLoader: function () {
        ChartStore.emit("hideLoader");
    },
    showLoader: function () {
        ChartStore.emit("showLoader");
    }

};
export { ChartStore, Actions };
