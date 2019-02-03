import moment         from 'moment';
import React          from 'react';
import {
    CalendarDays,
    CalendarMonths,
    CalendarYears,
    CalendarDecades } from './panels/index';

function CalendarButton({ children, className, is_hidden, label, onClick }) {
    return (
        <React.Fragment>
            { !is_hidden
                && (
                    <span
                        type="button"
                        className={className}
                        onClick={onClick}
                    >
                        {label}
                        {children}
                    </span>
                )
            }
        </React.Fragment>
    );
}

function CalendarPanel(props) {
    const calendar_panel = {
        date  : <CalendarDays    {...props} />,
        month : <CalendarMonths  {...props} />,
        year  : <CalendarYears   {...props} />,
        decade: <CalendarDecades {...props} />,
    };

    return (
        <div className="calendar-panel">
            { calendar_panel[props.calendar_view] }
        </div>
    );
}

function CalendarFooter({ footer, has_today_btn, onClick }) {
    return (
        <div className="calendar-footer">
            { footer && <span className="calendar-footer-extra">{footer}</span> }
            { has_today_btn
                && (
                    <CalendarButton className="calendar-footer-btn">
                        <span onClick={onClick}>{t.translate('Today')}</span>
                    </CalendarButton>
                )
            }
        </div>
    );
}

function CalendarHeader({ calendar_date, isPeriodDisabled, onClick, onSelect, calendar_view }) {
    const is_date_view   = calendar_view === 'date';
    const is_month_view  = calendar_view === 'month';
    const is_year_view   = calendar_view === 'year';
    const is_decade_view = calendar_view === 'decade';
    const moment_date    = moment.utc(calendar_date);
    const onPreviousYearClick = () => {
        if (is_date_view || is_month_view) onClick.previousYear();

        if (is_year_view) onClick.previousDecade();

        if (is_decade_view) onClick.previousCentury();
    };
    const onNextYearClick = () => {
        if (is_date_view || is_month_view) onClick.nextYear();

        if (is_year_view) onClick.nextDecade();

        if (is_decade_view) onClick.nextCentury();
    };
    const onSelectYearClick = () => {
        if (is_date_view || is_month_view) {
            onSelect.year();
        } else {
            onSelect.decade();
        }
    };

    return (
        <div className="calendar-header">
            <CalendarButton
                className={`calendar-prev-year-btn ${isPeriodDisabled(moment_date.clone().subtract(1, 'month'), 'month') ? 'hidden' : ''}`}
                onClick={onPreviousYearClick}
            />
            <CalendarButton
                className={`calendar-prev-month-btn ${isPeriodDisabled(moment_date.clone().subtract(1, 'month'), 'month') ? 'hidden' : ''}`}
                is_hidden={!is_date_view}
                onClick={onClick.previousMonth}
            />

            <div className="calendar-select">
                { is_date_view
                    && (
                        <CalendarButton
                            className="calendar-select-month-btn"
                            is_hidden={!is_date_view}
                            label={moment_date.format('MMM')}
                            onClick={onSelect.month}
                        />
                    )
                }
                <CalendarButton
                    className="calendar-select-year-btn"
                    onClick={onSelectYearClick}
                >
                    { (is_date_view || is_month_view) && moment_date.year() }
                    { is_year_view   && `${moment_date.clone().subtract(1, 'years').year()}-${moment_date.clone().add(10, 'years').year()}`  }
                    { is_decade_view && `${moment_date.clone().subtract(10, 'years').year()}-${moment_date.clone().add(109, 'years').year()}` }
                </CalendarButton>
            </div>

            <CalendarButton
                className={`calendar-next-month-btn ${isPeriodDisabled(moment_date.clone().add(1, 'month'), 'month') ? 'hidden' : ''}`}
                is_hidden={!is_date_view}
                onClick={onClick.nextMonth}
            />
            <CalendarButton
                className={`calendar-next-year-btn ${isPeriodDisabled(moment_date.clone().add(1, 'month'), 'month') ? 'hidden' : ''}`}
                onClick={onNextYearClick}
            />
        </div>
    );
}

class Calendar extends React.PureComponent {
    // navigates to next or previous's month/year/decade/century
    navigators = {
        nextMonth      : () => { this.navigateTo(1,   'months', true); },
        previousMonth  : () => { this.navigateTo(1,   'months', false); },
        nextYear       : () => { this.navigateTo(1,   'years',  true); },
        previousYear   : () => { this.navigateTo(1,   'years',  false); },
        nextDecade     : () => { this.navigateTo(10,  'years',  true); },
        previousDecade : () => { this.navigateTo(10,  'years',  false); },
        nextCentury    : () => { this.navigateTo(100, 'years',  true); },
        previousCentury: () => { this.navigateTo(100, 'years',  false); },
    };

    // selects a day, a month, a year, or a decade
    panelSelectors = {
        date  : (e, is_disabled) => { this.updateSelectedDate(e, is_disabled); },
        month : (e) => { this.updateSelected(e, 'month'); },
        year  : (e) => { this.updateSelected(e, 'year'); },
        decade: (e) => { this.updateSelected(e, 'decade'); },
    };

    // sets Calendar active view
    calendarViews = {
        date  : () => { this.setState({ calendar_view: 'date'   }); },
        month : () => { this.setState({ calendar_view: 'month'  }); },
        year  : () => { this.setState({ calendar_view: 'year'   }); },
        decade: () => { this.setState({ calendar_view: 'decade' }); },
    };
    constructor(props) {
        super(props);
        const { date_format, start_date } = props;
        const current_date = moment.utc(start_date).format(date_format);
        this.state = {
            calendar_date: current_date, // calendar date reference
            selected_date: '',           // selected date
            calendar_view: 'date',
        };
    }
    navigateTo = (value, unit, is_add) => {
        const { date_format, max_date, min_date } = this.props;

        let new_date = moment.utc(this.state.calendar_date, date_format)[is_add ? 'add' : 'subtract'](value, unit).format(date_format);

        if (unit === 'months' && this.isPeriodDisabled(new_date, 'month')) return;

        if (unit === 'years'  && this.isPeriodDisabled(new_date, 'years')) {
            new_date = is_add ? max_date : min_date;
        }

        this.setState({ calendar_date: moment.utc(new_date, date_format).format(date_format) }); // formatted date
    };

    updateSelectedDate = (e, is_disabled) => {
        if (is_disabled) {
            return;
        }

        const { date_format, max_date, min_date, onSelect } = this.props;

        const moment_date = moment.utc(e.target.dataset.date).startOf('day');
        const is_before   = moment_date.isBefore(moment.utc(min_date));
        const is_after    = moment_date.isAfter(moment.utc(max_date));

        if (is_before || is_after) {
            return;
        }

        const formatted_date = moment_date.format(date_format);
        this.setState({
            calendar_date: formatted_date,
            selected_date: formatted_date,
        });

        if (onSelect) {
            onSelect(formatted_date);
        }
    };

    updateSelected = (e, type) => {
        const view_map = {
            month : 'date',
            year  : 'month',
            decade: 'year',
        };
        const calendar_date = this.state.calendar_date;
        const date = moment.utc(calendar_date, this.props.date_format)[type === 'decade' ? 'year' : type](e.target.dataset[type].split('-')[0]).format(this.props.date_format);

        if (this.isPeriodDisabled(date, type)) return;

        this.setState({
            calendar_date: date,
            calendar_view: view_map[type],
        });
    };

    resetCalendar = () => {
        const { date_format, start_date } = this.props;

        const default_date = moment.utc(start_date).format(date_format);
        this.setState({
            calendar_date: default_date,
            selected_date: '',
            calendar_view: 'date',
        });
    };

    setToday = () => {
        const { date_format, onSelect } = this.props;

        const now = moment().utc().format(date_format);
        this.setState({
            calendar_date: now,
            selected_date: now,
            calendar_view: 'date',
        });

        if (onSelect) {
            onSelect(now, false);
        }
    };

    isPeriodDisabled = (date, unit) => {
        const { max_date, min_date } = this.props;

        const start_of_period = moment.utc(date).startOf(unit);
        const end_of_period   = moment.utc(date).endOf(unit);
        return end_of_period.isBefore(moment.utc(min_date))
            || start_of_period.isAfter(moment.utc(max_date));
    };

    render() {
        const { children, date_format, footer, has_today_btn, id, max_date, min_date, start_date } = this.props;
        const { calendar_date, calendar_view, selected_date  } = this.state;

        return (
            <div id={id} className="calendar" value={selected_date}>
                { children }
                <CalendarHeader
                    calendar_date={calendar_date}
                    isPeriodDisabled={this.isPeriodDisabled}
                    onClick={this.navigators}
                    onSelect={this.calendarViews}
                    calendar_view={calendar_view}
                />
                <CalendarPanel
                    calendar_date={calendar_date}
                    date_format={date_format}
                    isPeriodDisabled={this.isPeriodDisabled}
                    max_date={max_date}
                    min_date={min_date}
                    start_date={start_date}
                    onClick={this.panelSelectors}
                    selected_date={selected_date}
                    calendar_view={calendar_view}
                />
                <CalendarFooter
                    footer={footer}
                    onClick={this.setToday}
                    has_today_btn={has_today_btn}
                />
            </div>
        );
    }
}

Calendar.defaultProps = {
    date_format: 'YYYY-MM-DD',
    min_date   : moment(0).utc().format('YYYY-MM-DD'),              // by default, min_date is set to Unix Epoch (January 1st 1970)
    max_date   : moment().utc().add(120, 'y').format('YYYY-MM-DD'), // by default, max_date is set to 120 years after today
};

export default Calendar;
