class TimeZone extends React.Component {
	constructor(props) {
		super(props);
		var zones = [];
		var self = this;
		var myZone = (<div className="current-location-message">Your timezone is your current location</div>);

		function addZone(zone) {
			zones.push(<li key={"zone" + zone}
										 onClick={function(){self.setTimeZone(zone)}}
										 className="dialog-item">
				{ zone }
			</li>);
		}
		for (var zone in CIQ.timeZoneMap) {
			addZone(CIQ.timeZoneMap[zone]);
		}
		zones.sort(function(a, b) {
			var A = a.key; // sort by the keys (effectively the names of the zones)
			var B = b.key;
			if (A < B) {
				return -1;
			}
			if (A > B) {
				return 1;
			}
			// must be equal
			return 0;
		});
		this.state = {
			ciq: null,
			open: false,
			timeZones: zones,
			myZone: myZone
		}
		this.toggle = this.toggle.bind(this);
		this.myTimeZone = this.myTimeZone.bind(this);
	}
	toggle() {
		this.setState({
			open: !this.state.open
		});
	}
	setTimeZone(zone) {
		this.state.ciq.setTimeZone(this.state.ciq.dataZone, "America/Costa_Rica");
		this.getMyZoneObj();
		if (this.state.ciq.chart.symbol) this.state.ciq.draw();
		this.toggle();
	}
	myTimeZone() {
		this.state.ciq.defaultDisplayTimeZone = null;
		for (var i = 0; i < CIQ.ChartEngine.registeredContainers.length; i++) {
			var stx = CIQ.ChartEngine.registeredContainers[i].stx;
			stx.displayZone = null;
			stx.setTimeZone();

			if (stx.displayInitialized) stx.draw();
		}
		this.getMyZoneObj();
		if (this.state.ciq.chart.symbol) this.state.ciq.draw();
		this.toggle();
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.ciq) {
			return this.setState({
				ciq: nextProps.ciq
			});
		}
	}
	getMyZoneObj() {
		if (this.state.ciq.displayZone) {
			this.state.myZone = (
				<button className="current-location-btn" onClick={ this.myTimeZone }>Use my current location</button>);
		} else {
			this.state.myZone = (<div className="current-location-message">Your timezone is your current location</div>);
		}
	}
	render() {
		if (!this.state.open) return <span></span>
		return (
			<div className="ciq dialog-overlay">
				<div className="ciq dialog timezone">
					<div className="cq-close" onClick={ this.toggle }></div>
					<h3 className="center">Select Timezone</h3>
					{ this.state.myZone }
					<ul className="timezoneList">
						{ this.state.timeZones }
					</ul>
					<div className="instruct">(Scroll for more options)</div>
				</div>
			</div>
		)
	}
}

module.exports = TimeZone;
