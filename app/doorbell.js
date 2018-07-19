window.doorbellOptions = {
    id: '7933',
    appKey: 'GzOM4TFKsSn8CHPEV1qUWXXibdWwNGopCzvxzXUeU7swiNDflHgDTQ1QcRkDCEiM',
    onSubmit() {
        const text = document.getElementById('doorbell-feedback').value;
        const email = document.getElementById('doorbell-email').value;
        const alert = document.getElementById('doorbell-success');
        const regx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let err;
        if (!text) {
            err = 'Your message is required';
        } else if (text.length < 10) {
            err = 'Your message is too short';
        } else if (!email) {
            err = 'Your email address is required';
        } else if (!regx.test(String(email).toLowerCase())) {
            err = 'Invalid email address';
        }
        if (err && err.length > 0) {
            alert.innerHTML = err;
            alert.className = 'doorbell-error';
            return false;
        }
        alert.className = 'alert alert-success';
    },
    onError() {
        console.clear();
    },
};

(function (w, d, t) {
    let hasLoaded = false;
    function l() {
        if (hasLoaded) { return; }
        hasLoaded = true;
        window.doorbellOptions.windowLoaded = true;
        const g = d.createElement(t);
        g.id = 'doorbellScript';
        g.type = 'text/javascript';
        g.async = true;
        g.src = `https://embed.doorbell.io/button/${window.doorbellOptions.id}?t=${new Date().getTime()}`; (d.getElementsByTagName('head')[0] || d.getElementsByTagName('body')[0]).appendChild(g);
    }
    if (w.attachEvent) { w.attachEvent('onload', l); } else if (w.addEventListener) { w.addEventListener('load', l, false); } else { l(); }
    if (d.readyState === 'complete') { l(); }
}(window, document, 'script'));
