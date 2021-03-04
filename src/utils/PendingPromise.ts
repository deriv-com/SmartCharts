export default function PendingPromise(data = null) {
    let resolve: any;
    let reject: any;
    const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    (promise as any).resolve = (res: any) => {
        (promise as any).isPending = false;
        resolve(res);
    };
    (promise as any).reject = (error: any) => {
        (promise as any).isPending = false;
        reject(error);
    };
    (promise as any).data = data;
    return promise;
}
