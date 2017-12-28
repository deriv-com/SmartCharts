import ColorPicker from "./ColorPicker"

class StudyModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			studyHelper: {},
			outputs: {},
			inputs: {},
			parameters: {}
		};
		this.updateStudy = this.updateStudy.bind(this);
		this.updateInputs = this.updateInputs.bind(this);
		this.close = this.close.bind(this);
	}
	open(params) {
		var studyHelper = new CIQ.Studies.DialogHelper(params);
		this.setState({
			open: true,
			studyHelper: studyHelper,
			outputs: studyHelper.outputs,
			inputs: studyHelper.inputs,
			params: studyHelper.parameters
		});
	}
	close() {
		this.setState({
			open: false
		});
	}
	updateStudy() {
		var currentInputs = {};
		var currentOutputs = {};
		var currentParams = {};
		for (var i = 0; i < this.state.inputs.length; i++) {
        currentInputs[this.state.inputs[i].name]=this.state.inputs[i].value;
		}
		for (var x = 0; x < this.state.outputs.length; x++) {
			currentOutputs[this.state.outputs[x].name] = this.state.outputs[x].color;
		}
		for (var y = 0; y < this.state.params.length; y++) {
			currentParams[this.state.params[y].name + 'Value'] = this.state.params[y].value;
			currentParams[this.state.params[y].name + 'Color'] = this.state.params[y].color;
		}

		this.state.studyHelper.updateStudy({ inputs: currentInputs, outputs: currentOutputs, parameters: currentParams });
		this.close();
	}
	updateInputs = (name, target) => {
		for (let input of this.state.inputs) {
			if (input.type === "checkbox") {
				input.value = target.checked;
				break;
			}
			if (input.name === name) {
				input.value = target.value;
				break;
			}
		}
		this.forceUpdate();
	};
	createSelectInput(input) {
		var inputOptions = [];
		for (var option in input.options) {
			inputOptions.push(<option key={"option" + option}>
				{option}
			</option>)
		}
		return <div key={"select" + input.heading} className="inputs dialog-item">
			<select defaultValue={input.value} onChange={event => {
				this.updateInputs(input.name, event.target);
			}}>
				{inputOptions}
			</select>
			<div>
				{input.heading}
			</div>
		</div>

	}
	createCheckboxInput(input) {
		return <div key={"checkbox" + input.name} className="inputs dialog-item">
			<input type="checkbox" checked={input.value}
				onChange={event => {
					this.updateInputs(input.name, event.target);
				}}></input>
			<div>
				{input.heading}
			</div>
		</div>
	}
	createOtherInput(input, type) {
		return <div key={type + input.name} className="inputs dialog-item">
			<input type={type} defaultValue={input.value}
				onChange={event => {
					this.updateInputs(input.name, event.target);
				}}></input>
			<div>
				{input.heading}
			</div>
		</div>
	}
	openColorPicker(output, target) {
		var self = this;

		var targetBounds = target.getBoundingClientRect();

		this.refs.colorPicker.openDialog(targetBounds.top, targetBounds.left, function (color) {
			output.color = CIQ.hexToRgba('#' + color);
			self.forceUpdate();
		})
	}
	render() {
		var self = this;

		if (!this.state.open || !this.state.studyHelper) return <span></span>
		var inputs = this.state.inputs.map(function (input, index) {
			if (input.type === "select") return self.createSelectInput(input);
			if (input.type === "checkbox") return self.createCheckboxInput(input);
			return self.createOtherInput(input, input.type);
		});

		var outputs = this.state.outputs.map(function (output, index) {
			return <div key={"output" + index} className="outputs dialog-item">
				{output.color ? <div style={{ "backgroundColor": output.color }} className="color-picker-swatch output"
					onClick={function (event) {
						self.openColorPicker(output, event.target);
					}}></div> : <div></div>}
				<div>
					{output.heading}
				</div>
			</div>
		});
		var params = this.state.params.map(function (param, index) {
			return <div>
				{param.color ? <div style={{ "backgroundColor": param.color }} className="color-picker-swatch param"
					onClick={function (event) {
						self.openColorPicker(param, event.target);
					}}></div> : <div></div>}
				<input type={param.name === "studyOverZones" ? "checkbox" : "number"}></input>
				<div>{param.heading}</div>
			</div>
		});

		return (
			<div className="dialog-overlay" id="studyDialog">
				<ColorPicker ref="colorPicker" />
				<div className="dialog">
					<div className="cq-close" onClick={this.close}></div>
					<h3>
						{this.state.studyHelper ? this.state.studyHelper.title : ""}
					</h3>
					<div id="inputs">
						{inputs}
					</div>
					<div id="outputs">
						{outputs}
					</div>
					<div id="parameters">
						<div className="parameters dialog-item">
							{params}
						</div>
					</div>
					<button className="pull-right" onClick={this.updateStudy}>Save</button>
				</div>
			</div>
		)
	}
}

module.exports = StudyModal;
