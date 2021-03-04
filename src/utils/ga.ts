export const LogCategories = Object.freeze({
    ChartTitle: 'Chart Title',
    CategoricalDisplay: 'Categorical Display',
    ChartControl: 'Chart Control',
});
export const LogActions = Object.freeze({
    MarketSelector: 'Market Selector',
    Favorite: 'Favorite',
    ChartSetting: 'Chart Setting',
    ChartSize: 'Chart Size',
    ChartType: 'Chart Type',
    Comparison: 'Comparison',
    DrawTools: 'Draw Tools',
    Download: 'Download',
    Indicator: 'Indicator',
    Interval: 'Interval',
    Template: 'Template',
});
/* eslint-disable */
export function initGA() {
    /* @START-EXCLUDE: 'lib' */
    if (!(window as any).isProductionWebsite)
        return;
    (function (i, s, o, g, r, a, m) {
        (i as any).GoogleAnalyticsObject = r;
        // @ts-expect-error ts-migrate(7015) FIXME: Element implicitly has an 'any' type because index... Remove this comment to see the full error message
        (i[r] =
            // @ts-expect-error ts-migrate(7015) FIXME: Element implicitly has an 'any' type because index... Remove this comment to see the full error message
            i[r] ||
                function () {
                    // @ts-expect-error ts-migrate(7015) FIXME: Element implicitly has an 'any' type because index... Remove this comment to see the full error message
                    (i[r].q = i[r].q || []).push(arguments);
                }),
            // @ts-expect-error ts-migrate(7015) FIXME: Element implicitly has an 'any' type because index... Remove this comment to see the full error message
            (i[r].l = 1 * new Date());
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'HTMLElement' is not assignable to type 'unde... Remove this comment to see the full error message
        (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
        // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
        a.async = 1;
        // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
        a.src = g;
        // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
        m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ga'.
    ga('create', 'UA-40877026-15', 'auto');
    /* @END-EXCLUDE */
}
export function logPageView() {
    /* @START-EXCLUDE: 'lib' */
    if (!(window as any).isProductionWebsite || !(window as any).ga)
        return;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ga'.
    ga('send', 'pageview', window.location.pathname);
    /* @END-EXCLUDE */
}
export function logEvent(category: any, action: any, label: any) {
    /* @START-EXCLUDE: 'lib' */
    if (!(window as any).isProductionWebsite || !(window as any).ga)
        return;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ga'.
    ga('send', 'event', category, action, label);
    /* @END-EXCLUDE */
}
