import ReactGA from 'react-ga';

export function initGA() {
    /* @START-EXCLUDE: 'lib' */
    ReactGA.initialize('UA-128254050-1');
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
