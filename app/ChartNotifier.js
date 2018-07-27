

export default class ChartNotifier {
    messageCallback = null;
    removeByCategoryCallback=null

    notify(message) {
        this.messageCallback(message);
    }

    removeByCategory(category) {
        this.removeByCategoryCallback(category);
    }

    setMessageCallback(callback) {
        this.messageCallback = callback;
    }

    setRemoveByCategoryCallback(callback) {
        this.removeByCategoryCallback = callback;
    }
}
