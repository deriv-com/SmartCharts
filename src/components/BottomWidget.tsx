import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { TickSpotData } from '@deriv/api-types';
import { useStores } from 'src/store';
import LastDigitStats from './LastDigitStats';

type TBottomWidgetProps = {
    bottomWidgets?: (props: { digits: number[]; tick?: TickSpotData | null }) => React.ReactElement;
};

const BottomWidget = ({ bottomWidgets }: TBottomWidgetProps) => {
    const { state, lastDigitStats } = useStores();
    const { showLastDigitStats } = state;
    const { digits, lastTick } = lastDigitStats;

    const Widget = !bottomWidgets && showLastDigitStats ? LastDigitStats : bottomWidgets;
    return Widget ? <Widget digits={digits} tick={toJS(lastTick)} /> : null;
};

export default observer(BottomWidget);
