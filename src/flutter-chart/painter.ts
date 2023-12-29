type TPainterCallback = (currentTickPercent: number) => void;

export default class Painter {
    callbacks: TPainterCallback[] = [];

    onPaint = (currentTickPercent: number) => {
        this.callbacks.forEach(cb => cb(currentTickPercent));
    };

    registerCallback = (callback: TPainterCallback) => {
        this.callbacks.push(callback);
    };

    unregisterCallback = (callback: TPainterCallback) => {
        const index = this.callbacks.findIndex(item => item === callback);
        this.callbacks.splice(index, 1);
    };
}
