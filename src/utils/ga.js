/* @START-EXCLUDE: 'lib' */
import ReactGA from 'react-ga';
/* @END-EXCLUDE */

export function initGA() {
    /* @START-EXCLUDE: 'lib' */
    if (!window.isProductionWebsite()) return;
    ReactGA.initialize('UA-40877026-15');
    /* @END-EXCLUDE */
}

export function logPageView() {
    /* @START-EXCLUDE: 'lib' */
    if (!window.isProductionWebsite()) return;
    ReactGA.set({ page : window.location.pathname });
    ReactGA.pageview(window.location.pathname);
    /* @END-EXCLUDE */
}

export function logEvent(category, action, label) {
    /* @START-EXCLUDE: 'lib' */
    if (!window.isProductionWebsite()) return;
    ReactGA.event({
        category,
        action,
        label,
    });
    /* @END-EXCLUDE */
}
