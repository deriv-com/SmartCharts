import { observable, action, computed, reaction } from 'mobx';
import moment from 'moment';
import Dialog from '../components/Dialog.jsx';
import DialogStore from './DialogStore';

export default class ChartTableStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        this.dialog = new DialogStore(mainStore);
        this.Dialog = this.dialog.connect(Dialog);
        this.dateElements = {};
        reaction(() => this.dialog.open, this.loadTableData);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }
    get state() { return this.mainStore.state; }
    get chartTypeStore() { return this.mainStore.chartType; }

    @computed get open() { return this.dialog.open; }
    @action.bound setOpen(value) {
        return this.dialog.setOpen(value);
    }

    @observable scrollPanel;
    @observable scrollTop;
    @observable tableData = [];
    @observable isTick;
    @observable lastTick;
    @observable scrollPanelTop;

    @computed get symbol() {
        return this.mainStore.chart.currentActiveSymbol ? this.mainStore.chart.currentActiveSymbol : {};
    }

    @computed get decimalPlaces() {
        return this.mainStore.chart.currentActiveSymbol.decimal_places;
    }

    @action.bound loadTableData() {
        if (this.open) {
            this.stx.masterData.forEach(row => this.updateTableData(row));
            this.mainStore.chart.feed.onMasterDataUpdate(this.updateTableData);
        } else {
            if (this.mainStore.chart.feed) this.mainStore.chart.feed.offMasterDataUpdate(this.updateTableData);
            this.tableData =  [];
            if (this.chartTypeStore.onChartTypeChanged && this.state.prevChartType) {
                this.chartTypeStore.onChartTypeChanged(this.state.prevChartType);
            }
        }
    }

    @action.bound updateTableData({ DT, Open, High, Low, Close }) {
        this.isTick = this.mainStore.timeperiod.timeUnit === 'tick';
        const lastTick =  this.lastTick || {};
        const change = Close - lastTick.Close || 0;
        let status = '';
        if (Math.sign(change) !== 0) status = Math.sign(change) === 1 ? 'up' :  'down';
        const dateTime = moment(DT.getTime()).format(`HH:mm${this.isTick ? ':ss' : ''}`);
        const dateKey = moment(DT.getTime()).format('YYYYMMDD');
        let dateGroup = this.tableData.find(x => x.key === dateKey);
        const data = this.isTick ? {
            Date: dateTime,
            Close: `${Close.toFixed(this.decimalPlaces)}`,
            Change: `${Math.abs(change).toFixed(this.decimalPlaces)}`,
            Status: status,
        } : {
            Date: dateTime,
            Open: `${Open.toFixed(this.decimalPlaces)}`,
            High: `${High.toFixed(this.decimalPlaces)}`,
            Low: `${Low.toFixed(this.decimalPlaces)}`,
            Close: `${Close.toFixed(this.decimalPlaces)}`,
            Change: `${Math.abs(change).toFixed(this.decimalPlaces)}`,
            Status: status,
        };

        if (!dateGroup) {
            dateGroup = {
                key: dateKey,
                date: moment(DT.getTime()).format('DD MMM YYYY'),
                datas: [data],
            };
            this.tableData.unshift(dateGroup);
        } else {
            const oldData = dateGroup.datas.find(x => x.Date === dateTime);
            if (oldData) {
                let previousClose = 0;

                // if the first group has more than 2 data, let compare
                if (this.tableData.lenght && this.tableData[0].datas.lenght > 1) {
                    previousClose = this.tableData[0].datas[1].Close;

                // if not above, then let pick previous Close from last item in previous group
                } else if (this.tableData.lenght && this.tableData.lenght > 1 && this.tableData[0].datas.lenght === 1) {
                    previousClose = this.tableData[1].datas[0].Close;
                }

                const firstItemChange = Close - previousClose;
                let firstItemStatus = '';
                if (Math.sign(firstItemChange) !== 0) firstItemStatus = (Math.sign(firstItemChange) === 1 ? 'up' : 'down');

                oldData.High = `${High.toFixed(this.decimalPlaces)}`;
                oldData.Low = `${Low.toFixed(this.decimalPlaces)}`;
                oldData.Close = `${Close.toFixed(this.decimalPlaces)}`;
                oldData.Change = `${Math.abs(firstItemChange).toFixed(this.decimalPlaces)}`;
                oldData.Status = firstItemStatus;
            } else {
                dateGroup.datas.unshift(data);
            }
        }
        this.tableData = this.tableData.slice(0); // force array update
        this.lastTick = data;
    }

    @action.bound updateScrollSpy() {
        const scrollTop = this.scrollPanel.getValues().top;
        this.scrollTop = scrollTop;
    }

    @action.bound setDateElement(date, element) {
        this.dateElements[date] = element;
    }

    @action.bound setScrollPanel(element) {
        this.scrollPanel =  element;
    }
}
