/* eslint-disable react/no-array-index-key */
import moment from 'moment';
import React from 'react';

const getMonthHeaders = () => ({
    Jan: 'Jan',
    Feb: 'Feb',
    Mar: 'Mar',
    Apr: 'Apr',
    May: 'May',
    Jun: 'Jun',
    Jul: 'Jul',
    Aug: 'Aug',
    Sep: 'Sep',
    Oct: 'Oct',
    Nov: 'Nov',
    Dec: 'Dec',
});

export const CalendarMonths = ({ calendar_date, isPeriodDisabled, onClick, selected_date }) => {
    const moment_date    = moment.utc(calendar_date);
    const selected_month = moment.utc(selected_date).month();
    const month_headers  = getMonthHeaders();

    return (
        <div className="calendar-month-panel">
            {Object.keys(month_headers).map((month, idx) => (
                <span
                    key={month}
                    className={`calendar-month ${(idx === selected_month) ? 'active' : ''} ${isPeriodDisabled(moment_date.month(month), 'month') ? 'disabled' : ''} `}
                    onClick={onClick.month}
                    data-month={idx}
                >
                    {t.translate(month_headers[month])}
                </span>
            ))}
        </div>
    );
};
