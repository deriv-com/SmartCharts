import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { TickSpotData } from '@deriv/api-types';
import { useStores } from 'src/store';
import LastDigitStats from './LastDigitStats';

type TBottomWidgetProps = {
    bottomWidgets: React.FC<{
        digits: number[];
        tick?: TickSpotData | null;
    }>;
};

const BottomWidget: React.FC<TBottomWidgetProps> = ({ bottomWidgets }) => {
    const { state, lastDigitStats } = useStores();
    const { showLastDigitStats } = state;
    const { digits, lastTick } = lastDigitStats;

    const Widget = !bottomWidgets && showLastDigitStats ? LastDigitStats : bottomWidgets;
    return Widget ? <Widget digits={digits} tick={toJS(lastTick)} /> : null;
};

export default observer(BottomWidget);
