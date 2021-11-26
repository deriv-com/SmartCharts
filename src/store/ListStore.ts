import { action } from 'mobx';
import Context from 'src/components/ui/Context';
import { ChartType } from 'src/types';

type TListStoreProps = {
    getContext: () => Context | null;
    getItems: () => ChartType[];
    onItemSelected?: (item: ChartType) => void;
};

type TgetItems = TListStoreProps['getItems'];

export type TListItem = ReturnType<TgetItems>[0];

export default class ListStore {
    getContext: () => Context | null;
    getItems: () => ChartType[];
    onItemSelected?: (item: ChartType) => void;
    constructor({ getContext, getItems, onItemSelected }: TListStoreProps) {
        this.getContext = getContext;
        this.getItems = getItems; // items : [{id: '', text: '', disabled?: false, active?: false}]
        this.onItemSelected = onItemSelected;
    }

    @action.bound onItemClick(_idx: number, item: ChartType) {
        if (this.onItemSelected) this.onItemSelected(item);
    }
}
