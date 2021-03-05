import React from 'react';
import { toJS } from 'mobx';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './LastDigitStats' was resolved to '/Us... Remove this comment to see the full error message
import LastDigitStats from './LastDigitStats';

const BottomWidget = ({ bottomWidgets, showLastDigitStats, digits, lastTick }: any) => {
    const Widget = !bottomWidgets && showLastDigitStats ? LastDigitStats : bottomWidgets;
    return Widget ? <Widget digits={digits} tick={toJS(lastTick)} /> : null;
};

export default connect(({ state, lastDigitStats }: any) => ({
    showLastDigitStats: state.showLastDigitStats,
    digits: lastDigitStats.digits,
    lastTick: lastDigitStats.lastTick,
}))(BottomWidget);
