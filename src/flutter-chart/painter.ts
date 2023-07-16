type TPainterCallback = () => void;

export default class Painter {
    callbacks: TPainterCallback[] = [];

    onPaint = () => {
        this.callbacks.forEach(cb => cb());
    };

    registerCallback = (callback: TPainterCallback) => {
        this.callbacks.push(callback);
    };

    unregisterCallback = (callback: TPainterCallback) => {
        const index = this.callbacks.findIndex(item => item === callback);
        this.callbacks.splice(index, 1);
    };
}
