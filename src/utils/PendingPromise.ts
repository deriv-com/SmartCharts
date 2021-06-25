import { IPendingPromise } from 'src/types';

export default function PendingPromise<T>(data = null) {
    let resolve: (res: T) => void;
    let reject: (error: any) => void;

    const promise: IPendingPromise<T> = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    }) as IPendingPromise<T>;

    promise.resolve = (res: T) => {
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
