window.doorbellOptions = {
    id: '7933',
    appKey: 'GzOM4TFKsSn8CHPEV1qUWXXibdWwNGopCzvxzXUeU7swiNDflHgDTQ1QcRkDCEiM',
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
        g.rel = 'preconnect';
        g.src = `https://embed.doorbell.io/button/${window.doorbellOptions.id}?t=${new Date().getTime()}`; (d.getElementsByTagName('head')[0] || d.getElementsByTagName('body')[0]).appendChild(g);
    }
    if (w.attachEvent) { w.attachEvent('onload', l); } else if (w.addEventListener) { w.addEventListener('load', l, false); } else { l(); }
    if (d.readyState === 'complete') { l(); }
}(window, document, 'script'));
