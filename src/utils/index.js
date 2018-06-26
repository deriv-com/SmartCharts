export function createObjectFromLocalStorage(key) {
    const val = CIQ.localStorage.getItem(key);
    const isValid = val !== null;
    if (isValid) {
        try {
            return JSON.parse(val);
        } catch (e) {
            return undefined;
        }
    }
    return undefined;
}

// load external script; unlike CIQ version, this one caches it to browser
export function loadScript(scriptName, cb) {
    if (!CIQ.loadedScripts) CIQ.loadedScripts = {};
    if (CIQ.loadedScripts[scriptName]) {
        if (cb) cb();
        return;
    }
    const script = document.createElement('SCRIPT');
    script.async = true;
    script.onload = function () {
        CIQ.loadedScripts[scriptName] = true;
        if (cb) cb();
    };
    script.src = scriptName;
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(script, s.nextSibling);
}
