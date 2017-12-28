import { ChartStore, Actions } from "../stores/ChartStore";

export default class Legend extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			comparisons: ChartStore.getComparisons()
		};
		this.ciq = props.ciq;
		this.onStoreChange = this.onStoreChange.bind(this);
	}
	onStoreChange() {
		this.setState({ comparisons: ChartStore.getComparisons() });
	}
	componentWillMount() {
		ChartStore.addListener(["comparisonsChange"], this.onStoreChange);
	}
	componentWillUnmount() {
		ChartStore.removeListener(["comparisonsChange"], this.onStoreChange);
		// This will remove the quoteDriver, styles and
		// eventListeners for this ChartEngine instance.
		this.ciq.destroy();
	}
	removeSeries(comparison) {
		Actions.removeComparisonSeries(comparison);
		this.ciq.removeSeries(comparison.display, this.ciq.ciq);
	}
	render() {
		var self = this;
		if (!this.state.comparisons || this.state.comparisons.length === 0) { return <span></span>; }

		var comparisons = this.state.comparisons.map(function (comparison, i) {
			return (
				<div className="comparisonWrapper" key={"comp" + i}>
					<div className="chartSeriesColor" style={{ "backgroundColor": comparison.parameters.color }} ></div>
					<div className="chartSeries">{comparison.display}</div>
					<div className="deleteSeries" onClick={function () {
						self.removeSeries(comparison);
					}} ></div >
				</div>
			);
		});

		return <div className="comparisons">
			{comparisons}
		</div>;
	}
}