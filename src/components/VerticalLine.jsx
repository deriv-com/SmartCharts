import React from 'react';
import { connect } from '../store/Connect';
import VerticalLineStore from '../store/VerticalLineStore';

const VerticalLine = ({
    className,
    children,
    left,
}) => (
    <div
        style={{ left }}
        className={`chart-line vertical ${className || ''}`}
    >
        <div className="drag-line" />
        {children}
    </div>
);

const TradeStart = ({ left }) => (
    <VerticalLine
        left={left}
        className="trade-start-line"
    >
        <div className="trade-text">Trade Start</div>
    </VerticalLine>
);

const TradeEnd = ({ left }) => (
    <VerticalLine
        left={left}
        className="trade-end-line"
    >
        <div className="trade-text">Trade End</div>
        <div className="trade-end-flag">
            <div className="circle" />
            <div className="ic-flag" />
        </div>
    </VerticalLine>
);

export const TradeStartLine = connect(
    VerticalLineStore,
    store => ({
        left: store.left,
    }),
    (store, { epoch, followsCurrentQuote }) => {
        store.epoch = epoch;
        store.followsCurrentQuote = followsCurrentQuote;
    },
)(TradeStart);

export const TradeEndLine = connect(
    VerticalLineStore,
    store => ({
        left: store.left,
    }),
    (store, { epoch, followsCurrentQuote }) => {
        store.epoch = epoch;
        store.followsCurrentQuote = followsCurrentQuote;
    },
)(TradeEnd);
