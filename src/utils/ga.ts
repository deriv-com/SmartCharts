// @ts-nocheck
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
    if (!window.isProductionWebsite) return;
    (function (i: any, s, o, g, r, a, m) {
        (i as any).GoogleAnalyticsObject = r;
        (i[r] =
            i[r] ||
            function () {
                (i[r].q = i[r].q || []).push(arguments);
            }),
            (i[r].l = 1 * new Date());
        (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    ga('create', 'UA-40877026-15', 'auto');
    /* @END-EXCLUDE */
}
export function logPageView() {
    /* @START-EXCLUDE: 'lib' */
    if (!window.isProductionWebsite || !(window as any).ga) return;
    ga('send', 'pageview', window.location.pathname);
    /* @END-EXCLUDE */
}
export function logEvent(category: any, action: any, label: any) {
    /* @START-EXCLUDE: 'lib' */
    if (!window.isProductionWebsite || !(window as any).ga) return;
    ga('send', 'event', category, action, label);
    /* @END-EXCLUDE */
}
