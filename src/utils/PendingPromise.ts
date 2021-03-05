interface IPendingPromise<T> extends Promise<T> {
    resolve: (res?: any) => void;
    reject: (error?: any) => void;
    isPending: boolean;
    data: any;
}

export default function PendingPromise(data = null) {
    let resolve: (res?: any) => void;
    let reject: (error?: any) => void;

    const promise: IPendingPromise<any> = new Promise<any>((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    }) as IPendingPromise<any>;

    promise.resolve = (res: any) => {
        promise.isPending = false;
        resolve(res);
    };
    promise.reject = (error: any) => {
        promise.isPending = false;
        reject(error);
    };
    promise.data = data;
    return promise;
}
