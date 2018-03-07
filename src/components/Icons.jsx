import React from 'react';
import '../../sass/components/_icons.scss';
import Add from '../../sass/icons/add/ic-add-light.svg';
import Candle from '../../sass/icons/chart types/ic-candle.svg';
import Comparison from '../../sass/icons/chart-controls/ic-comparison-normal-light.svg';
import Crosshair from '../../sass/icons/chart-controls/ic-crosshair-normal.svg';
import Delete from '../../sass/icons/drawing tools/ic-drawingtools-clear-all.svg';
import Dot from '../../sass/icons/chart types/ic-dot.svg';
import Draw from '../../sass/icons/drawing tools/ic-drawingtools-normal-light.svg';
import HollowCandle from '../../sass/icons/chart types/ic-hollow-candle.svg';
import Indicator from '../../sass/icons/chart-controls/ic-indicator-normal-light.svg';
import Line from '../../sass/icons/chart types/ic-line.svg';
import Measure from '../../sass/icons/drawing tools/ic-drawingtools-measure.svg';
import Minus from '../../sass/icons/minus/ic-minus-light.svg';
import OHLC from '../../sass/icons/chart types/ic-ohlc.svg';
import Spline from '../../sass/icons/chart types/ic-spline.svg';
import Template from '../../sass/icons/chart template/ic-charttemplate-normal-light.svg';

const Wrapper = WrappedComponent => props => {
    const propsCopy = Object.assign({}, props);
    propsCopy.className = `ic-icon ${propsCopy.className ? propsCopy.className : ''} ${propsCopy['tooltip-title'] ? 'tooltip' : ''}`;

    return (
        <span {...propsCopy}>
            <WrappedComponent />
        </span>
    );
};

export const AddIcon = Wrapper(Add);
export const CandleIcon = Wrapper(Candle);
export const ComparisonIcon = Wrapper(Comparison);
export const CrosshairIcon = Wrapper(Crosshair);
export const DeleteIcon= Wrapper(Delete);
export const DotIcon = Wrapper(Dot);
export const DrawIcon = Wrapper(Draw);
export const HollowCandleIcon = Wrapper(HollowCandle);
export const IndicatorIcon = Wrapper(Indicator);
export const LineIcon = Wrapper(Line);
export const MeasureIcon = Wrapper(Measure);
export const MinusIcon = Wrapper(Minus);
export const OHLCIcon = Wrapper(OHLC);
export const SplineIcon = Wrapper(Spline);
export const TemplateIcon = Wrapper(Template);
