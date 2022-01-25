import React from 'react';
import moment from 'moment';
import Calendar, { TCalendarRefProps } from './Calendar';
import './date-picker.scss';
import { Wrapper } from '../../src/components/Icons';
import CalendarIC from '../icons/ic-calendar.svg';
import { usePrevious, useStateCallback } from '../../src/hooks';

type TDatePickerInputProps = {
    value: string;
    format: string;
    id?: string;
    name: string;
    class_name: string;
    is_read_only: boolean;
    placeholder: string;
    onChange?: React.ChangeEventHandler;
    onClick?: React.MouseEventHandler;
    mode?: string;
    display_format: string;
};

type TDatePickerProps = {
    date_format?: string;
    disableFocus: () => void;
    focus: boolean;
    format: string;
    max_date: string;
    min_date: string;
    name: string;
    placeholder: string;
    value: string;
    has_today_btn: boolean;
    onChange?: (value: string) => void;
    start_date?: number;
    is_nativepicker?: boolean;
    is_read_only?: boolean;
    mode?: string;
    display_format: string;
};

const CalendarIcon = Wrapper(CalendarIC);
const DatePickerInput = ({
    value,
    format,
    id,
    name,
    class_name,
    is_read_only,
    placeholder,
    onChange,
    onClick,
    mode,
    display_format,
}: TDatePickerInputProps) => {
    const input_value = format ? moment(value, 'YYYY-MM-DD').format(display_format) : value;
    return (
        <input
            id={id}
            name={name}
            className={class_name}
            readOnly={is_read_only}
            placeholder={t.translate(placeholder || (mode === 'duration' ? 'Select a duration' : 'Select date'))}
            onChange={onChange}
            onClick={onClick}
            value={input_value}
        />
    );
};
const formatDate = (date: string, date_format = 'YYYY-MM-DD') =>
    moment(date || undefined, date_format).format(date_format);
/**
 * return the number of days from today to date specified
 * @param  {String} date   the date to calculate number of days from today
 * @return {Number} an integer of the number of days
 */
const daysFromTodayTo = (date: string): string => {
    const diff = moment(date).utc().diff(moment().utc(), 'days');
    return !date || diff < 0 ? '' : (diff + 1).toString();
};
const DatePicker = React.memo((props: TDatePickerProps) => {
    const {
        date_format,
        disableFocus,
        focus,
        format,
        is_nativepicker,
        max_date,
        min_date,
        mode,
        name,
        onChange,
        placeholder,
        start_date,
        value: props_value,
        display_format,
        has_today_btn,
    } = props;
    const [value, setValue] = useStateCallback<string>(props_value || '');
    const [is_datepicker_visible, setIsDatepickerVisible] = React.useState(focus || false);
    const mainRef = React.useRef<HTMLDivElement>(null);
    const calendarRef = React.useRef<TCalendarRefProps>(null);
    const prev_focus = usePrevious(focus);
    const onClickOutside = React.useCallback(
        e => {
            if (!mainRef.current?.contains(e.target) && is_datepicker_visible) {
                setIsDatepickerVisible(false);
                if (disableFocus) {
                    disableFocus();
                }
            }
        },
        [is_datepicker_visible, disableFocus]
    );
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
    const onSelectCalendar = (selected_date: string, _is_datepicker_visible = false) => {
        let _selected_date = selected_date;
        if (!moment.utc(_selected_date).isValid) {
            _selected_date = '';
        }
        if (mode === 'duration') {
            updateDatePickerValue(daysFromTodayTo(_selected_date), 'duration');
        } else {
            updateDatePickerValue(_selected_date);
        }
        setIsDatepickerVisible(_is_datepicker_visible);
    };
    // TODO: handle cases where user inputs date before min_date and date after max_date
    const updateDatePickerValue = (_value: string, _mode?: string) => {
        setValue(_value, updateStore);
        // update Calendar
        const new_date = _mode === 'duration' ? moment.utc().add(_value, 'days').format(date_format) : _value;
        if (calendarRef.current && (moment.utc(new_date, date_format).isValid() || !new_date)) {
            if (!new_date) {
                const current_date = moment.utc(start_date).format(date_format);
                calendarRef.current.setCalendarDate(current_date);
                calendarRef.current.setSelectedDate(current_date);
            } else {
                calendarRef.current.setCalendarDate(formatDate(new_date));
                calendarRef.current.setSelectedDate(formatDate(new_date));
            }
        }
    };
    // update MobX store
    const updateStore = (_value: string) => {
        if (typeof onChange === 'function') {
            onChange(_value);
        }
    };
    if (is_nativepicker) {
        return (
            <div ref={mainRef} className='datepicker-container'>
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
                            (target as HTMLInputElement).defaultValue = '';
                        }
                        window.setTimeout(iosClearDefault, 0);
                        onSelectCalendar(e.target.value);
                    }}
                />
                <label className='datepicker-native-overlay' htmlFor={name}>
                    {value || placeholder}
                    IconArrow
                </label>
            </div>
        );
    }
    return (
        <div ref={mainRef} className={`datepicker-container ${is_datepicker_visible ? 'active' : ''}`}>
            <div className='datepicker-display-wrapper' onClick={handleVisibility}>
                <DatePickerInput
                    class_name='datepicker-display'
                    mode={mode}
                    name={name}
                    format={format}
                    placeholder={t.translate(placeholder)}
                    is_read_only
                    value={value}
                    display_format={display_format} />
                <CalendarIcon className='date-picker-calendar-icon' />
            </div>
            <div className={`datepicker-calendar ${is_datepicker_visible ? 'show' : ''}`}>
                <Calendar
                    ref={calendarRef}
                    onSelect={onSelectCalendar}
                    max_date={max_date}
                    min_date={min_date}
                    date_format={date_format}
                    has_today_btn={has_today_btn}
                    start_date={start_date}
                >
                </Calendar>
            </div>
        </div>
    );
});
export default DatePicker;
