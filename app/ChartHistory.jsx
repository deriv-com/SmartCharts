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
            focusOnDate: false,
            focusOnTime: false,
            time: '00:00',
        };
    }

    componentDidMount() {
        this.setState({
            focusOnDate: true,
        });
    }

    onChangeDate({ target }) {
        const date = target.value;
        this.setState({ date, focusOnDate: false, focusOnTime: true });
    }

    onChangeTime({ target }) {
        const time = target.value;
        this.setState({ time, focusOnDate: false, focusOnTime: false }, this.updateStore);
    }

    updateStore() {
        const { date, time } = this.state;
        this.props.onChange(`${date} ${time}`);
    }

    render() {
        return (
            <div className="ciq-chart-history">
                <strong>{t.translate('Historical Data')}:</strong>
                <DatePicker
                    placeholder={t.translate('select date')}
                    name="date"
                    format="DD MMMM YYYY"
                    focus={this.state.focusOnDate}
                    has_today_btn
                    value={this.state.date}
                    onChange={e => this.onChangeDate(e)}
                    min_date={moment.utc().subtract(1, 'years').toDate()}
                    max_date={moment.utc().toDate()}
                />
                <TimePicker
                    placeholder="time"
                    name="time"
                    focus={this.state.focusOnTime}
                    is_clearable
                    start_date={moment(this.state.date, 'YYYY/MM/DD').valueOf() / 1000}
                    value={this.state.time}
                    onChange={e => this.onChangeTime(e)}
                />
            </div>
        );
    }
}

export default ChartHistory;
