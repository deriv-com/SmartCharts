import { observable } from 'mobx';

export default class FavoriteSessionStore {
    @observable favoritesChangeTrigger = false;
}
