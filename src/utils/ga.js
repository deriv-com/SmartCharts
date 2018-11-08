/* @START-EXCLUDE: 'lib' */
import ReactGA from 'react-ga';
/* @END-EXCLUDE */

export function initGA() {
    /* @START-EXCLUDE: 'lib' */
    ReactGA.initialize('UA-40877026-15');
    /* @END-EXCLUDE */
}

export function logPageView() {
    /* @START-EXCLUDE: 'lib' */
    ReactGA.set({ page : window.location.pathname });
    ReactGA.pageview(window.location.pathname);
    /* @END-EXCLUDE */
}

export function logEvent(category, action, label) {
    /* @START-EXCLUDE: 'lib' */
    ReactGA.event({
        category,
        action,
        label,
    });
    /* @END-EXCLUDE */
}
