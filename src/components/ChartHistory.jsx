import React from 'react';
import { connect } from '../store/Connect';
import DatePicker from './DateTimePicker/DatePicker.jsx';
import TimePicker from './DateTimePicker/TimePicker.jsx';
import '../../sass/components/_chart-history.scss';

const ChartHistory = ({ date, time, onChange }) => (
    <div className="ciq-chart-history">
        <DatePicker
            placeholder="select date"
            name="date"
            format="DD MMMM YYYY"
            onChange={onChange}
            value={date}
        />
        <TimePicker
            placeholder="time"
            name="time"
            onChange={onChange}
            value={time}
        />
    </div>
);

export default connect(({ chartHistory }) => ({
    date: chartHistory.date,
    time: chartHistory.time,
    onChange: chartHistory.onChange,
}))(ChartHistory);
