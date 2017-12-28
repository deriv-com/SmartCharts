

import { ChartStore, Actions } from "../stores/ChartStore";
const rangeConfig = [
	{
		"display": "All",
		"span": "all",
		"multiplier": 1
	},
	{
		"display": "5y",
		"span": "year",
		"multiplier": 5
	},
	{
		"display": "1y",
		"span": "year",
		"multiplier": 1
	},
	{
		"display": "YTD",
		"span": "YTD",
		"multiplier": 1
	},
	{
		"display": "3m",
		"span": "month",
		"multiplier": 3
	},
	{
		"display": "1m",
		"span": "month",
		"multiplier": 1
	},
	{
		"display": "5d",
		"span": "day",
		"multiplier": 5
	},
	{
		"display": "1d",
		"span": "day",
		"multiplier": 1
	}
];

export default class RangeSelector extends React.Component {
	constructor(props) {
		super(props);
		this.ciq = props.ciq;
	}
	componentWillMount() {
		this.addStoreListeners();
	}
	componentWillUnmount() {
		this.removeStoreListeners();
	}
	addStoreListeners() {
		ChartStore.addListener('showLoader', Actions.showLoader);
		ChartStore.addListener('hideLoader', Actions.hideLoader);
	}
	removeStoreListeners() {
		ChartStore.removeListener('showLoader', Actions.showLoader);
		ChartStore.removeListener('hideLoader', Actions.hideLoader);
	}
	setSpan(span, multiplier) {
		ChartStore.Actions.setSpan({
			data: { span, multiplier }
		});
	}
	render() {
		var self = this;
		var ranges = rangeConfig.map(function (range, i) {
			return (<div className="quick-link" key={i} onClick={function () {
				self.setSpan(range.span, range.multiplier);
			}}>{range.display}</div>);
		});
		return (
			<div>
				{ranges}
			</div>
		);
	}
}

