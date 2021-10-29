import { action } from 'mobx';

export default class ListStore {
    getContext: any;
    getItems: any;
    onItemSelected: any;
    constructor({ getContext, getItems, onItemSelected }: any) {
        this.getContext = getContext;
        this.getItems = getItems; // items : [{id: '', text: '', disabled?: false, active?: false}]
        this.onItemSelected = onItemSelected;
    }

    @action.bound onItemClick(idx: any, item: any) {
        this.onItemSelected(item);
    }
}
