/* eslint-disable react/no-array-index-key */
import moment from 'moment';
import React from 'react';

export const CalendarDecades = ({
    calendar_date,
    isPeriodDisabled,
    onClick,
    selected_date,
}: any) => {
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
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className='calendar-decade-panel'>
            {decades.map((range, idx) => {
                const [start_year, end_year] = range.split('-');
                return (
                    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <span
                        key={idx}
                        className={`calendar-decade ${
                            // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                            isPeriodDisabled(moment_date.year(start_year), 'year') &&
                            // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                            isPeriodDisabled(moment_date.year(end_year), 'year')
                                ? 'disabled'
                                : ''
                        } ${                        
// @ts-expect-error ts-migrate(2367) FIXME: This condition will always return 'false' since th... Remove this comment to see the full error message
start_year === selected_year ? 'active' : ''}`}
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
