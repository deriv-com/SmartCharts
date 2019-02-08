import React from 'react';
import moment from 'moment';
import Calendar from './Calendar.jsx';
import './date-picker.scss';
import { Wrapper } from '../../src/components/Icons.jsx';
import CalendarIC from '../icons/ic-calendar.svg';

const CalendarIcon = Wrapper(CalendarIC);
const  DatePickerInput = ({ value, format, id, name, class_name, is_read_only, placeholder, onChange, onClick, mode }) => {
    const input_value = format ? moment(value, 'YYYY-MM-DD').format(format) : value;
    return (
        <input
            id={id}
            name={name}
            className={class_name}
            readOnly={is_read_only}
            placeholder={t.translate(placeholder
                || (mode === 'duration' ? 'Select a duration' : 'Select date'))}
            onChange={onChange}
            onClick={onClick}
            value={input_value}
        />
    );
};
const formatDate = (date, date_format = 'YYYY-MM-DD') => moment(date || undefined, date_format).format(date_format);

/**
 * return the number of days from today to date specified
 * @param  {String} date   the date to calculate number of days from today
 * @return {Number} an integer of the number of days
 */
const daysFromTodayTo = (date) => {
    const diff = moment(date).utc().diff(moment().utc(), 'days');
    return (!date || diff < 0) ? '' : diff + 1;
};

export default class DatePicker extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value                : props.value || '',
            is_datepicker_visible: props.focus || false,
        };
    }

    componentDidMount() {
        document.addEventListener('click', this.onClickOutside, true);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.focus === true
            && prevProps.focus !== this.props.focus
            && prevState.is_datepicker_visible !== this.props.focus) {
            this.handleVisibility();
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onClickOutside, true);
    }

    handleVisibility = () => {
        const is_datepicker_visible = this.state.is_datepicker_visible;
        this.setState({ is_datepicker_visible: !is_datepicker_visible });
    }

    onClickOutside = (e) => {
        if (!this.mainNode.contains(e.target) && this.state.is_datepicker_visible) {
            this.setState({ is_datepicker_visible: false });
            if (this.props.disableFocus) {
                this.props.disableFocus();
            }
        }
    }

    onSelectCalendar = (selected_date, is_datepicker_visible) => {
        let value = selected_date;
        if (!moment.utc(value).isValid) { value = ''; }

        if (this.props.mode === 'duration') {
            this.updateDatePickerValue(daysFromTodayTo(value), 'duration');
        } else {
            this.updateDatePickerValue(value);
        }
        this.setState({ is_datepicker_visible });
    }

    onChangeInput = (e) => {
        const value = e.target.value;
        this.updateDatePickerValue(value, this.props.mode);
    }

    clearDatePickerInput = () => {
        this.setState({ value: '' }, this.updateStore);
        this.calendar.resetCalendar();
    };

    // TODO: handle cases where user inputs date before min_date and date after max_date
    updateDatePickerValue = (value, mode) => {
        this.setState({ value }, this.updateStore);

        // update Calendar
        const { date_format, start_date } = this.props;
        const new_date = (mode === 'duration') ? moment.utc().add(value, 'days').format(date_format) : value;
        if (this.calendar && (moment.utc(new_date, date_format).isValid() || !new_date)) {
            if (!new_date) {
                const current_date = moment.utc(start_date).format(date_format);
                this.calendar.setState({
                    calendar_date: current_date,
                    selected_date: current_date,
                });
            } else {
                this.calendar.setState({
                    calendar_date: formatDate(new_date),
                    selected_date: formatDate(new_date),
                });
            }
        }
    }

    // update MobX store
    updateStore = () => {
        const { name, onChange } = this.props;
        if (onChange) {
            onChange({ target: { name, value: this.state.value } });
        }
    };

    render() {
        if (this.props.is_nativepicker) {
            return (
                <div ref={(node) => { this.mainNode = node; }} className="datepicker-container">
                    <input
                        id={this.props.name}
                        name={this.props.name}
                        className="datepicker-display"
                        type="date"
                        value={this.state.value}
                        min={this.props.min_date}
                        max={this.props.max_date}
                        onChange={(e) => {
                            // fix for ios issue: clear button doesn't work
                            // https://github.com/facebook/react/issues/8938
                            const target = e.nativeEvent.target;
                            function iosClearDefault() { target.defaultValue = ''; }
                            window.setTimeout(iosClearDefault, 0);
                            this.onSelectCalendar(e.target.value);
                        }}
                    />
                    <label className="datepicker-native-overlay" htmlFor={this.props.name}>
                        {this.state.value || this.props.placeholder}
                        IconArrow
                    </label>
                </div>
            );
        }

        return (
            <div
                ref={(node) => { this.mainNode = node; }}
                className={`datepicker-container ${this.state.is_datepicker_visible ? 'active' : ''}`}
            >
                <div
                    className="datepicker-display-wrapper"
                    onClick={this.handleVisibility}
                >
                    <DatePickerInput
                        class_name="datepicker-display"
                        mode={this.props.mode}
                        name={this.props.name}
                        format={this.props.format}
                        placeholder={t.translate(this.props.placeholder)}
                        is_read_only
                        value={this.state.value}
                    />
                    <CalendarIcon className="date-picker-calendar-icon" />
                </div>
                <div
                    className={`datepicker-calendar ${this.state.is_datepicker_visible ? 'show' : ''}`}
                >
                    <Calendar
                        ref={(node) => { this.calendar = node; }}
                        onSelect={this.onSelectCalendar}
                        {...this.props}
                    >
                        <DatePickerInput
                            class_name="calendar-input"
                            mode={this.props.mode}
                            name={this.props.name}
                            format={this.props.format}
                            onChange={this.onChangeInput}
                            placeholder={t.translate(this.props.placeholder)}
                            is_read_only={'is_read_only' in this.props ? this.props.is_read_only : false}
                            value={this.state.value}
                        />
                    </Calendar>
                </div>
            </div>
        );
    }
}
