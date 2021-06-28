import React from 'react';
import moment from 'moment';
import DatePicker from './DateTimePicker/DatePicker.jsx';
import TimePicker from './DateTimePicker/TimePicker.jsx';
import './chart-history.scss';

const ChartHistory = React.memo(({ onChange }) => {
    const [date, setDate] = React.useState(moment().format('YYYY/MM/DD'));
    const [focusOnDate, setFocusOnDate] = React.useState(false);
    const [focusOnTime, setFocusOnTime] = React.useState(false);
    const [time, setTime] = React.useState('00:00');

    React.useEffect(() => {
        setFocusOnDate(true);
    }, []);

    const onChangeDate = ({ target }) => {
        const new_date = target.value;
        setDate(new_date);
        setFocusOnDate(false);
        setFocusOnTime(true);
        updateStore(new_date, time);
    };

    const onChangeTime = ({ target }) => {
        const new_time = target.value;
        setTime(new_time);
        setFocusOnDate(false);
        setFocusOnTime(false);
        updateStore(date, new_time);
    };

    const onDisableFocus = () => {
        setFocusOnDate(false);
        setFocusOnTime(false);
    };

    const updateStore = (new_date, new_time) => {
        onChange(`${new_date} ${new_time}`);
    };

    return (
        <div className='ciq-chart-history'>
            <strong>{t.translate('Historical Data')}:</strong>
            <DatePicker
                placeholder={t.translate('select date')}
                name='date'
                format='DD MMMM YYYY'
                focus={focusOnDate}
                disableFocus={onDisableFocus}
                has_today_btn
                value={date}
                onChange={onChangeDate}
                min_date={moment.utc().subtract(1, 'years').toDate()}
                max_date={moment.utc().toDate()}
            />
            <TimePicker
                placeholder='time'
                name='time'
                focus={focusOnTime}
                disableFocus={onDisableFocus}
                is_clearable
                start_date={moment(date, 'YYYY/MM/DD').valueOf() / 1000}
                value={time}
                onChange={onChangeTime}
            />
        </div>
    );
});

export default ChartHistory;
