

export default class ChartNotifier {
    messageCallback = null;
    removeByCategoryCallback = null;

    notify(message) {
        this.messageCallback(message);
    }

    removeByCategory(category) {
        this.removeByCategoryCallback(category);
    }

    onMessage(callback) {
        this.messageCallback = callback;
    }

    onRemoveByCategory(callback) {
        this.removeByCategoryCallback = callback;
    }
}
