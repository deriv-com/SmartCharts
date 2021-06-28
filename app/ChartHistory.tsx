import React from 'react';
import moment from 'moment';
// @ts-expect-error ts-migrate(6142) FIXME: Module './DateTimePicker/DatePicker.jsx' was resol... Remove this comment to see the full error message
import DatePicker from './DateTimePicker/DatePicker.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './DateTimePicker/TimePicker.jsx' was resol... Remove this comment to see the full error message
import TimePicker from './DateTimePicker/TimePicker.jsx';
import './chart-history.scss';

// @ts-expect-error ts-migrate(2339) FIXME: Property 'onChange' does not exist on type '{ chil... Remove this comment to see the full error message
const ChartHistory = React.memo(({ onChange }) => {
    const [date, setDate] = React.useState(moment().format('YYYY/MM/DD'));
    const [focusOnDate, setFocusOnDate] = React.useState(false);
    const [focusOnTime, setFocusOnTime] = React.useState(false);
    const [time, setTime] = React.useState('00:00');

    React.useEffect(() => {
        setFocusOnDate(true);
    }, []);

    const onChangeDate = ({
        target,
    }: any) => {
        const new_date = target.value;
        setDate(new_date);
        setFocusOnDate(false);
        setFocusOnTime(true);
        updateStore(new_date, time);
    };

    const onChangeTime = ({
        target,
    }: any) => {
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

    const updateStore = (new_date: any, new_time: any) => {
        onChange(`${new_date} ${new_time}`);
    };

    return (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className='ciq-chart-history'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <strong>{t.translate('Historical Data')}:</strong>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <DatePicker
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
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
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
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
