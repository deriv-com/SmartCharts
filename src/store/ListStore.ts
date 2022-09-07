import { action, makeObservable } from 'mobx';
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
        makeObservable(this, {
            onItemClick: action.bound
        });

        this.getContext = getContext;
        this.getItems = getItems; // items : [{id: '', text: '', disabled?: false, active?: false}]
        this.onItemSelected = onItemSelected;
    }

    onItemClick(_idx: number, item: ChartType) {
        if (this.onItemSelected) this.onItemSelected(item);
    }
}
