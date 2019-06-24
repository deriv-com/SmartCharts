import { observable, action, computed, reaction } from 'mobx';
import Dialog from '../components/Dialog.jsx';
import DialogStore from './DialogStore';

export default class ChartTableStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        this.dialog = new DialogStore(mainStore);
        this.Dialog = this.dialog.connect(Dialog);
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

    @observable tableData = [];
    @observable isTick;

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
            this.mainStore.chart.feed.offMasterDataUpdate(this.updateTableData);
            this.tableData =  [];
            if (this.state.prevChartType) {
                this.state.chartType = this.state.prevChartType;
                this.chartTypeStore.setType(this.state.prevChartType);
            }
        }
    }

    @action.bound updateTableData({ DT, Open, High, Low, Close }) {
        this.isTick = this.mainStore.timeperiod.timeUnit === 'tick';

        const year = DT.getFullYear();
        const month = DT.getMonth() + 1;
        const day = DT.getDate();
        const hours = DT.getHours();
        const minutes = DT.getMinutes();
        const seconds = DT.getSeconds();

        const date = `${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`;
        const time = `${hours > 9 ? hours : `0${hours}`}:${minutes > 9 ? minutes : `0${minutes}`}:${seconds > 9 ? seconds : `0${seconds}`}`;
        const dateTime = `${date} ${time}`;

        const lastTick =  this.tableData.length > 0 ? this.tableData[0] : {};
        const change = Close - lastTick.Close || 0;
        let status = '';
        if (Math.sign(change) !== 0) status = Math.sign(change) === 1 ? 'up' :  'down';

        if (this.isTick && Close) {
            this.tableData.unshift({ Date:dateTime, Close, Change:Math.abs(change).toFixed(this.decimalPlaces), Status: status });
        } else if (!this.isTick && Open && High && Low && Close) {
            if (lastTick.Date === dateTime) {
                lastTick.Close = Close.toFixed(this.decimalPlaces);
                lastTick.Change = Math.abs(Close - this.tableData[1].Close).toFixed(this.decimalPlaces);
            } else {
                this.tableData.unshift(
                    {
                        Date: dateTime,
                        Open: Open.toFixed(this.decimalPlaces),
                        High: High.toFixed(this.decimalPlaces),
                        Low: Low.toFixed(this.decimalPlaces),
                        Close: Close.toFixed(this.decimalPlaces),
                        Change: Math.abs(change).toFixed(this.decimalPlaces),
                        Status: status,
                    },
                );
            }
        }
        this.tableData = this.tableData.slice(0); // force array update
    }
}
