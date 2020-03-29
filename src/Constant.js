
import {
    DrawToolsChannelIcon,
    DrawToolsContinuousIcon,
    DrawToolsFibonaccifanIcon,
    DrawToolsHorizontalIcon,
    DrawToolsLineIcon,
    DrawToolsRayIcon,
    DrawToolsRectangleIcon,
    DrawToolsTrendIcon,
    DrawToolsVerticalIcon,
} from './components/Icons.jsx';

export const drawTools = {
    channel:    { id: 'channel',     text: t.translate('Channel'), icon: DrawToolsChannelIcon },
    segment:    { id: 'continuous',  text: t.translate('Continuous'), icon: DrawToolsContinuousIcon },
    fibfan:     { id: 'fibfan',      text: t.translate('Fib Fan'), icon: DrawToolsFibonaccifanIcon },
    horizontal: { id: 'horizontal',  text: t.translate('Horizontal'), icon: DrawToolsHorizontalIcon },
    line:       { id: 'line',        text: t.translate('Line'), icon: DrawToolsLineIcon },
    ray:        { id: 'ray',         text: t.translate('Ray'), icon: DrawToolsRayIcon },
    rectangle:  { id: 'rectangle',   text: t.translate('Rectangle'), icon: DrawToolsRectangleIcon },
    tirone:     { id: 'tirone',      text: t.translate('Trend'), icon: DrawToolsTrendIcon },
    vertical:   { id: 'vertical',    text: t.translate('Vertical'), icon: DrawToolsVerticalIcon },
};
