import ReactGA from 'react-ga';

export function initGA() {
    /* @if NODE_ENV='production' */
    ReactGA.initialize('UA-128254050-1');
    /* @endif */
}

export function logPageView() {
    /* @if NODE_ENV='production' */
    ReactGA.set({ page : window.location.pathname });
    ReactGA.pageview(window.location.pathname);
    /* @endif */
}

export function logEvent(category, action, label) {
    /* @if NODE_ENV='production' */
    ReactGA.event({
        category,
        action,
        label,
    });
    /* @endif */
}
