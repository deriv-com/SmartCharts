import { ChartStore, Actions } from "../stores/ChartStore";
import DrawingToolbar from './DrawingToolbar';
export default class DrawingToolbarWrapper extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: ChartStore.getToolbarStatus()
        };
        this.ciq = props.ciq;
		this.onStoreChange = this.onStoreChange.bind(this);
	}
	onStoreChange() {
		this.setState({ active: ChartStore.getToolbarStatus() });
		var elem = document.getElementById("chartContainer");
		if (ChartStore.getToolbarStatus()) {
			//resize the chart based on if the toolbar is now open or closed
			elem.className += " toolbarOn";
		}
		else {
			elem.classList.remove("toolbarOn");
			this.ciq.changeVectorType('');
		}
		this.ciq.draw();
	}
	componentWillMount() {
		ChartStore.addListener(["drawingToolbarChange"], this.onStoreChange);
	}
	componentWillUnmount() {
		ChartStore.removeListener(["drawingToolbarChange"], this.onStoreChange);
		// This will remove the quoteDriver, styles and
		// eventListeners for this ChartEngine instance.
		this.ciq.destroy();
	}
	render() {
		if (!this.state.active) { return <span></span>; }
		return (
			<span><DrawingToolbar ciq={this.ciq} /></span>
		);
	}
}