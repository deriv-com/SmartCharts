import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_last-digits.scss';

const Bar = ({ x, y }) => (
    <div className="cq-bar" style={{ height: y, left : x * 30  }}>
        <span className="cq-bar-title">{x}</span>
    </div>
);

const LastDigits = ({
    heights,
}) => (
    <div className="cq-last-digits">
        {heights.map((y, idx) => (
            <Bar
                key={`bar-${idx}`}// eslint-disable-line react/no-array-index-key
                x={idx}
                y={y}
            />
        ))
        }
        <div className="cq-bar-footer">{t.translate('Last digits stats for latest 1000 ticks on Volatility 100 Index')}</div>
    </div>
);

export default connect(({ lastDigits : l }) => ({
    heights:l.heights,
}))(LastDigits);
