import { observable, action, computed, reaction, autorunAsync } from 'mobx';
import { connect } from './Connect';
import KeystrokeHub from '../components/ui/KeystrokeHub';

export default class ListStore {
    constructor({ getIsOpen, getContext, getItems, onItemSelected }) {
        this.getIsOpen = getIsOpen;
        this.getContext = getContext;
        this.getItems = getItems; // items : [{id: '', text: '', disabled?: false, active?: false}]
        this.onItemSelected = onItemSelected;

        reaction(() => this.getIsOpen(), this.claimKeyboard);
    }

    itemRefs = [];
    @observable selectedIdx = 0;

    claimKeyboard = () => {
        const kh = KeystrokeHub.instance;
        if(kh) {
            const isOpen = this.getIsOpen();

            if(isOpen) { kh.addClaim(this); }
            else { kh.removeClaim(this); }
        }
    };

    @action.bound onItemClick(idx, item) {
        this.selectedIdx = idx;
        this.onItemSelected(item);
    }

    onRootRef = (root) => {
        this.root = root;
        root.addEventListener(CIQ.wheelEvent, (e) => {
            e.stopPropagation();
        });
    };
    onItemRef = (idx, ref) => this.itemRefs[idx] = ref;

    scrollToElement(item) {
        const root = this.root;
        let bottom = root.clientHeight;
        let scrolled = root.scrollTop;

        let itemBottom = item.offsetTop + item.clientHeight;
        if(item.offsetTop > scrolled && itemBottom < bottom + scrolled) { return; }
        root.scrollTop = Math.max(itemBottom - bottom, 0);
    }

    keyStroke(hub, key, e) {
        if (['up', 'down', 'enter', 32].indexOf(key) === -1) {
            return false;
        }
        if (key === 32 || key === 'enter') {
            const item = this.getItems()[this.selectedIdx];
            if(!item.disabled) {
                this.onItemSelected(item);
            }
        }

        if (key === 'up') {
            this.selectedIdx = Math.max(this.selectedIdx - 1, 0);
        }

        if (key === 'down') {
            this.selectedIdx = Math.min(this.selectedIdx + 1, this.getItems().length - 1);
        }

        this.scrollToElement(this.itemRefs[this.selectedIdx]);

        return true;
    }

    connect = connect(() => ({
        items: this.getItems(),
        selectedIdx: this.selectedIdx,
        onItemClick: this.onItemClick,
        onItemRef: this.onItemRef,
        onRootRef: this.onRootRef,
    }));
}
