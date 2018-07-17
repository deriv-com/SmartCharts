

function ChartNotifier() {
    this.callback = null;
    this.notify = (_action, _data) => {
        if (typeof this.callback === 'function') {
            this.callback({
                action: _action,
                data: _data,
            });
        }
    };
    this.onCallback = (callback) => {
        this.callback = callback;
    };
}
export default ChartNotifier;
