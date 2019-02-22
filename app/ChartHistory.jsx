import React from 'react';
import moment from 'moment';
import DatePicker from './DateTimePicker/DatePicker.jsx';
import TimePicker from './DateTimePicker/TimePicker.jsx';
import './chart-history.scss';

class ChartHistory extends React.PureComponent {
    constructor(props) {
        super(props);
        this.tradingAPI = props.tradingAPI;
        this.state = {
            date: moment().format('YYYY-MM-DD'),
            focusOnDate: false,
            focusOnTime: false,
            sessions: props.tradingTime,
            time: '00:00',
        };
    }

    componentDidMount() {
        this.setState({
            focusOnDate: true,
        }, this.updateTradingTime);
    }

    componentDidUpdate(prevProps) {
        const { symbol } = this.props;
        if (prevProps.symbol !== symbol) {
            const symbolTrading = this.tradingAPI._tradingTimesMap[symbol];
            const sessions = (symbolTrading && symbolTrading.times)
                ? symbolTrading.times
                : null;

            this.updateSession(sessions);
        }
    }

    updateTradingTime = () => {
        const { date } = this.state;
        const { symbol } = this.props;

        this.tradingAPI.getForDate(date).then(() => {
            if (symbol && this.tradingAPI._tradingTimesMap) {
                const symbolTrading = this.tradingAPI._tradingTimesMap[symbol];
                const sessions = (symbolTrading && symbolTrading.times)
                    ? symbolTrading.times
                    : null;

                this.updateSession(sessions);
            }
        });
    }

    updateSession = (sessions) => {
        this.setState({
            sessions,
        });
    }

    onChangeDate = ({ target }) => {
        const date = target.value;

        this.setState({ date, focusOnDate: false, focusOnTime: true }, this.updateTradingTime);
    }

    onChangeTime = ({ target }) => {
        const time = target.value;
        this.setState({ time, focusOnDate: false, focusOnTime: false }, this.updateStore);
    }

    onDisableFocus = () => {
        this.setState({ focusOnDate: false, focusOnTime: false });
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
                    disableFocus={this.onDisableFocus}
                    has_today_btn
                    value={this.state.date}
                    onChange={this.onChangeDate}
                    min_date={moment.utc().subtract(1, 'years').toDate()}
                    max_date={moment.utc().toDate()}
                />
                <TimePicker
                    placeholder="time"
                    name="time"
                    focus={this.state.focusOnTime}
                    disableFocus={this.onDisableFocus}
                    is_clearable
                    start_date={moment(this.state.date, 'YYYY/MM/DD').valueOf() / 1000}
                    diffTime={this.props.diffTime}
                    sessions={this.state.sessions}
                    value={this.state.time}
                    onChange={this.onChangeTime}
                />
            </div>
        );
    }
}

export default ChartHistory;
