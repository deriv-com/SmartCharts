import {observable, action} from 'mobx';

export default class LoaderStore {
    @observable isActive = false;

    @action.bound show () {
        this.isActive = true;
    }

    @action.bound hide () {
        this.isActive = false;
    }
}
