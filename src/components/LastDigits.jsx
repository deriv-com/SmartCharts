import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_last-digits.scss';

const Bar = ({ x, bar }) => (
    <div className={`cq-bar ${bar.cName}`} style={{ height: bar.height, left : x * 30  }}>
        <span className={`cq-bar-title ${bar.cName}`}>{x}</span>
    </div>
);

const LastDigits = ({
    bars,
}) => (
    <div className="cq-last-digits">
        {bars.map((bar, idx) => (
            <Bar
                key={`bar-${idx}`}// eslint-disable-line react/no-array-index-key
                x={idx}
                bar={bar}
            />
        ))
        }
        <div className="cq-bar-footer">{t.translate('Last digits stats for latest 1000 ticks on Volatility 100 Index')}</div>
    </div>
);

export default connect(({ lastDigits : l }) => ({
    bars:l.bars,
}))(LastDigits);
