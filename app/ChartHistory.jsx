import React from 'react';
import moment from 'moment';
import DatePicker from './DateTimePicker/DatePicker.jsx';
import TimePicker from './DateTimePicker/TimePicker.jsx';
import './chart-history.scss';

class ChartHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment().format('YYYY/MM/DD'),
            time: '00:00',
        };
    }
    onChange({ target }) {
        if (target.name === 'date') {
            this.setState({
                date: target.value,
            });
        }

        if (target.name === 'time') {
            this.setState({
                time: target.value,
            });
        }

        this.props.onChange(`${this.state.date} ${this.state.time}`);
    }
    render() {
        return (
            <div className="ciq-chart-history">
                <strong>Historical Data:</strong>
                <DatePicker
                    placeholder="select date"
                    name="date"
                    format="DD MMMM YYYY"
                    has_today_btn
                    value={this.state.date}
                    onChange={e => this.onChange(e)}
                    min_date={moment.utc().subtract(1, 'years').toDate()}
                    max_date={moment.utc().toDate()}
                />
                <TimePicker
                    placeholder="time"
                    name="time"
                    is_clearable
                    value={this.state.time}
                    onChange={e => this.onChange(e)}
                />
            </div>
        );
    }
}

export default ChartHistory;
