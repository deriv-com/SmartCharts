// requestAnimationFrame gets added to the microtasks queue,
// so it gets proccessed just before the browser is about to repaint.
//
// requestAnimationFrame's callback are really indented to be small tasks (<2ms),
// but our chart animation callback takes at least 8ms to render.
//
// here we are intentionally droping chart animation frames,
// to give the browser enough cpu time to render user interaction tasks/frames.

(function () {
    let lastTime = 0;
    window.requestAnimationFrame = function (callback) {
        const currTime = new Date().getTime();
        const timeToCall = Math.max(0, 16 - (currTime - lastTime));
        const id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

    window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };
})();
