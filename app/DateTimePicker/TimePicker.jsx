/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/no-unused-state */
import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import './time-picker.scss';
import { Wrapper } from '../../src/components/Icons.jsx';
import Time from '../icons/ic-time.svg';


const TimeIcon = Wrapper(Time);
const isSessionAvailable = (
    compare_moment          = moment().utc(),
    end_moment              = moment().utc(),
    should_only_check_hour  = false,
) => {
    const offset = (new Date()).getTimezoneOffset() * 60 * 1000;
    const end_compare = should_only_check_hour
        ? end_moment.clone().minute(0).second(0) : end_moment;
    const start_compare = end_compare.clone().subtract(1, 'year');

    const end_time = end_compare.valueOf() + offset;
    const start_time = start_compare.valueOf() + offset;

    return (
        (end_time - compare_moment.valueOf() > 0)
        && (compare_moment.valueOf() - start_time > 0)
    );
};

class TimePickerDropdown extends React.PureComponent {
    constructor(props) {
        super(props);
        this.hours    = [...Array(24).keys()].map(a => `0${a}`.slice(-2));
        this.minutes  = [...Array(12).keys()].map(a => `0${a * 5}`.slice(-2));
        this.state    = {
            is_hour_selected  : false,
            is_minute_selected: false,
            last_updated_type : null,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        const { is_hour_selected, is_minute_selected } = this.state;
        if (is_hour_selected && is_minute_selected) {
            this.resetValues();
            this.props.toggle();
        }
        if (!prevProps.className && this.props.className === 'active') {
            this.resetValues();
        }
        if (prevState.last_updated_type !== this.state.last_updated_type && this.state.last_updated_type) {
            this.setState({ last_updated_type: null });
        }
    }

    selectOption = (type, value, is_enabled = true) => {
        if (is_enabled) {
            const [prev_hour, prev_minute] = (this.props.value || '00:00').split(':');
            const start_moment          = moment(this.props.start_date * 1000 || undefined);
            const start_moment_clone    = start_moment.clone().minute(0).second(0);

            if (
                (type === 'h' && value !== prev_hour)
                || (type === 'm' && value !== prev_minute)
            ) {
                const is_type_selected = type === 'h' ? 'is_hour_selected' : 'is_minute_selected';
                this.setState({
                    last_updated_type : type,
                    [is_type_selected]: true,
                });
                let selected_time = `${type === 'h' ? value : prev_hour}:${type === 'm' ? value : prev_minute}`;
                let desire_time = start_moment_clone.hour(type === 'h' ? value : prev_hour).minute(type === 'm' ? value : prev_minute);
                let last_available_min;

                if (type === 'h' && !isSessionAvailable(desire_time)) {
                    this.minutes.forEach((min) => {
                        desire_time = start_moment_clone.hour(value).minute(min);
                        if (isSessionAvailable(desire_time)) {
                            last_available_min = min;
                        }
                    });
                    if (last_available_min) {
                        selected_time = `${value}:${last_available_min}`;
                    }
                }

                this.props.onChange(selected_time);
            } else {
                this.props.toggle();
            }
        }
    };

    clear = (event) => {
        event.stopPropagation();
        this.resetValues();
        this.props.onChange('');
    };

    resetValues() {
        this.setState({
            is_hour_selected  : false,
            is_minute_selected: false,
        });
    }

    render() {
        const { preClass, value, toggle, start_date } = this.props;
        const start_moment       = moment(start_date * 1000 || undefined);
        const start_moment_clone = start_moment.clone().minute(0).second(0);
        const end_moment = moment().utc();
        let [hour, minute] = ['00', '00'];

        if (value.match(/^([0-9]|[0-1][0-9]|2[0-3]):([0-9]|[0-5][0-9])(:([0-9]|[0-5][0-9]))?$/)) {
            [hour, minute] = value.split(':');
        }

        return (
            <div className={`${preClass}-dropdown ${this.props.className}`}>
                <div
                    className={`${preClass}-panel`}
                    onClick={toggle}
                >
                    <span className={value ? '' : 'placeholder'}>{t.translate(value || 'Select time')}</span>
                </div>
                <div className={`${preClass}-selector`}>
                    <div className={`${preClass}-hours`}>
                        <div className="list-title center-text"><strong>{t.translate('Hour')}</strong></div>
                        <div className="list-container">
                            {this.hours.map((h, key) => {
                                start_moment_clone.hour(h);
                                const is_enabled = isSessionAvailable(start_moment_clone, end_moment, true);
                                return (
                                    <div
                                        className={`list-item${hour === h ? ' selected' : ''}${is_enabled ? '' : ' disabled'}`}
                                        key={key}
                                        onClick={() => { this.selectOption('h', h, is_enabled); }}
                                    >
                                        {h}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className={`${preClass}-minutes`}>
                        <div className="list-title center-text"><strong>{t.translate('Minute')}</strong></div>
                        <div className="list-container">
                            {this.minutes.map((mm, key) => {
                                start_moment_clone.hour(hour).minute(mm);
                                const is_enabled = isSessionAvailable(start_moment_clone, end_moment);

                                return (
                                    <div
                                        className={`list-item${minute === mm ? ' selected' : ''}${is_enabled ? '' : ' disabled'}`}
                                        key={key}
                                        onClick={() => { this.selectOption('m', mm, is_enabled); }}
                                    >{mm}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class TimePicker extends React.PureComponent {
    constructor(props) {
        super(props);
        this.minutes  = [...Array(12).keys()].map(a => `0${a * 5}`.slice(-2));
        this.state = {
            is_open: false,
            value : props.value || '00:00',
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.focus === true
            && prevProps.focus !== this.props.focus
            && prevState.is_open !== this.props.focus) {
            this.toggleDropDown();
        }

        if (this.props.focus) {
            const [prev_hour, prev_minute] = (prevState.value || '00:00').split(':');
            const start_moment          = moment(this.props.start_date * 1000 || undefined);
            const start_moment_clone    = start_moment.clone().minute(0).second(0);
            const desire_time             = start_moment_clone.hour(prev_hour).minute(prev_minute);
            if (!isSessionAvailable(desire_time)) {
                this.findAvailabeTime(start_moment_clone);
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    findAvailabeTime = (start_moment_clone) => {
        let last_available_min,
            desire_time;
        const hour = moment().utc().format('HH');
        this.minutes.forEach((min) => {
            desire_time = start_moment_clone.hour(hour).minute(min);
            if (isSessionAvailable(desire_time)) {
                last_available_min = min;
            }
        });
        this.handleChange(`${hour}:${last_available_min}`);

        this.setState({
            value: `${hour}:${last_available_min}`,
        });
    }

    toggleDropDown = () => {
        const is_open = this.state.is_open;
        this.setState({ is_open: !is_open });
    };

    handleChange = (arg) => {
        // To handle nativepicker;
        const value = typeof arg === 'object' ? arg.target.value : arg;

        this.setState({ value });
        if (value !== this.props.value && this.props.onChange) {
            this.props.onChange({ target: { name: this.props.name, value } });
        }
    };

    saveRef = (node) => {
        if (!node) return;
        if (node.nodeName === 'INPUT') {
            this.target_element = node;
            return;
        }
        this.wrapper_ref = node;
    };

    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target)) {
            if (this.state.is_open) {
                this.setState({ is_open: false });
                if (this.props.disableFocus) {
                    this.props.disableFocus();
                }
            }
        }
    };

    render() {
        const prefix_class = 'time-picker';
        const {
            is_nativepicker,
            name,
            is_align_right,
            placeholder,
            start_date,
            sessions,
        } = this.props;
        const { value } = this.state;
        return (
            <div
                ref={this.saveRef}
                className={`${prefix_class}${this.props.padding ? ' padding' : ''}${this.state.is_open ? ' active' : ''}`}
            >
                {
                    is_nativepicker
                        ? (
                            <input
                                type="time"
                                id={`${prefix_class}-input`}
                                value={value}
                                onChange={this.handleChange}
                                name={name}
                            />
                        )
                        : (
                            <React.Fragment>
                                <span
                                    onClick={this.toggleDropDown}
                                >
                                    <input
                                        ref={this.saveRef}
                                        type="text"
                                        readOnly
                                        id={`${prefix_class}-input`}
                                        className={`${prefix_class}-input ${this.state.is_open ? 'active' : ''}`}
                                        value={this.state.value}
                                        name={name}
                                        placeholder={placeholder}
                                    />
                                    <TimeIcon className="picker-time-icon" />
                                </span>
                                <TimePickerDropdown
                                    className={`${this.state.is_open ? 'active' : ''}${is_align_right ? ' from-right' : ''}`}
                                    toggle={this.toggleDropDown}
                                    onChange={this.handleChange}
                                    preClass={prefix_class}
                                    start_date={start_date}
                                    value={value}
                                    sessions={sessions}
                                    is_clearable={this.props.is_clearable}
                                />
                            </React.Fragment>
                        )
                }
            </div>
        );
    }
}

export default observer(TimePicker);
