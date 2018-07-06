import { observable, action } from 'mobx';
import { connect } from './Connect';

export default class ListStore {
    constructor({
        getContext, getItems, onItemSelected,
    }) {
        this.getContext = getContext;
        this.getItems = getItems; // items : [{id: '', text: '', disabled?: false, active?: false}]
        this.onItemSelected = onItemSelected;
    }

    @observable selectedIdx = 0;

    @action.bound onItemClick(idx, item) {
        this.selectedIdx = idx;
        this.onItemSelected(item);
    }

    connect = connect(() => ({
        items: this.getItems(),
        selectedIdx: this.selectedIdx,
        onItemClick: this.onItemClick,
    }));
}
