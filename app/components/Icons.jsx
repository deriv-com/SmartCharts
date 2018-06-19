import React from 'react';
import '../sass/components/_icons.scss';

import Close from '../sass/icons/close/ic-close.svg';
import Edit from '../sass/icons/edit/ic-edit.svg';
import PositionLeft from '../sass/icons/chart settings/setting/ic-position-left.svg';
import PositionBottom from '../sass/icons/chart settings/setting/ic-position-bottom.svg';
import Back from '../sass/icons/back/ic-back.svg';

import JPY from '../sass/icons/flags/jpy.svg';
import PLN from '../sass/icons/flags/pln.svg';
import USD from '../sass/icons/flags/usd.svg';

import Portugal from '../sass/icons/flags/portugal.svg';
import Russia from '../sass/icons/flags/russia.svg';
import Thailand from '../sass/icons/flags/thailand.svg';
import Indonesia from '../sass/icons/flags/indonesia.svg';
import Vietnam from '../sass/icons/flags/vietnam.svg';
import Italy from '../sass/icons/flags/italy.svg';
import Chinese from '../sass/icons/flags/chinese.svg';
import ChineseTraditional from '../sass/icons/flags/chinese-traditional.svg';
import German from '../sass/icons/flags/german.svg';
import French from '../sass/icons/flags/french.svg';
import Dutch from '../sass/icons/flags/dutch.svg';
import Spanish from '../sass/icons/flags/spanish.svg';


const Wrapper = WrappedComponent => (props) => {
    let { className, 'tooltip-title': tooltip, ...p } = props; 
    className = `ic-icon ${className || ''}`;

    return (
        <span
            className={className}
            tooltip-title={tooltip}
            {...p}
        >
            <WrappedComponent />
            <br />
            <span className="ic-subtitle">{tooltip}</span>
        </span>
    );
};

export const CloseIcon = Wrapper(Close);
export const SettingIcon = Wrapper(Edit);
export const PositionLeftIcon = Wrapper(PositionLeft);
export const PositionBottomIcon = Wrapper(PositionBottom);
export const BackIcon = Wrapper(Back);

export const FlagIcons = {
    USD: Wrapper(USD),
    German: Wrapper(German),
    French: Wrapper(French),
    Portugal: Wrapper(Portugal),
    Russia: Wrapper(Russia),
    Thailand: Wrapper(Thailand),
    Indonesia: Wrapper(Indonesia),
    Vietnam: Wrapper(Vietnam),
    Italy: Wrapper(Italy),
    Chinese: Wrapper(Chinese),
    ChineseTraditional: Wrapper(ChineseTraditional),
    Japan: Wrapper(JPY),
    Poland: Wrapper(PLN),
};

