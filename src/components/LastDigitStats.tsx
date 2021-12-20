import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';
import { TBar } from 'src/types';
import '../../sass/components/_last-digits.scss';

const Bar = ({ x, bar }: { x: number; bar: TBar }) => (
    <div className={`cq-bar ${bar.cName}`} style={{ height: `${bar.height * 5}%`, left: x * 35 }}>
        <div className={`cq-bar-value ${bar.height && 'show'}`}>{`${bar.height.toFixed(1)}%`}</div>
        <span className='cq-bar-title'>{x}</span>
    </div>
);

const LastDigitStats = () => {
    const { lastDigitStats } = useStores();
    const { isVisible, bars, marketDisplayName, shouldMinimiseLastDigits } = lastDigitStats;
    return (
        <div
            className={classNames('cq-last-digits', {
                show: isVisible,
                minimised: shouldMinimiseLastDigits,
            })}
        >
            <div className='cq-bars'>
                {bars.map((bar, idx: number) => (
                    <Bar
                        key={`bar-${idx}`} // eslint-disable-line react/no-array-index-key
                        x={idx}
                        bar={bar}
                    />
                ))}
            </div>
            <div className='cq-bar-footer'>
                {t.translate('Last digits stats for latest 1000 ticks on ') + marketDisplayName}
            </div>
        </div>
    );
};

export default observer(LastDigitStats);
