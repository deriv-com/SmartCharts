// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
import { connect } from '../store/Connect';
import BarrierStore from '../store/BarrierStore';

const Barrier = React.memo(
    ({
        shadeColor = '#39b19d',
        color = '#39b19d',
        foregroundColor = '#ffffff',
        HighPriceLine,
        LowPriceLine,
        AboveShade,
        BetweenShade,
        BelowShade,
        hidePriceLines,
        lineStyle,
        isInitialized,
        priceLabelWidth,
        isSingleBarrier,
        ...props
    }: any) =>
        isInitialized && (
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div
                className={classNames('barrier', { 'hide-pricelines': hidePriceLines })}
                style={{ '--shade-color': shadeColor }}
            >
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <HighPriceLine
                    width={priceLabelWidth}
                    lineStyle={lineStyle}
                    color={color}
                    foregroundColor={foregroundColor}
                    {...props}
                />
                {!isSingleBarrier && (
                    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <LowPriceLine
                            width={priceLabelWidth}
                            lineStyle={lineStyle}
                            color={color}
                            foregroundColor={foregroundColor}
                            {...props}
                        />
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <AboveShade />
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <BetweenShade />
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <BelowShade />
                    </>
                )}
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        )
);

export default connect(
    (store: any) => ({
        HighPriceLine: store.HighPriceLine,
        LowPriceLine: store.LowPriceLine,
        AboveShade: store.AboveShade,
        BetweenShade: store.BetweenShade,
        BelowShade: store.BelowShade,
        shadeColor: store.shadeColor,
        color: store.color,
        foregroundColor: store.foregroundColor,
        hideBarrierLine: store.hideBarrierLine,
        hideOffscreenBarrier: store.hideOffscreenBarrier,
        hideOffscreenLine: store.hideOffscreenLine,
        hidePriceLines: store.hidePriceLines,
        lineStyle: store.lineStyle,
        isInitialized: store.isInitialized,
        destructor: store.destructor,
        priceLabelWidth: store.priceLabelWidth,
        title: store.title,
        isSingleBarrier: store.isSingleBarrier,
        opacityOnOverlap: store.opacityOnOverlap,
    }),
    BarrierStore
)(Barrier);
