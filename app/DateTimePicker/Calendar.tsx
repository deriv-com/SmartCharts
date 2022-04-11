import moment from 'moment';
import React from 'react';
import { Wrapper } from '../../src/components/Icons';
import CalendarICInfo from '../icons/ic-calendar-info.svg';
import { CalendarDays, CalendarMonths, CalendarYears, CalendarDecades } from './panels/index';

const CalendarIconInfo = Wrapper(CalendarICInfo);

type TCalendarButtonProps = {
    className: string;
    is_hidden?: boolean;
    label?: string;
    onClick?: React.MouseEventHandler;
    children?: React.ReactNode;
};

type TCalendarProps = {
    footer?: React.ReactElement;
    has_today_btn: boolean;
    id?: string;
    date_format?: string;
    start_date?: number;
    max_date: string;
    min_date: string;
    onSelect: (date: string, is_datepicker_visible?: boolean) => void;
    ref?: React.Ref<TCalendarRefProps>;
    children?: React.ReactNode;
};

export type TCalendarRefProps = {
    setCalendarDate: React.Dispatch<React.SetStateAction<string>>;
    setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
};

type TCalendarFooterProps = {
    has_today_btn: boolean;
    onClick?: React.MouseEventHandler;
    footer?: React.ReactElement;
};

type TCalendarPanelProps = {
    calendar_view: string;
    selected_date: string;
    onClick: {
        date: (e: React.SyntheticEvent<HTMLElement>, is_disabled: boolean) => void;
        month: (e: React.SyntheticEvent<HTMLElement>) => void;
        year: (e: React.SyntheticEvent<HTMLElement>) => void;
        decade: (e: React.SyntheticEvent<HTMLElement>) => void;
    };
    date_format: string;
    max_date: string;
    min_date: string;
    start_date?: number;
    calendar_date: string;
    isPeriodDisabled: (date: moment.Moment, unit: moment.unitOfTime.StartOf) => boolean;
};

type TCalendarHeaderProps = {
    calendar_date: string;
    isPeriodDisabled: TCalendarPanelProps['isPeriodDisabled'];
    onClick: {
        nextMonth: () => void;
        previousMonth: () => void;
        nextYear: () => void;
        previousYear: () => void;
        nextDecade: () => void;
        previousDecade: () => void;
        nextCentury: () => void;
        previousCentury: () => void;
    };
    onSelect: {
        date: () => void;
        month: () => void;
        year: () => void;
        decade: () => void;
    };
    calendar_view: string;
};

const CalendarButton = ({ children, className, is_hidden, label, onClick }: TCalendarButtonProps) => {
    return (
        <React.Fragment>
            {!is_hidden && (
                <span className={className} onClick={onClick}>
                    {label}
                    {children}
                </span>
            )}
        </React.Fragment>
    );
};

const CalendarPanel = (props: TCalendarPanelProps) => {
    const calendar_panel = {
        date: <CalendarDays {...props} />,
        month: <CalendarMonths {...props} />,
        year: <CalendarYears {...props} />,
        decade: <CalendarDecades {...props} />,
    };

    return <div className='calendar-panel'>{calendar_panel[props.calendar_view as keyof typeof calendar_panel]}</div>;
};

const CalendarFooter = ({ footer, has_today_btn, onClick }: TCalendarFooterProps) => {
    return (
        <div className='calendar-footer'>
            {footer && <span className='calendar-footer-extra'>{footer}</span>}
            {has_today_btn && (
                <CalendarButton className='calendar-footer-btn'>
                    <CalendarIconInfo className='calendar-footer-btn-icon-info' onClick={onClick} />
                </CalendarButton>
            )}
        </div>
    );
};

const CalendarHeader = ({
    calendar_date,
    isPeriodDisabled,
    onClick,
    onSelect,
    calendar_view,
}: TCalendarHeaderProps) => {
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
        <div className='calendar-header'>
            <CalendarButton
                className={`calendar-prev-year-btn ${
                    isPeriodDisabled(moment_date.clone().subtract(1, 'month'), 'month') ? 'hidden' : ''
                }`}
                onClick={onPreviousYearClick}
            />
            <CalendarButton
                className={`calendar-prev-month-btn ${
                    isPeriodDisabled(moment_date.clone().subtract(1, 'month'), 'month') ? 'hidden' : ''
                }`}
                is_hidden={!is_date_view}
                onClick={onClick.previousMonth}
            />

            <div className='calendar-select'>
                {is_date_view && (
                    <CalendarButton
                        className='calendar-select-month-btn'
                        is_hidden={!is_date_view}
                        label={moment_date.format('MMM')}
                        onClick={onSelect.month}
                    />
                )}
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

            <CalendarButton
                className={`calendar-next-month-btn ${
                    isPeriodDisabled(moment_date.clone().add(1, 'month'), 'month') ? 'hidden' : ''
                }`}
                is_hidden={!is_date_view}
                onClick={onClick.nextMonth}
            />
            <CalendarButton
                className={`calendar-next-year-btn ${
                    isPeriodDisabled(moment_date.clone().add(1, 'month'), 'month') ? 'hidden' : ''
                }`}
                onClick={onNextYearClick}
            />
        </div>
    );
};

const Calendar = React.forwardRef<TCalendarRefProps, TCalendarProps>(
    (
        {
            children,
            footer,
            has_today_btn,
            id,
            date_format = 'YYYY-MM-DD',
            start_date,
            max_date = moment().utc().add(120, 'y').format('YYYY-MM-DD'), // by default, max_date is set to 120 years after today
            min_date = moment(0).utc().format('YYYY-MM-DD'), // by default, min_date is set to Unix Epoch (January 1st 1970)
            onSelect,
        }: TCalendarProps,
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
            date: (e: React.SyntheticEvent<HTMLElement>, is_disabled: boolean) => {
                updateSelectedDate(e, is_disabled);
            },
            month: (e: React.SyntheticEvent<HTMLElement>) => {
                updateSelected(e, 'month');
            },
            year: (e: React.SyntheticEvent<HTMLElement>) => {
                updateSelected(e, 'year');
            },
            decade: (e: React.SyntheticEvent<HTMLElement>) => {
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

        const navigateTo = (value: number, unit: moment.unitOfTime.DurationConstructor, is_add: boolean) => {
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

        const updateSelectedDate = (e: React.SyntheticEvent<HTMLElement>, is_disabled: boolean) => {
            if (!(e.target instanceof HTMLElement)) {
                return;
            }

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

        const updateSelected = (e: React.SyntheticEvent<HTMLElement>, type: 'month' | 'year' | 'decade') => {
            if (!(e.target instanceof HTMLElement)) {
                return;
            }

            const view_map = {
                month: 'date',
                year: 'month',
                decade: 'year',
            };

            const text = e.target.dataset?.[type]?.split('-')[0] || '';

            const moment_date = moment
                .utc(calendar_date, date_format)
                [type === 'decade' ? 'year' : type](text) as moment.Moment;

            const date = moment_date.format(date_format);

            if (isPeriodDisabled(date, type === 'decade' ? null : type)) return;

            setCalendarDate(date);
            setCalendarView(view_map[type as keyof typeof view_map]);
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

        const isPeriodDisabled = (date: moment.Moment | string, unit: moment.unitOfTime.StartOf) => {
            const start_of_period = moment.utc(date).startOf(unit);
            const end_of_period = moment.utc(date).endOf(unit);
            return end_of_period.isBefore(moment.utc(min_date)) || start_of_period.isAfter(moment.utc(max_date));
        };

        return (
            <div id={id} className='calendar'>
                {children}
                <CalendarHeader
                    calendar_date={calendar_date}
                    isPeriodDisabled={isPeriodDisabled}
                    onClick={navigators}
                    onSelect={calendarViews}
                    calendar_view={calendar_view}
                />
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
                <CalendarFooter footer={footer} onClick={setToday} has_today_btn={has_today_btn} />
            </div>
        );
    }
);

export default Calendar;
