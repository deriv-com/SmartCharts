import { action } from 'mobx';
import Context from 'src/components/ui/Context';
import { ChartType } from 'src/types';

type TListStoreProps = {
    getContext: () => Context;
    getItems: () => ChartType[];
    onItemSelected: (item: ChartType) => void;
}

export default class ListStore {
    getContext: () => Context;
    getItems: () => ChartType[];
    onItemSelected: (item: ChartType) => void;
    constructor({ getContext, getItems, onItemSelected }: TListStoreProps) {
        this.getContext = getContext;
        this.getItems = getItems; // items : [{id: '', text: '', disabled?: false, active?: false}]
        this.onItemSelected = onItemSelected;
    }

    @action.bound onItemClick(idx: number, item: ChartType) {
        this.onItemSelected(item);
    }
}
