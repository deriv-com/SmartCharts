/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/no-unused-state */
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import React from 'react';
import './time-picker.scss';
import { Wrapper } from '../../src/components/Icons';
import Time from '../icons/ic-time.svg';
import { usePrevious } from '../../src/hooks';

type TimePickerDropdownProps = {
    className: string;
    preClass: string;
    value: string;
    onChange: (value: string) => void;
    toggle: () => void;
    start_date: number;
};

type TTimerPickerProps = {
    start_date: number;
    is_nativepicker?: boolean;
    focus: boolean;
    name: string;
    is_align_right?: boolean;
    padding?: boolean;
    placeholder: string;
    disableFocus: () => void;
    onChange: (value: string) => void;
    value: string;
};

const TimeIcon = Wrapper(Time);
const isSessionAvailable = (
    compare_moment = moment().utc(),
    end_moment = moment().utc(),
    should_only_check_hour = false
) => {
    const offset = new Date().getTimezoneOffset() * 60 * 1000;
    const end_compare = should_only_check_hour ? end_moment.clone().minute(0).second(0) : end_moment;
    const start_compare = end_compare.clone().subtract(1, 'year');
    const end_time = end_compare.valueOf() + offset;
    const start_time = start_compare.valueOf() + offset;
    return end_time - compare_moment.valueOf() > 0 && compare_moment.valueOf() - start_time > 0;
};

const TimePickerDropdown = React.memo(
    ({ className, preClass, value, onChange, toggle, start_date }: TimePickerDropdownProps) => {
        const [is_hour_selected, setIsHourSelected] = React.useState(false);
        const [is_minute_selected, setIsMinuteSelected] = React.useState(false);
        const [last_updated_type, setLastUpdatedType] = React.useState<string | null>(null);
        const [hours] = React.useState([...Array(24).keys()].map(a => `0${a}`.slice(-2)));
        const [minutes] = React.useState([...Array(12).keys()].map(a => `0${a * 5}`.slice(-2)));
        const prevClassName = usePrevious(className);
        React.useEffect(() => {
            if (is_hour_selected && is_minute_selected) {
                resetValues();
                toggle();
            }
            if (!prevClassName && className === 'active') {
                resetValues();
            }
            if (last_updated_type) {
                setLastUpdatedType(null);
            }
        }, [className, is_hour_selected, is_minute_selected, last_updated_type, prevClassName, toggle]);
        const selectOption = (type: string, new_value: string, is_enabled = true) => {
            if (is_enabled) {
                const [prev_hour, prev_minute] = (value || '00:00').split(':');
                const start_moment = moment(start_date * 1000 || undefined);
                const start_moment_clone = start_moment.clone().minute(0).second(0);
                if ((type === 'h' && new_value !== prev_hour) || (type === 'm' && new_value !== prev_minute)) {
                    setLastUpdatedType(type);
                    type === 'h' ? setIsHourSelected(true) : setIsMinuteSelected(true);

                    let selected_time = `${type === 'h' ? new_value : prev_hour}:${
                        type === 'm' ? new_value : prev_minute
                    }`;
                    let desire_time = start_moment_clone
                        .hour(Number(type === 'h' ? new_value : prev_hour))
                        .minute(Number(type === 'm' ? new_value : prev_minute));
                    let last_available_min;
                    if (type === 'h' && !isSessionAvailable(desire_time)) {
                        minutes.forEach(min => {
                            desire_time = start_moment_clone.hour(Number(new_value)).minute(parseInt(min));
                            if (isSessionAvailable(desire_time)) {
                                last_available_min = min;
                            }
                        });
                        if (last_available_min) {
                            selected_time = `${new_value}:${last_available_min}`;
                        }
                    }
                    onChange(selected_time);
                } else {
                    toggle();
                }
            }
        };
        const resetValues = () => {
            setIsHourSelected(false);
            setIsMinuteSelected(false);
        };
        const start_moment = moment(start_date * 1000 || undefined);
        const start_moment_clone = start_moment.clone().minute(0).second(0);
        const end_moment = moment().utc();
        let [hour, minute] = ['00', '00'];
        if (value.match(/^([0-9]|[0-1][0-9]|2[0-3]):([0-9]|[0-5][0-9])(:([0-9]|[0-5][0-9]))?$/)) {
            [hour, minute] = value.split(':');
        }
        return (
            <div className={`${preClass}-dropdown ${className}`}>
                <div className={`${preClass}-selector`}>
                    <div className={`${preClass}-hours`}>
                        <div className='list-title center-text'>
                            <strong>{t.translate('Hour')}</strong>
                        </div>
                        <div className='list-container'>
                            {hours.map((h, key) => {
                                start_moment_clone.hour(parseInt(h));
                                const is_enabled = isSessionAvailable(start_moment_clone, end_moment, true);
                                return (
                                    <div
                                        className={`list-item${hour === h ? ' selected' : ''}${
                                            is_enabled ? '' : ' disabled'
                                        }`}
                                        key={key}
                                        onClick={() => {
                                            selectOption('h', h, is_enabled);
                                        }}
                                    >
                                        {h}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className={`${preClass}-minutes`}>
                        <div className='list-title center-text'>
                            <strong>{t.translate('Minute')}</strong>
                        </div>
                        <div className='list-container'>
                            {minutes.map((mm, key) => {
                                start_moment_clone.hour(parseInt(hour)).minute(parseInt(mm));
                                const is_enabled = isSessionAvailable(start_moment_clone, end_moment);
                                return (
                                    <div
                                        className={`list-item${minute === mm ? ' selected' : ''}${
                                            is_enabled ? '' : ' disabled'
                                        }`}
                                        key={key}
                                        onClick={() => {
                                            selectOption('m', mm, is_enabled);
                                        }}
                                    >
                                        {mm}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);
const TimePicker = (props: TTimerPickerProps) => {
    const {
        disableFocus,
        onChange,
        start_date,
        is_nativepicker,
        focus,
        name,
        is_align_right,
        padding,
        placeholder,
    } = props;
    const [is_open, setIsOpen] = React.useState(false);
    const [value, setValue] = React.useState('00:00');
    const [minutes] = React.useState([...Array(12).keys()].map(a => `0${a * 5}`.slice(-2)));
    const wrapper_ref = React.useRef<HTMLDivElement>(null);
    const prev_value = usePrevious(value);
    const prev_focus = usePrevious(focus);
    const prev_is_open = usePrevious(is_open);
    const handleClickOutside = React.useCallback(
        event => {
            if (wrapper_ref.current && !wrapper_ref.current.contains(event.target)) {
                if (is_open) {
                    setIsOpen(false);
                    if (disableFocus) {
                        disableFocus();
                    }
                }
            }
        },
        [disableFocus, is_open]
    );
    React.useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);
    const toggleDropDown = React.useCallback(() => {
        setIsOpen(!is_open);
    }, [is_open]);
    const handleChange = React.useCallback(
        arg => {
            // To handle nativepicker;
            const new_value = typeof arg === 'object' ? arg.target.value : arg;
            setValue(new_value);
            if (new_value !== props.value && onChange) {
                onChange(new_value);
            }
        },
        [name, onChange, props.value]
    );
    React.useEffect(() => {
        const findAvailabeTime = (start_moment_clone: moment.Moment) => {
            let last_available_min, desire_time;
            const hour = moment().utc().format('HH');
            minutes.forEach(min => {
                desire_time = start_moment_clone.hour(+hour).minute(+min);
                if (isSessionAvailable(desire_time)) {
                    last_available_min = min;
                }
            });
            handleChange(`${hour}:${last_available_min}`);
            setValue(`${hour}:${last_available_min}`);
        };
        if (focus === true && prev_focus !== focus && prev_is_open !== focus) {
            toggleDropDown();
        }
        if (focus) {
            const [prev_hour, prev_minute] = (prev_value || '00:00').split(':');
            const start_moment = moment(start_date * 1000 || undefined);
            const start_moment_clone = start_moment.clone().minute(0).second(0);
            const desire_time = start_moment_clone.hour(parseInt(prev_hour)).minute(parseInt(prev_minute));
            if (!isSessionAvailable(desire_time)) {
                findAvailabeTime(start_moment_clone);
            }
        }
    }, [focus, is_open, minutes, prev_is_open, prev_value, prev_focus, start_date, handleChange, toggleDropDown]);
    const prefix_class = 'time-picker';
    return (
        <div ref={wrapper_ref} className={`${prefix_class}${padding ? ' padding' : ''}${is_open ? ' active' : ''}`}>
            {is_nativepicker ? (
                <input type='time' id={`${prefix_class}-input`} value={value} onChange={handleChange} name={name} />
            ) : (
                <React.Fragment>
                    <span className='time-picker-container' onClick={toggleDropDown}>
                        <input
                            type='text'
                            readOnly
                            id={`${prefix_class}-input`}
                            className={`${prefix_class}-input ${is_open ? 'active' : ''}`}
                            value={value}
                            name={name}
                            placeholder={placeholder}
                        />
                        <TimeIcon className='picker-time-icon' />
                    </span>
                    <TimePickerDropdown
                        className={`${is_open ? 'active' : ''}${is_align_right ? ' from-right' : ''}`}
                        toggle={toggleDropDown}
                        onChange={handleChange}
                        preClass={prefix_class}
                        start_date={start_date}
                        value={value}
                    />
                </React.Fragment>
            )}
        </div>
    );
};
export default observer(TimePicker);
