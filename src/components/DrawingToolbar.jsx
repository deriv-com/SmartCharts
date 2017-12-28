import ColorPicker from "./ColorPicker"

class DrawingToolbar extends React.Component {
	constructor(props) {
		super(props);
		var tools = CIQ.Drawing.getDrawingToolList({});
		var toolsArray=Object.keys(tools).map(function (key) {
			return tools[key];
		});
		this.state = {
			launchToolbar:false,
			arrOfTools:toolsArray.sort(),
			toolParams:false,
			selectedTool:false,
		}
	}
	toTitleCase(str) {
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
	setTool(tool){
		if(tool=='annotation' || tool=='callout'){ // no need to do this every time
			// Sync the defaults for font tool
			var style = this.props.ciq.canvasStyle("stx_annotation");

      this.props.ciq.currentVectorParameters.annotation.font.size=style.fontSize;
      this.props.ciq.currentVectorParameters.annotation.font.family=style.fontFamily;
      this.props.ciq.currentVectorParameters.annotation.font.style=style.fontStyle;
      this.props.ciq.currentVectorParameters.annotation.font.weight=style.fontWeight;
		}
		// Set all the info for the toolbar
		this.setState({
			selectedTool:this.toTitleCase(tool),
			toolParams:CIQ.Drawing.getDrawingParameters(this.props.ciq, tool)
		});
		// Activate the tool
		this.props.ciq.changeVectorType(tool);
	}
	render() {
		var self = this;
		var options = this.state.arrOfTools.map(function (item, index) {
			return <menu-option key={"tool" + index} className="option" onClick={function () {
				self.setTool(item);
			}}>{self.toTitleCase(item)}</menu-option>
		});
		return (
			<div className="toolbar">
				<menu-select id="toolSelect">
					<span className="title">{this.state.selectedTool || "Select Tool"}</span>
					<menu-select-options className="menu-hover">
						{options}
					</menu-select-options>
				</menu-select>
				<DrawingParameters ciq={this.props.ciq} parameters={this.state.toolParams} />
			</div>
		)
	}
}

class DrawingParameters extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fill:null,
			line:null,
			lineWidth:null,
			linePattern:null,
			parameters:null,
			fontOptions:null,
      fontFamily:null,
      fontSize:null
		};
		this.openColorPicker = this.openColorPicker.bind(this);
		this.updateLineParams = this.updateLineParams.bind(this);
		this.updateFontFamily = this.updateFontFamily.bind(this);
    this.updateFontSize = this.updateFontSize.bind(this);
    this.toggleBold = this.toggleBold.bind(this);
    this.toggleItalic = this.toggleItalic.bind(this);
	}
	componentWillReceiveProps(nextProps) {
	  if(nextProps.parameters.font){
	    this.setState({
        fontOptions: nextProps.parameters.font,
        fontFamily: nextProps.parameters.font.family,
        fontSize: nextProps.parameters.font.size
      });
    }
    else{
      this.setState({
        fontOptions: null,
        fontFamily: null,
        fontSize: null
      });
    }
		if (nextProps.parameters) {
			return this.setState({
				fill:nextProps.parameters.fillColor,
				line:nextProps.parameters.color,
				lineWidth:nextProps.parameters.lineWidth,
				linePattern:nextProps.parameters.pattern,
				parameters: nextProps.parameters
			});
		}
	}
	openColorPicker(target) {
		var targetBounds = target.getBoundingClientRect();
		var self=this;

		this.refs.colorPicker.openDialog(0, targetBounds.left-120, function(color) {
			if(target.classList.contains("line")){
				self.setState({
					line:CIQ.hexToRgba('#' + color)
				});
				self.props.ciq.currentVectorParameters.currentColor='#' + color;
			}
			else if(target.classList.contains("fill")){
				self.setState({
					fill:CIQ.hexToRgba('#' + color)
				});
				self.props.ciq.currentVectorParameters.fillColor='#' + color;
			}
		})
	}
	updateLineParams(weight, pattern){
		this.props.ciq.currentVectorParameters.lineWidth=weight;
		this.props.ciq.currentVectorParameters.pattern=pattern;
	}
	updateFontFamily(newFamily){
	  this.props.ciq.changeVectorParameter("fontFamily", newFamily);
  }
  updateFontSize(newSize){
    this.props.ciq.changeVectorParameter("fontSize", newSize+'px');
  }
  toggleItalic(bool){
    if(bool)
      this.props.ciq.changeVectorParameter("fontStyle", "italic");
    else
      this.props.ciq.changeVectorParameter("fontStyle", "normal");
  }
  toggleBold(bool){
    if(bool)
      this.props.ciq.changeVectorParameter("fontWeight", "bold");
    else
      this.props.ciq.changeVectorParameter("fontWeight", "normal");
  }
	render() {
		if(!this.state.parameters) return <span></span>;
		return(
			<span>
				<div className="drawingParameters">
					<ColorPicker ref="colorPicker"/>
					<FillColor color={this.state.fill} openColorPicker={this.openColorPicker} />
					<LineColor color={this.state.line} openColorPicker={this.openColorPicker} />
					<LineStyle width={this.state.lineWidth} pattern={this.state.linePattern} updateLineParams={this.updateLineParams} />
					<Bold fontOptions={this.state.fontOptions} toggleBold={this.toggleBold} />
					<Italic fontOptions={this.state.fontOptions} toggleItalic={this.toggleItalic} />
					<FontSize fontOptions={this.state.fontOptions} size={this.state.fontSize} updateFontSize={this.updateFontSize} />
					<FontFamily fontOptions={this.state.fontOptions} family={this.state.fontFamily} updateFontFamily={this.updateFontFamily} />
				</div>
			</span>
		)
	}
}

class FillColor extends React.Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	onClick(e) {
		this.props.openColorPicker(e.target);
	}
	render() {
		if(!this.props.color) return <span></span>;
		var activeColor={background: this.props.color};
		return(
			<span><div style={activeColor} className="color-picker-swatch fill" onClick={this.onClick}></div></span>
		)
	}
}

class LineColor extends React.Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}
	onClick(e) {
		this.props.openColorPicker(e.target);
	}
	render() {
		if(!this.props.color) return <span></span>;
		var activeColor=null;
		if(this.props.color=="auto") activeColor={background:"white"};
		else activeColor={background: this.props.color};
		return(
			<span><div style={activeColor} className="color-picker-swatch line" onClick={this.onClick}></div></span>
		)
	}
}

class LineStyle extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedLineClass:"ciq-"+this.props.pattern+"-"+this.props.width,
		};
		this.onClick = this.onClick.bind(this);
	}
	onClick(newClass, newWeight, newPattern) {
		var self=this;
		return function(){
			self.setState({
				selectedLineClass:newClass,
			});
			self.props.updateLineParams(newWeight, newPattern);
		}
	}
	render() {
		if(!this.props.width && !this.props.pattern) return <span></span>;
		return(
			<span>
				<menu-select id="lineSelect">
				<span className={"title " + this.state.selectedLineClass}></span>
				<menu-select-options class="menu-hover">
					<menu-option class="option" onClick={this.onClick('ciq-solid-1', 1, 'solid')}><span className="ciq-line-style-option ciq-solid-1"></span></menu-option>
					<menu-option class="option" onClick={this.onClick('ciq-solid-3', 3, 'solid')}><span className="ciq-line-style-option ciq-solid-3"></span></menu-option>
					<menu-option class="option" onClick={this.onClick('ciq-solid-5', 5, 'solid')}><span className="ciq-line-style-option ciq-solid-5"></span></menu-option>
					<menu-option class="option" onClick={this.onClick('ciq-dotted-1', 1, 'dotted')}><span className="ciq-line-style-option ciq-dotted-1"></span></menu-option>
					<menu-option class="option" onClick={this.onClick('ciq-dotted-3', 3, 'dotted')}><span className="ciq-line-style-option ciq-dotted-3"></span></menu-option>
					<menu-option class="option" onClick={this.onClick('ciq-dotted-5', 5, 'dotted')}><span className="ciq-line-style-option ciq-dotted-5"></span></menu-option>
					<menu-option class="option" onClick={this.onClick('ciq-dashed-1', 1, 'dashed')}><span className="ciq-line-style-option ciq-dashed-1"></span></menu-option>
					<menu-option class="option" onClick={this.onClick('ciq-dashed-3', 3, 'dashed')}><span className="ciq-line-style-option ciq-dashed-3"></span></menu-option>
					<menu-option class="option" onClick={this.onClick('ciq-dashed-5', 5, 'dashed')}><span className="ciq-line-style-option ciq-dashed-5"></span></menu-option>
				</menu-select-options>
			</menu-select>
			</span>
		)
	}
}

class Bold extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.state={
      bold:false
    };
  }
	onClick() {
    var self=this;
    return function(){
      self.setState({
        bold:!self.state.bold
      }, () => {
        self.props.toggleBold(self.state.bold);
      });
    }
	}
	render() {
		if(!this.props.fontOptions) return <span></span>;
		return(
			<span><div className="boldBtn" onClick={this.onClick()}>B</div></span>
		)
	}
}

class Italic extends React.Component{
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.state={
      italic:false
    };
  }
	onClick() {
    var self=this;
    return function(){
      self.setState({
        italic:!self.state.italic
      }, () => {
        self.props.toggleItalic(self.state.italic);
      });
    };
	}
	render() {
		if(!this.props.fontOptions) return <span></span>;
		return(
			<span><div className="italicBtn" onClick={this.onClick()}>I</div></span>
		)
	}
}

class FontSize extends React.Component{
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.fontSizeOptions=[8, 10, 12, 13, 14, 16, 20, 28, 36, 48, 64];
    this.state={
      fontSize:this.props.size
    };
  }
	onClick(newSize) {
    var self=this;
    return function(){
      self.setState({
        fontSize:newSize+'px',
      });
      self.props.updateFontSize(newSize);
    }
	}
	render() {
		if(!this.props.fontOptions) return <span></span>;
    var self=this;
    var fontSizes = this.fontSizeOptions.map(function(option, index) {
      return <menu-option key={"size" + index} onClick={self.onClick(option)}><span>{option}</span></menu-option>
    });
    return(
      <span>
        <menu-select id="fontSizeSelect">
				<span className="title">{this.state.fontSize}</span>
				<menu-select-options class="menu-hover">
          {fontSizes}
				</menu-select-options>
			</menu-select>
      </span>
    )
	}
}

class FontFamily extends React.Component{
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.fontFamilyOptions=["Helvetica", "Courier", "Garamond", "Palatino", "Times New Roman"];
    this.state={
      fontFamily:this.props.family
    };
  }
	onClick(newFamily) {
    var self=this;
    return function(){
      self.setState({
        fontFamily:newFamily
      });
      self.props.updateFontFamily(newFamily);
    }
	}
	render() {
		if(!this.props.fontOptions) return <span></span>;
		var self=this;
    var fontFamilies = this.fontFamilyOptions.map(function(option, index) {
      return <menu-option key={"family" + index} onClick={self.onClick(option)}><span>{option}</span></menu-option>
    });
		return(
			<span>
        <menu-select id="fontFamilySelect">
				<span className="title">{this.state.fontFamily}</span>
				<menu-select-options class="menu-hover">
          {fontFamilies}
				</menu-select-options>
			</menu-select>
      </span>
		)
	}
}

module.exports = DrawingToolbar;
