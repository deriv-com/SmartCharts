import UI from "./UI";
//This just loads the feed into the CIQ engine
import FeedService from "../feeds/template";
import { ChartStore, Actions } from "../stores/ChartStore";
import RangeSelector from "./RangeSelector";
import Legend from './Legend';
import DrawingToolbarWrapper from './DrawingToolbarWrapper';
export default class ChartWrapper extends React.Component {
	constructor(props) {
		super(props);
		this.ciq = null;
		this.state = {
			feed: "Demo",
			service: null,
			chartSeries: [],
			loader: false
		};
	}
	componentDidMount() {
		this.bindCorrectContext();
		this.addStoreListeners();
		var self = this;
		var ciq = new CIQ.ChartEngine({
			container: $$$("#chartContainer")
		});
		ciq.xaxisHeight = 30;
		//You can add an event listener to the window,however, older browsers don't support this.
		window.addEventListener("resize", function () {
			Actions.updateChartContainerSize();
		});
		this.ciq = ciq;
		ChartStore.setChart(ciq);
		this.setState({
			service: new FeedService().makeFeed()
		}, function () {
			this.attachFeed(this.state.service);
			let defaultSymbol = this.props.symbol ? this.props.symbol : "R_100";
			Actions.setSymbol(defaultSymbol);
		});
	}
	bindCorrectContext() {
		this.hideLoader = this.hideLoader.bind(this);
		this.showLoader = this.showLoader.bind(this);
	}
	addStoreListeners() {
		ChartStore.addListener('showLoader', this.showLoader);
		ChartStore.addListener('hideLoader', this.hideLoader);
	}
	removeStoreListeners() {
		ChartStore.removeListener('showLoader', this.showLoader);
		ChartStore.removeListener('hideLoader', this.hideLoader);
	}
	setPeriodicity(period, interval) {
		Actions.setPeriodicity({ period, interval });
	}
	setChartType(type) {
		Actions.setChartType(type);
	}
	toggleCrosshairs() {
		var state = this.ciq.layout.crosshair;
		this.ciq.layout.crosshair = !state;
	}
	attachFeed(feed) {
		this.ciq.attachQuoteFeed(feed, {
			refreshInterval: 1
		});
	}
	showLoader() {
		this.setState({
			loader: true
		});
	}
	hideLoader() {
		this.setState({
			loader: false
		});
	}
	render() {
		//NOTE: `this.ciq &&` means "If this.ciq exists, render the component on the next line". This is set up so that the component always gets a valid chart; the chart doesn't exist on construction, only after we inject it into the container.
		return (<div>
			{this.ciq &&
				<UI ciq={this.ciq} />
			}
			<div className="ciq-chart-area">
				{this.ciq &&
					<DrawingToolbarWrapper ciq={this.ciq} />
				}
				<div id="chartContainer" className="chartContainer">
					<div className={this.state.loader ? 'loader' : ''}></div>
					{this.ciq &&
						<Legend ciq={this.ciq} />
					}
				</div>
			</div>
			<div className="ciq-footer">
				{this.ciq &&
					<RangeSelector ciq={this.ciq} />
				}
			</div>
		</div>);
	}
}


