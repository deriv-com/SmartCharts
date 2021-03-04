import { action } from 'mobx';
import { connect } from './Connect';

export default class ListStore {
    getContext: any;
    getItems: any;
    onItemSelected: any;
    constructor({
        getContext,
        getItems,
        onItemSelected,
    }: any) {
        this.getContext = getContext;
        this.getItems = getItems; // items : [{id: '', text: '', disabled?: false, active?: false}]
        this.onItemSelected = onItemSelected;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound onItemClick(idx: any, item: any) {
        this.onItemSelected(item);
    }

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    connect = connect(() => ({
        items: this.getItems(),
        onItemClick: this.onItemClick,
    }));
}
