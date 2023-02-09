import React from 'react';
import moment from 'moment';
import DatePicker from './DateTimePicker/DatePicker';
import TimePicker from './DateTimePicker/TimePicker';
import './chart-history.scss';

type TChartHistoryProps = {
    onChange: (date: string) => void;
};

const ChartHistory = React.memo(({ onChange }: TChartHistoryProps) => {
    const [date, setDate] = React.useState(moment().format('YYYY/MM/DD'));
    const [focusOnDate, setFocusOnDate] = React.useState(false);
    const [focusOnTime, setFocusOnTime] = React.useState(false);
    const [time, setTime] = React.useState('00:00');

    React.useEffect(() => {
        setFocusOnDate(true);
    }, []);

    const onChangeDate = (value: string) => {
        const new_date = value;
        setDate(new_date);
        setFocusOnDate(false);
        setFocusOnTime(true);
        updateStore(new_date, time);
    };

    const onChangeTime = (value: string) => {
        const new_time = value;
        setTime(new_time);
        setFocusOnDate(false);
        setFocusOnTime(false);
        updateStore(date, new_time);
    };

    const onDisableFocus = () => {
        setFocusOnDate(false);
        setFocusOnTime(false);
    };

    const updateStore = (new_date: string, new_time: string) => {
        onChange(`${new_date} ${new_time}`);
    };

    return (
        <div className='ciq-chart-history'>
            <div className='ciq-chart-history__container'>
                <strong>{t.translate('Historical data')}</strong>
                <DatePicker
                    placeholder={t.translate('select date')}
                    name='date'
                    format='DD MMMM YYYY'
                    focus={focusOnDate}
                    disableFocus={onDisableFocus}
                    has_today_btn
                    value={date}
                    onChange={onChangeDate}
                    min_date={moment.utc().subtract(1, 'years').toDate().toString()}
                    max_date={moment.utc().toDate().toString()}
                    display_format='DD MMM YYYY'
                />
                <TimePicker
                    placeholder='time'
                    name='time'
                    focus={focusOnTime}
                    disableFocus={onDisableFocus}
                    start_date={moment(date, 'YYYY/MM/DD').valueOf() / 1000}
                    value={time}
                    onChange={onChangeTime}
                />
            </div>
        </div>
    );
});

export default ChartHistory;
