
var colorPickerColors = [
	"ffffff", "ffd0cf", "ffd9bb", "fff56c", "eaeba3", "d3e8ae", "adf3ec", "ccdcfa", "d9c3eb",
	"efefef", "eb8b87", "ffb679", "ffe252", "e2e485", "c5e093", "9de3df", "b1c9f8", "c5a6e1",
	"cccccc", "e36460", "ff9250", "ffcd2b", "dcdf67", "b3d987", "66cac4", "97b8f7", "b387d7",
	"9b9b9b", "dd3e39", "ff6a23", "faaf3a", "c9d641", "8bc176", "33b9b0", "7da6f5", "9f6ace",
	"656565", "b82c0b", "be501b", "e99b54", "97a030", "699158", "00a99d", "5f7cb8", "784f9a",
	"343434", "892008", "803512", "ab611f", "646c20", "46603a", "007e76", "3e527a", "503567",
	"000000", "5c1506", "401a08", "714114", "333610", "222f1d", "00544f", "1f2a3c", "281a33"
];

class ColorPicker extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			open: false,
			onColorPick: null,
			top: 0,
			left: 0
		}
	}
	setColor(color) {
		if (this.state.onColorPick) {
			this.state.onColorPick(color)
		}
		this.closeDialog();

	}
	openDialog(top, left, callback) {
		this.setState({
			open: true,
			top: top,
			left: left,
			onColorPick: callback
		});
	}
	closeDialog() {
		this.setState({
			open: false
		});
	}
	render() {
		var self = this;
		var colorEls = colorPickerColors.map(function(color, index) {
			return <li key={"color" + index}><a href="#" title={color} onClick={function() {
				self.setColor(color);
			}}style={{
				background: "#" + color
			}}>{color}</a></li>

		});
		return (
			<div id="colorPicker">
				<div className="color-picker-options"
						 style={ {
							 'top': this.state.top,
							 'left': this.state.left,
							 'display': this.state.open ? 'block' : 'none'
						 }}><ul>{colorEls}</ul></div>
			</div>
		)
	}
}

module.exports = ColorPicker;
