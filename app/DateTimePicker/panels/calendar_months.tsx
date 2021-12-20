/* eslint-disable react/no-array-index-key */
import moment from 'moment';
import React from 'react';
import { TCalendarViewProps } from '../calendar.props';

const getMonthHeaders = () => ({
    Jan: t.translate('Jan'),
    Feb: t.translate('Feb'),
    Mar: t.translate('Mar'),
    Apr: t.translate('Apr'),
    May: t.translate('May'),
    Jun: t.translate('Jun'),
    Jul: t.translate('Jul'),
    Aug: t.translate('Aug'),
    Sep: t.translate('Sep'),
    Oct: t.translate('Oct'),
    Nov: t.translate('Nov'),
    Dec: t.translate('Dec'),
});

export const CalendarMonths = ({ calendar_date, isPeriodDisabled, onClick, selected_date }: TCalendarViewProps) => {
    const moment_date = moment.utc(calendar_date);
    const selected_month = moment.utc(selected_date).month();
    const month_headers = getMonthHeaders();

    return (
        <div className='calendar-month-panel'>
            {Object.keys(month_headers).map((month, idx) => (
                <span
                    key={month}
                    className={`calendar-month ${idx === selected_month ? 'active' : ''} ${
                        isPeriodDisabled(moment_date.month(month), 'month') ? 'disabled' : ''
                    } `}
                    onClick={onClick.month}
                    data-month={idx}
                >
                    {month_headers[month as keyof typeof month_headers]}
                </span>
            ))}
        </div>
    );
};
