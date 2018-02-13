export const getTimeUnit = ({ timeUnit, interval }) => {
    if (timeUnit === null && interval === 'day') {
        return 'day';
    } else if (timeUnit === 'minute' && interval % 60 === 0) {
        return 'hour';
    } else if (timeUnit === 'second') {
        return 'tick';
    }
    return timeUnit;
};
