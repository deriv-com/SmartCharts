import { action } from 'mobx';
import { connect } from './Connect';

export default class ListStore {
    constructor({
        getContext, getItems, onItemSelected,
    }) {
        this.getContext = getContext;
        this.getItems = getItems; // items : [{id: '', text: '', disabled?: false, active?: false}]
        this.onItemSelected = onItemSelected;
    }

    @action.bound onItemClick(idx, item) {
        this.onItemSelected(item);
    }

    connect = connect(() => ({
        items: this.getItems(),
        onItemClick: this.onItemClick,
    }));
}
