import moment from 'moment';
import React from 'react';
// @ts-expect-error ts-migrate(2305) FIXME: Module '"./panels/index"' has no exported member '... Remove this comment to see the full error message
import { CalendarDays, CalendarMonths, CalendarYears, CalendarDecades } from './panels/index';

function CalendarButton({
    children,
    className,
    is_hidden,
    label,
    onClick,
}: any) {
    return (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <React.Fragment>
            {!is_hidden && (
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <span type='button' className={className} onClick={onClick}>
                    {label}
                    {children}
                </span>
            )}
        </React.Fragment>
    );
}

function CalendarPanel(props: any) {
    const calendar_panel = {
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        date: <CalendarDays {...props} />,
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        month: <CalendarMonths {...props} />,
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        year: <CalendarYears {...props} />,
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        decade: <CalendarDecades {...props} />,
    };

    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    return <div className='calendar-panel'>{calendar_panel[props.calendar_view]}</div>;
}

function CalendarFooter({
    footer,
    has_today_btn,
    onClick,
}: any) {
    return (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className='calendar-footer'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            {footer && <span className='calendar-footer-extra'>{footer}</span>}
            {has_today_btn && (
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <CalendarButton className='calendar-footer-btn'>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <span onClick={onClick}>{t.translate('Today')}</span>
                </CalendarButton>
            )}
        </div>
    );
}

function CalendarHeader({
    calendar_date,
    isPeriodDisabled,
    onClick,
    onSelect,
    calendar_view,
}: any) {
    const is_date_view = calendar_view === 'date';
    const is_month_view = calendar_view === 'month';
    const is_year_view = calendar_view === 'year';
    const is_decade_view = calendar_view === 'decade';
    const moment_date = moment.utc(calendar_date);
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
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className='calendar-header'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <CalendarButton
                className={`calendar-prev-year-btn ${
                    isPeriodDisabled(moment_date.clone().subtract(1, 'month'), 'month') ? 'hidden' : ''
                }`}
                onClick={onPreviousYearClick}
            />
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <CalendarButton
                className={`calendar-prev-month-btn ${
                    isPeriodDisabled(moment_date.clone().subtract(1, 'month'), 'month') ? 'hidden' : ''
                }`}
                is_hidden={!is_date_view}
                onClick={onClick.previousMonth}
            />

            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <div className='calendar-select'>
                {is_date_view && (
                    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <CalendarButton
                        className='calendar-select-month-btn'
                        is_hidden={!is_date_view}
                        label={moment_date.format('MMM')}
                        onClick={onSelect.month}
                    />
                )}
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <CalendarButton className='calendar-select-year-btn' onClick={onSelectYearClick}>
                    {(is_date_view || is_month_view) && moment_date.year()}
                    {is_year_view &&
                        `${moment_date.clone().subtract(1, 'years').year()}-${moment_date
                            .clone()
                            .add(10, 'years')
                            .year()}`}
                    {is_decade_view &&
                        `${moment_date.clone().subtract(10, 'years').year()}-${moment_date
                            .clone()
                            .add(109, 'years')
                            .year()}`}
                </CalendarButton>
            </div>

            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <CalendarButton
                className={`calendar-next-month-btn ${
                    isPeriodDisabled(moment_date.clone().add(1, 'month'), 'month') ? 'hidden' : ''
                }`}
                is_hidden={!is_date_view}
                onClick={onClick.nextMonth}
            />
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <CalendarButton
                className={`calendar-next-year-btn ${
                    isPeriodDisabled(moment_date.clone().add(1, 'month'), 'month') ? 'hidden' : ''
                }`}
                onClick={onNextYearClick}
            />
        </div>
    );
}

const Calendar = React.forwardRef(
    (
        {
            children,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'footer' does not exist on type '{ childr... Remove this comment to see the full error message
            footer,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'has_today_btn' does not exist on type '{... Remove this comment to see the full error message
            has_today_btn,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type '{ children?:... Remove this comment to see the full error message
            id,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'date_format' does not exist on type '{ c... Remove this comment to see the full error message
            date_format = 'YYYY-MM-DD',
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'start_date' does not exist on type '{ ch... Remove this comment to see the full error message
            start_date,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'max_date' does not exist on type '{ chil... Remove this comment to see the full error message
            max_date = moment().utc().add(120, 'y').format('YYYY-MM-DD'), // by default, max_date is set to 120 years after today
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'min_date' does not exist on type '{ chil... Remove this comment to see the full error message
            min_date = moment(0).utc().format('YYYY-MM-DD'), // by default, min_date is set to Unix Epoch (January 1st 1970)
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'onSelect' does not exist on type '{ chil... Remove this comment to see the full error message
            onSelect,
        },
        ref
    ) => {
        const [calendar_date, setCalendarDate] = React.useState(moment.utc(start_date).format(date_format));
        const [selected_date, setSelectedDate] = React.useState('');
        const [calendar_view, setCalendarView] = React.useState('date');

        React.useImperativeHandle(ref, () => ({
            setCalendarDate,
            setSelectedDate,
        }));

        // navigates to next or previous's month/year/decade/century
        const navigators = {
            nextMonth: () => {
                navigateTo(1, 'months', true);
            },
            previousMonth: () => {
                navigateTo(1, 'months', false);
            },
            nextYear: () => {
                navigateTo(1, 'years', true);
            },
            previousYear: () => {
                navigateTo(1, 'years', false);
            },
            nextDecade: () => {
                navigateTo(10, 'years', true);
            },
            previousDecade: () => {
                navigateTo(10, 'years', false);
            },
            nextCentury: () => {
                navigateTo(100, 'years', true);
            },
            previousCentury: () => {
                navigateTo(100, 'years', false);
            },
        };

        // selects a day, a month, a year, or a decade
        const panelSelectors = {
            date: (e: any, is_disabled: any) => {
                updateSelectedDate(e, is_disabled);
            },
            month: (e: any) => {
                updateSelected(e, 'month');
            },
            year: (e: any) => {
                updateSelected(e, 'year');
            },
            decade: (e: any) => {
                updateSelected(e, 'decade');
            },
        };

        // sets Calendar active view
        const calendarViews = {
            date: () => {
                setCalendarView('date');
            },
            month: () => {
                setCalendarView('month');
            },
            year: () => {
                setCalendarView('year');
            },
            decade: () => {
                setCalendarView('decade');
            },
        };

        const navigateTo = (value: any, unit: any, is_add: any) => {
            let new_date = moment
                .utc(calendar_date, date_format)
                [is_add ? 'add' : 'subtract'](value, unit)
                .format(date_format);

            if (unit === 'months' && isPeriodDisabled(new_date, 'month')) return;

            if (unit === 'years' && isPeriodDisabled(new_date, 'years')) {
                new_date = is_add ? max_date : min_date;
            }

            setCalendarDate(moment.utc(new_date, date_format).format(date_format)); // formatted date
        };

        const updateSelectedDate = (e: any, is_disabled: any) => {
            if (is_disabled) {
                return;
            }

            const moment_date = moment.utc(e.target.dataset.date).startOf('day');
            const is_before = moment_date.isBefore(moment.utc(min_date));
            const is_after = moment_date.isAfter(moment.utc(max_date));

            if (is_before || is_after) {
                return;
            }

            const formatted_date = moment_date.format(date_format);

            setCalendarDate(formatted_date);
            setSelectedDate(formatted_date);

            if (onSelect) {
                onSelect(formatted_date);
            }
        };

        const updateSelected = (e: any, type: any) => {
            const view_map = {
                month: 'date',
                year: 'month',
                decade: 'year',
            };
            // @ts-expect-error ts-migrate(7052) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
            const date = moment
                .utc(calendar_date, date_format)
                [type === 'decade' ? 'year' : type](e.target.dataset[type].split('-')[0])
                .format(date_format);

            if (isPeriodDisabled(date, type)) return;

            setCalendarDate(date);
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            setCalendarView(view_map[type]);
        };

        const setToday = () => {
            const now = moment().utc().format(date_format);

            setCalendarDate(now);
            setSelectedDate(now);
            setCalendarView('date');

            if (onSelect) {
                onSelect(now, false);
            }
        };

        const isPeriodDisabled = (date: any, unit: any) => {
            const start_of_period = moment.utc(date).startOf(unit);
            const end_of_period = moment.utc(date).endOf(unit);
            return end_of_period.isBefore(moment.utc(min_date)) || start_of_period.isAfter(moment.utc(max_date));
        };

        return (
            // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div id={id} className='calendar' value={selected_date}>
                {children}
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <CalendarHeader
                    calendar_date={calendar_date}
                    isPeriodDisabled={isPeriodDisabled}
                    onClick={navigators}
                    onSelect={calendarViews}
                    calendar_view={calendar_view}
                />
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <CalendarPanel
                    calendar_date={calendar_date}
                    date_format={date_format}
                    isPeriodDisabled={isPeriodDisabled}
                    max_date={max_date}
                    min_date={min_date}
                    start_date={start_date}
                    onClick={panelSelectors}
                    selected_date={selected_date}
                    calendar_view={calendar_view}
                />
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <CalendarFooter footer={footer} onClick={setToday} has_today_btn={has_today_btn} />
            </div>
        );
    }
);

export default React.memo(Calendar);
