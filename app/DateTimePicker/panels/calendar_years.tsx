/* eslint-disable react/no-array-index-key */
import moment from 'moment';
import React from 'react';
import { TCalendarViewProps } from '../calendar.props';

export const CalendarYears = ({ calendar_date, isPeriodDisabled, onClick, selected_date }: TCalendarViewProps) => {
    const selected_year = moment.utc(selected_date).year();
    const moment_date = moment.utc(calendar_date);
    const current_year = moment_date.year();
    const years = [];
    for (let year = current_year - 1; year < current_year + 11; year++) {
        years.push(year);
    }
    return (
        <div className='calendar-year-panel'>
            {years.map(year => (
                <span
                    key={year}
                    className={`calendar-year ${isPeriodDisabled(moment_date.year(year), 'year') ? 'disabled' : ''} ${
                        year === selected_year ? 'active' : ''
                    }`}
                    onClick={onClick.year}
                    data-year={year}
                >
                    {year}
                </span>
            ))}
        </div>
    );
};
