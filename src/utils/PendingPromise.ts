import { IPendingPromise } from 'src/types';

export default function PendingPromise<T, E>(data: any = null) {
    let resolve: (res: T | PromiseLike<T>) => void;
    let reject: (error: E | PromiseLike<E>) => void;

    const promise: IPendingPromise<T, E> = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    }) as IPendingPromise<T, E>;

    promise.resolve = (res: T | PromiseLike<T>) => {
        promise.isPending = false;
        resolve(res);
    };
    promise.reject = (error: E | PromiseLike<E>) => {
        promise.isPending = false;
        reject(error);
    };
    promise.data = data;
    return promise;
}
