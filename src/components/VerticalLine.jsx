import {connect} from '../store/Connect';
import VerticalLineStore from '../store/VerticalLineStore';
import RenderInsideChart from '../components/RenderInsideChart.jsx';

const VerticalLine = ({
    className,
    children,
    left
}) => (
    <div
        style={{left: left}}
        className={`chart-line vertical ${className || ''}`}
    >
        <div className="drag-line"></div>
        {children}
    </div>
);

const TradeStart = ({ left }) => (
    <VerticalLine
        left={left}
        className='trade-end-line'
    >
        <div className="trade-text">Trade Start</div>
    </VerticalLine>
);

const TradeEnd = ({ left }) => (
    <VerticalLine
        left={left}
        className='trade-end-line'
    >
        <div className="trade-text">Trade End</div>
        <div className="trade-end-flag">
            <div className="circle"></div>
            <div className="ic-flag"></div>
        </div>
    </VerticalLine>
);

export const TradeStartLine = connect(
    VerticalLineStore,
    (store) => ({
        left: store.left
    }),
    (store, {epoch, followsCurrentQuote}) => {
        store.epoch = epoch;
        store.followsCurrentQuote = followsCurrentQuote;
    }
)(TradeStart);

export const TradeEndLine = connect(
    VerticalLineStore,
    (store) => ({
        left: store.left
    }),
    (store, {epoch, followsCurrentQuote}) => {
        store.epoch = epoch;
        store.followsCurrentQuote = followsCurrentQuote;
    }
)(TradeEnd);
