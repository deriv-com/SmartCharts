// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
import { toJS } from 'mobx';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './LastDigitStats.jsx' was resolved to '/Us... Remove this comment to see the full error message
import LastDigitStats from './LastDigitStats.jsx';

const BottomWidget = ({
    bottomWidgets,
    showLastDigitStats,
    digits,
    lastTick,
}: any) => {
    const Widget = !bottomWidgets && showLastDigitStats ? LastDigitStats : bottomWidgets;
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    return Widget ? <Widget digits={digits} tick={toJS(lastTick)} /> : null;
};

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default connect(({
    state,
    lastDigitStats,
}: any) => ({
    showLastDigitStats: state.showLastDigitStats,
    digits: lastDigitStats.digits,
    lastTick: lastDigitStats.lastTick,
}))(BottomWidget);
