import React from 'react';
import { toJS } from 'mobx';

import { connect } from '../store/Connect';
import LastDigitStats from './LastDigitStats.jsx';

const BottomWidget = ({
    bottomWidgets,
    showLastDigitStats,
    digits,
    lastTick,
}) => {
    const Widget = !bottomWidgets && showLastDigitStats ? LastDigitStats : bottomWidgets;
    if (Widget) {
        return <Widget digits={digits} tick={toJS(lastTick)} />;
    }
    return null;
};

export default connect(({
    state,
    lastDigitStats,
}) => ({
    showLastDigitStats:state.showLastDigitStats,
    digits: lastDigitStats.digits,
    lastTick: lastDigitStats.lastTick,
}))(BottomWidget);
