import ReactGA from 'react-ga';

export function initGA() {
    /* @if BUILD_MODE='lib' */
    ReactGA.initialize('UA-128254050-1');
    /* @endif */
}

export function logPageView() {
    /* @if BUILD_MODE='lib' */
    ReactGA.set({ page : window.location.pathname });
    ReactGA.pageview(window.location.pathname);
    /* @endif */
}

export function logEvent(category, action, label) {
    /* @if BUILD_MODE='lib' */
    ReactGA.event({
        category,
        action,
        label,
    });
    /* @endif */
}
