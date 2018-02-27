import { observable, action, computed, when } from 'mobx';
import { getTimeUnit } from './utils';
import KeystrokeHub from '../components/ui/KeystrokeHub';

export default class ListStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, () => this.onContextReady());
    }

    get context() { return this.mainStore.chart.context; }

    @observable open = false;

    onContextReady = () => {
        KeystrokeHub.instance.addClaim(this);
    }

    @action.bound destroy() {
        KeystrokeHub.instance.removeClaim(this);
    }

    keyStroke(hub, key, e) {
        let node = this.root;

        return;
        if (!this.props.isOpen) {return false;}
        if (['up', 'down', 'enter', 32].indexOf(key) === -1) {return false;}
        return false;

        // TODO: once code base is fully ported to react, remove querying 'cq-item'
        let items = node[0].querySelectorAll('cq-item');
        let focused = node[0].querySelectorAll('cq-item[cq-focused]');

        if (items.length === 0) {
            items = node[0].querySelectorAll('.ciq-row');
            focused = node[0].querySelectorAll('.ciq-row[cq-focused]');
        }

        if (key === 32 || key === 'enter') {
            if (focused.length && focused[0].selectFC) {
                // TODO: review whether code here is needed once code base is fully ported to react
                focused[0].selectFC.call(focused, e);
                return true;
            } else if (focused.length) {
                focused[0].click();
            }
            return false;
        }

        if (!focused.length) {
            items[0].setAttribute('cq-focused', 'true');
            this.scrollToElement(items[0]);
            return true;
        }

        items.forEach(item => item.removeAttribute('cq-focused'));

        // locate our location in the list of items
        let i;
        for (i = 0; i < items.length; i++) {
            if (items[i] === focused[0]) {break;}
        }

        if (key === 'up') {
            i--;
            if (i < 0) {i = 0;}
        }

        if (key === 'down') {
            i++;
            if (i >= items.length) {i = items.length - 1;}
        }

        items[i].setAttribute('cq-focused', 'true');
        this.scrollToElement(items[i]);
        return true;
    }
}
