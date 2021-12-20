/* eslint-disable react/no-array-index-key */
import moment from 'moment';
import React from 'react';
import { TCalendarViewProps } from '../calendar.props';

export const CalendarDecades = ({ calendar_date, isPeriodDisabled, onClick, selected_date }: TCalendarViewProps) => {
    const selected_year = moment.utc(selected_date).year();
    const moment_date = moment.utc(calendar_date);

    const decades = [];
    let min_year = moment_date.year() - 10;
    for (let i = 0; i < 12; i++) {
        const max_year = min_year + 9;
        const range = `${min_year}-${max_year}`;
        decades.push(range);
        min_year = max_year + 1;
    }

    return (
        <div className='calendar-decade-panel'>
            {decades.map((range, idx) => {
                const [start_year, end_year] = range.split('-');
                return (
                    <span
                        key={idx}
                        className={`calendar-decade ${
                            isPeriodDisabled(moment_date.year(parseInt(start_year)), 'year') &&
                            isPeriodDisabled(moment_date.year(parseInt(end_year)), 'year')
                                ? 'disabled'
                                : ''
                        } ${parseInt(start_year) === selected_year ? 'active' : ''}`}
                        onClick={onClick.decade}
                        data-decade={range}
                    >
                        {range}
                    </span>
                );
            })}
        </div>
    );
};
