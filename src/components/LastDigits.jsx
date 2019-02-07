import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_last-digits.scss';

const Bar = ({ x, bar }) => (
    <div className={`cq-bar ${bar.cName}`} style={{ height: bar.height, left : (x * 35), '--bar-gradiant': `${bar.gradiantLine}%` }}>
        <span className={`cq-bar-title ${bar.cName}`}>{x}</span>
    </div>
);

class LastDigits extends React.Component {
    componentDidMount() {
        this.props.showLastDigitStats();
    }

    render() {
        const {
            isVisible,
            bars,
            marketDisplayName } = this.props;
        return (
            <div className={`cq-last-digits ${isVisible ? 'show' : ''}`}>
                <div>
                    {bars.map((bar, idx) => (
                        <Bar
                            key={`bar-${idx}`}// eslint-disable-line react/no-array-index-key
                            x={idx}
                            bar={bar}
                        />
                    ))
                    }
                </div>
                <div className="cq-bar-footer">{t.translate('Last digits stats for latest 1000 ticks on ') + marketDisplayName }</div>
            </div>
        );
    }
}

export default connect(({ lastDigits : l }) => ({
    showLastDigitStats:l.showLastDigitStats,
    isVisible:l.isVisible,
    bars:l.bars,
    marketDisplayName:l.marketDisplayName,
}))(LastDigits);
