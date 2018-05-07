import React from 'react';
import { connect } from '../store/Connect';
import Menu from './Menu.jsx';

const Timeperiod = ({
    setPeriodicity,
    interval,
    timeUnit,
    interval_display,
    timeUnit_display,
    Menu,
}) => {
    return (
        <Menu
            className="ciq-period">
            <Menu.Title>
                <div className="bt-priod">
                    <span className="ic-priod">
                        <span className="interval_display">{interval_display}</span>
                        <span className="unit_display">{timeUnit_display}</span>
                    </span>
                    <br/>
                    <span className='ic-subtitle'>{t.translate("Interval")}</span>
                </div>
            </Menu.Title>
            <Menu.Body>
                <div className="timeUnit">
                    <span className={timeUnit === 'tick' ? 'selected' : ''}>{t.translate('Tick')}</span>
                    <span className={timeUnit === 'minute' ? 'selected' : ''}>{t.translate('Minute')}</span>
                    <span className={timeUnit === 'hour' ? 'selected' : ''}>{t.translate('Hour')}</span>
                    <span className={timeUnit === 'day' ? 'selected' : ''}>{t.translate('Day')}</span>
                </div>
                <div className="interval">
                    <div className="row">
                        <span
                            onClick={() => setPeriodicity(1, 'second')}
                            className={timeUnit === 'tick' && interval === 1 ? 'selected' : ''}
                        >1
                        </span>
                    </div>
                    <div className="row">
                        <span
                            onClick={() => setPeriodicity(1, 'minute')}
                            className={timeUnit === 'minute' && interval === 1 ? 'selected' : ''}
                        >1
                        </span>
                        <span
                            onClick={() => setPeriodicity(2, 'minute')}
                            className={interval === 2 ? 'selected' : ''}
                        >2
                        </span>
                        <span
                            onClick={() => setPeriodicity(3, 'minute')}
                            className={interval === 3 ? 'selected' : ''}
                        >3
                        </span>
                        <span
                            onClick={() => setPeriodicity(5, 'minute')}
                            className={interval === 5 ? 'selected' : ''}
                        >5
                        </span>
                        <span
                            onClick={() => setPeriodicity(10, 'minute')}
                            className={interval === 10 ? 'selected' : ''}
                        >10
                        </span>
                        <span
                            onClick={() => setPeriodicity(15, 'minute')}
                            className={interval === 15 ? 'selected' : ''}
                        >15
                        </span>
                        <span
                            onClick={() => setPeriodicity(30, 'minute')}
                            className={interval === 30 ? 'selected' : ''}
                        >30
                        </span>
                    </div>
                    <div className="row">
                        <span
                            onClick={() => setPeriodicity(60, 'minute')}
                            className={interval === 60 ? 'selected' : ''}
                        >1
                        </span>
                        <span
                            onClick={() => setPeriodicity(120, 'minute')}
                            className={interval === 120 ? 'selected' : ''}
                        >2
                        </span>
                        <span
                            onClick={() => setPeriodicity(240, 'minute')}
                            className={interval === 240 ? 'selected' : ''}
                        >4
                        </span>
                        <span
                            onClick={() => setPeriodicity(480, 'minute')}
                            className={interval === 480 ? 'selected' : ''}
                        >8
                        </span>
                    </div>
                    <div className="row">
                        <span
                            onClick={() => setPeriodicity(1, 'day')}
                            className={timeUnit === 'day' ? 'selected' : ''}
                        >1
                        </span>
                    </div>
                </div>
            </Menu.Body>
        </Menu>
    );
};

export default connect(
    ({ timeperiod: s }) => ({
        setPeriodicity: s.setPeriodicity,
        timeUnit: s.timeUnit,
        interval: s.interval,
        interval_display: s.interval_display,
        timeUnit_display: s.timeUnit_display,
        Menu: s.menu.connect(Menu),
    })
)(Timeperiod);
