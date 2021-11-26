export type TNotification = {
    text: string;
    type?: 'info' | 'warning' | 'success' | 'error' | 'warning';
    category: string;
};

export type TMessageCallback = (message: TNotification) => void;
export type TRemoveByCategoryCallback = (category: string) => void;
export default class ChartNotifier {
    messageCallback: TMessageCallback | null = null;
    removeByCategoryCallback: TRemoveByCategoryCallback | null = null;

    notify(message: TNotification) {
        this.messageCallback?.(message);
    }

    removeByCategory(category: string) {
        this.removeByCategoryCallback?.(category);
    }

    onMessage(callback: TMessageCallback) {
        this.messageCallback = callback;
    }

    onRemoveByCategory(callback: TRemoveByCategoryCallback) {
        this.removeByCategoryCallback = callback;
    }
}
