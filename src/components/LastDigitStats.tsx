// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
import { connect } from '../store/Connect';
import '../../sass/components/_last-digits.scss';

const Bar = ({
    x,
    bar,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className={`cq-bar ${bar.cName}`} style={{ height: `${bar.height * 5}%`, left: x * 35 }}>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <div className={`cq-bar-value ${bar.height && 'show'}`}>{`${bar.height.toFixed(1)}%`}</div>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <span className='cq-bar-title'>{x}</span>
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);

const LastDigitStats = ({
    isVisible,
    bars,
    marketDisplayName,
    shouldMinimiseLastDigits,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div
        className={classNames('cq-last-digits', {
            show: isVisible,
            minimised: shouldMinimiseLastDigits,
        })}
    >
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <div className='cq-bars'>
            {bars.map((bar: any, idx: any) => (
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Bar
                    key={`bar-${idx}`} // eslint-disable-line react/no-array-index-key
                    x={idx}
                    bar={bar}
                />
            ))}
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <div className='cq-bar-footer'>
            {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
            {t.translate('Last digits stats for latest 1000 ticks on ') + marketDisplayName}
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default connect(({ lastDigitStats: l }) => ({
    isVisible: l.isVisible,
    bars: l.bars,
    marketDisplayName: l.marketDisplayName,
    changeSymbol: l.changeSymbol,
    shouldMinimiseLastDigits: l.shouldMinimiseLastDigits,
}))(LastDigitStats);
