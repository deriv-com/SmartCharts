export default class ChartNotifier {
    messageCallback = null;
    removeByCategoryCallback = null;

    notify(message: any) {
        // @ts-expect-error ts-migrate(2721) FIXME: Cannot invoke an object which is possibly 'null'.
        this.messageCallback(message);
    }

    removeByCategory(category: any) {
        // @ts-expect-error ts-migrate(2721) FIXME: Cannot invoke an object which is possibly 'null'.
        this.removeByCategoryCallback(category);
    }

    onMessage(callback: any) {
        this.messageCallback = callback;
    }

    onRemoveByCategory(callback: any) {
        this.removeByCategoryCallback = callback;
    }
}
