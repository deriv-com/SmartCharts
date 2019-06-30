import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_last-digits.scss';

const Bar = ({ x, bar }) => (
    <div
        className={`cq-bar ${bar.cName}`}
        style={{ height: `${bar.height * 5}%`, left : (x * 35) }}
    >
        <div className={`cq-bar-value ${bar.height && 'show'}`}>{`${bar.height.toFixed(1)}%`}</div>
        <span className="cq-bar-title">{x}</span>
    </div>
);

class LastDigitStats extends React.Component {
    componentDidMount() {
        this.props.showLastDigitStats();
    }

    componentDidUpdate({ marketDisplayName }) {
        if (this.props.marketDisplayName !== marketDisplayName) {
            this.props.changeSymbol();
        }
    }

    componentWillUnmount() {
        this.props.showLastDigitStats();
    }

    render() {
        const {
            isVisible,
            bars,
            marketDisplayName,
            shouldMinimiseLastDigits } = this.props;
        return (
            <div className={`cq-last-digits ${isVisible ? 'show' : ''} ${shouldMinimiseLastDigits ? 'minimised' : ''}`}>
                <div className="cq-bars">
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

export default connect(({ lastDigitStats : l }) => ({
    showLastDigitStats:l.showLastDigitStats,
    isVisible:l.isVisible,
    bars:l.bars,
    marketDisplayName:l.marketDisplayName,
    changeSymbol: l.changeSymbol,
    shouldMinimiseLastDigits: l.shouldMinimiseLastDigits,
}))(LastDigitStats);
