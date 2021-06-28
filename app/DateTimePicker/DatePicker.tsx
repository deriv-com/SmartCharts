import React from 'react';
import moment from 'moment';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Calendar.jsx' was resolved to '/Users/ba... Remove this comment to see the full error message
import Calendar from './Calendar.jsx';
import './date-picker.scss';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../../src/components/Icons.jsx' was resolv... Remove this comment to see the full error message
import { Wrapper } from '../../src/components/Icons.jsx';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../icons/ic-calendar.svg' or i... Remove this comment to see the full error message
import CalendarIC from '../icons/ic-calendar.svg';
import { usePrevious, useStateCallback } from '../../src/hooks';

const CalendarIcon = Wrapper(CalendarIC);
const DatePickerInput = ({ value, format, id, name, class_name, is_read_only, placeholder, onChange, onClick, mode }: any) => {
    const input_value = format ? moment(value, 'YYYY-MM-DD').format(format) : value;
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    return (<input id={id} name={name} className={class_name} readOnly={is_read_only} placeholder={t.translate(placeholder || (mode === 'duration' ? 'Select a duration' : 'Select date'))} onChange={onChange} onClick={onClick} value={input_value} />);
};
const formatDate = (date: any, date_format = 'YYYY-MM-DD') => moment(date || undefined, date_format).format(date_format);
/**
 * return the number of days from today to date specified
 * @param  {String} date   the date to calculate number of days from today
 * @return {Number} an integer of the number of days
 */
const daysFromTodayTo = (date: any) => {
    const diff = moment(date).utc().diff(moment().utc(), 'days');
    return !date || diff < 0 ? '' : diff + 1;
};
const DatePicker = React.memo(props => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'date_format' does not exist on type '{ c... Remove this comment to see the full error message
    const { date_format, disableFocus, focus, format, is_nativepicker, is_read_only, max_date, min_date, mode, name, onChange, placeholder, start_date, value: props_value } = props;
    const [value, setValue] = useStateCallback(props_value || '');
    const [is_datepicker_visible, setIsDatepickerVisible] = React.useState(focus || false);
    const mainRef = React.useRef();
    const calendarRef = React.useRef();
    const prev_focus = usePrevious(focus);
    const onClickOutside = React.useCallback(e => {
        if (!(mainRef.current as any)?.contains(e.target) && is_datepicker_visible) {
            setIsDatepickerVisible(false);
            if (disableFocus) {
                disableFocus();
            }
        }
    }, [is_datepicker_visible, disableFocus]);
    React.useEffect(() => {
        document.addEventListener('click', onClickOutside, true);
        return () => {
            document.removeEventListener('click', onClickOutside, true);
        };
    }, [onClickOutside]);
    React.useEffect(() => {
        if (focus && focus !== prev_focus && is_datepicker_visible !== focus) {
            setIsDatepickerVisible(!is_datepicker_visible);
        }
    }, [focus, prev_focus, is_datepicker_visible]);
    const handleVisibility = () => {
        setIsDatepickerVisible(!is_datepicker_visible);
    };
    const onSelectCalendar = (selected_date: any, _is_datepicker_visible: any) => {
        let _selected_date = selected_date;
        if (!moment.utc(_selected_date).isValid) {
            _selected_date = '';
        }
        if (mode === 'duration') {
            updateDatePickerValue(daysFromTodayTo(_selected_date), 'duration');
        }
        else {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
            updateDatePickerValue(_selected_date);
        }
        setIsDatepickerVisible(_is_datepicker_visible);
    };
    const onChangeInput = (e: any) => {
        updateDatePickerValue(e.target.value, mode);
    };
    // TODO: handle cases where user inputs date before min_date and date after max_date
    const updateDatePickerValue = (_value: any, _mode: any) => {
        setValue(_value, updateStore);
        // update Calendar
        const new_date = _mode === 'duration' ? moment.utc().add(_value, 'days').format(date_format) : _value;
        if (calendarRef.current && (moment.utc(new_date, date_format).isValid() || !new_date)) {
            if (!new_date) {
                const current_date = moment.utc(start_date).format(date_format);
                // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
                calendarRef.current.setCalendarDate(current_date);
                // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
                calendarRef.current.setSelectedDate(current_date);
            }
            else {
                // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
                calendarRef.current.setCalendarDate(formatDate(new_date));
                // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
                calendarRef.current.setSelectedDate(formatDate(new_date));
            }
        }
    };
    // update MobX store
    const updateStore = (_value: any) => {
        if (typeof onChange === 'function') {
            onChange({ target: { name, value: _value } });
        }
    };
    if (is_nativepicker) {
        return (
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
<div ref={mainRef} className='datepicker-container'>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <input
id={name}
name={name}
className='datepicker-display'
type='date'
value={value}
min={min_date}
max={max_date}
onChange={e => {
                // fix for ios issue: clear button doesn't work
                // https://github.com/facebook/react/issues/8938
                const target = e.nativeEvent.target;
                function iosClearDefault() {
                    (target as any).defaultValue = '';
                }
                window.setTimeout(iosClearDefault, 0);
                // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
                onSelectCalendar(e.target.value);
            }}
                />
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <label className='datepicker-native-overlay' htmlFor={name}>
                    {value || placeholder}
                    IconArrow
                </label>
</div>
);
    }
    return (
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
<div ref={mainRef} className={`datepicker-container ${is_datepicker_visible ? 'active' : ''}`}>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <div className='datepicker-display-wrapper' onClick={handleVisibility}>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <DatePickerInput class_name='datepicker-display' mode={mode} name={name} format={format} placeholder={t.translate(placeholder)} is_read_only value={value} />
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <CalendarIcon className='date-picker-calendar-icon' />
            </div>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <div className={`datepicker-calendar ${is_datepicker_visible ? 'show' : ''}`}>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <Calendar ref={calendarRef} onSelect={onSelectCalendar} {...props}>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <DatePickerInput class_name='calendar-input' mode={mode} name={name} format={format} onChange={onChangeInput} placeholder={t.translate(placeholder)} is_read_only={is_read_only || false} value={value} />
                </Calendar>
            </div>
</div>
);
});
export default DatePicker;
