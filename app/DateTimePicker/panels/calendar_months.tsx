/* eslint-disable react/no-array-index-key */
import moment from 'moment';
import React from 'react';

const getMonthHeaders = () => ({
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    Jan: t.translate('Jan'),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    Feb: t.translate('Feb'),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    Mar: t.translate('Mar'),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    Apr: t.translate('Apr'),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    May: t.translate('May'),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    Jun: t.translate('Jun'),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    Jul: t.translate('Jul'),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    Aug: t.translate('Aug'),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    Sep: t.translate('Sep'),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    Oct: t.translate('Oct'),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    Nov: t.translate('Nov'),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    Dec: t.translate('Dec'),
});

export const CalendarMonths = ({
    calendar_date,
    isPeriodDisabled,
    onClick,
    selected_date,
}: any) => {
    const moment_date = moment.utc(calendar_date);
    const selected_month = moment.utc(selected_date).month();
    const month_headers = getMonthHeaders();

    return (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className='calendar-month-panel'>
            {Object.keys(month_headers).map((month, idx) => (
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <span
                    key={month}
                    className={`calendar-month ${idx === selected_month ? 'active' : ''} ${
                        isPeriodDisabled(moment_date.month(month), 'month') ? 'disabled' : ''
                    } `}
                    onClick={onClick.month}
                    data-month={idx}
                >
                    {/* @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message */}
                    {month_headers[month]}
                </span>
            ))}
        </div>
    );
};
