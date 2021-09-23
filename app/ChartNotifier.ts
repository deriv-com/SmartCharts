export default class ChartNotifier {
    messageCallback: any = null;
    removeByCategoryCallback: any = null;

    notify(message: any) {
        this.messageCallback(message);
    }

    removeByCategory(category: any) {
        this.removeByCategoryCallback(category);
    }

    onMessage(callback: any) {
        this.messageCallback = callback;
    }

    onRemoveByCategory(callback: any) {
        this.removeByCategoryCallback = callback;
    }
}
