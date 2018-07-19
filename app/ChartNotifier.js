

export default class ChartNotifier {
    messageCallback = null;
    removeByCategoryCallback=null

    notify(_action, _data) {
        if (_action === 'message') {
            this.messageCallback(_data);
        } else if (_action === 'removeByCategory') {
            this.removeByCategoryCallback(_data);
        }
    }

    message(callback) {
        this.messageCallback = callback;
    }

    removeByCategory(callback) {
        this.removeByCategoryCallback = callback;
    }
}
