/* eslint-disable react/sort-comp,react/no-multi-comp */
import React from 'react';
import ReactSlider from './Slider.jsx';
import { ArrowIcon } from './Icons.jsx';
import '../../sass/components/_ciq-form.scss';

export const Slider = ({
    min = 1,
    max = 10,
    step = 1,
    value,
    onChange,
}) => (
    <div className="cq-slider">
        <ReactSlider
            min={min}
            max={max}
            step={step}
            onChange={onChange}
            value={value}
            withBars
        />
        <div className="value">{value}</div>
    </div>
);

export class DropDown extends React.Component {
    state = { open: false };
    titleRef = null;
    onClick = () => this.setState({ open: !this.state.open });
    close = (e) => {
        if (e.target !== this.titleRef) {
            this.setState({ open: false });
        }
    }

    componentDidMount() { document.addEventListener('click', this.close, false); }
    componentWillUnmount() { document.removeEventListener('click', this.close); }

    render() {
        const {
            rows, children, title, onRowClick, className,
        } = this.props;
        const { open } = this.state;
        return (
            <div className={`${className || ''} cq-dropdown`}>
                <div
                    className={`title ${open ? 'active' : ''}`}
                    onClick={this.onClick}
                    ref={(ref) => { this.titleRef = ref; }}
                >
                    {title}
                    <ArrowIcon />
                </div>
                <div className={`dropdown ${open ? 'active' : ''}`}>
                    {rows.map((row, idx) => (
                        <div
                            key={idx} // eslint-disable-line react/no-array-index-key
                            className="row"
                            onClick={() => onRowClick && onRowClick(row)}
                        >
                            {children(row)}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export class Pattern extends React.Component {
    patterns = [
        { width: 1, pattern: 'solid' },
        { width: 3, pattern: 'solid' },
        { width: 5, pattern: 'solid' },
        { width: 1, pattern: 'dotted' },
        { width: 3, pattern: 'dotted' },
        { width: 5, pattern: 'dotted' },
        { width: 1, pattern: 'dashed' },
        { width: 3, pattern: 'dashed' },
        { width: 5, pattern: 'dashed' },
        { width: 0, pattern: 'none' },
    ];
    render() {
        const { pattern, lineWidth, onChange } = this.props;
        const title = pattern !== 'none'
            ? <span className={`option ${pattern}-${lineWidth}`} />
            : <span className="none">None</span>;

        return (
            <DropDown
                rows={this.patterns}
                title={title}
                onRowClick={onChange}
            >
                {p => (p.pattern !== 'none'
                    ? <span className={`option ${p.pattern}-${p.width}`} />
                    : <span className="none">None</span>)
                }
            </DropDown>
        );
    }
}

export class ColorPicker extends React.Component {
    colorMap = [
        ['#ffffff', '#e1e1e1', '#cccccc', '#b7b7b7', '#a0a0a5', '#898989', '#707070',
            '#626262', '#555555', '#464646', '#363636', '#262626', '#1d1d1d', '#000000'],
        ['#f4977c', '#f7ac84', '#fbc58d', '#fff69e', '#c4de9e', '#85c99e', '#7fcdc7',
            '#75d0f4', '#81a8d7', '#8594c8', '#8983bc', '#a187bd', '#bb8dbe', '#f29bc1'],
        ['#ef6c53', '#f38d5b', '#f8ae63', '#fff371', '#acd277', '#43b77a', '#2ebbb3',
            '#00bff0', '#4a8dc8', '#5875b7', '#625da6', '#8561a7', '#a665a7', '#ee6fa9'],
        ['#ea1d2c', '#ee652e', '#f4932f', '#fff126', '#8ec648', '#00a553', '#00a99c',
            '#00afed', '#0073ba', '#0056a4', '#323390', '#66308f', '#912a8e', '#e9088c'],
        ['#9b0b16', '#9e4117', '#a16118', '#c6b920', '#5a852d', '#007238', '#00746a',
            '#0077a1', '#004c7f', '#003570', '#1d1762', '#441261', '#62095f', '#9c005d'],
        ['#770001', '#792e03', '#7b4906', '#817a0b', '#41661e', '#005827', '#005951',
            '#003b5c', '#001d40', '#000e35', '#04002c', '#19002b', '#2c002a', '#580028'],
    ];
    state = { open: false };
    titleRef = null;
    onClick = () => this.setState({ open: !this.state.open });
    close = (e) => {
        if (e.target !== this.titleRef) {
            this.setState({ open: false });
        }
    };

    componentDidMount() { document.addEventListener('click', this.close, false); }
    componentWillUnmount() { document.removeEventListener('click', this.close); }

    render() {
        const { color, setColor } = this.props;
        const backgroundColor = color === 'auto' ? '#000000' : color;

        return (
            <div className="cq-color-picker">
                <div
                    ref={(ref) => { this.titleRef = ref; }}
                    className="title"
                    style={{ backgroundColor }}
                    onClick={this.onClick}
                />
                <div className={`dropdown ${this.state.open ? 'open' : ''}`}>
                    {this.colorMap.map((row, rowIdx) => (
                        <div key={rowIdx /* eslint-disable-line react/no-array-index-key */} className="row">
                            {row.map(tileColor => (
                                <div
                                    key={tileColor}
                                    className="tile-color"
                                    style={{ backgroundColor: tileColor }}
                                    onClick={() => setColor(tileColor)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export const Switch = ({
    value,
    onChange,
}) => (
    <div
        className={`cq-switch ${value ? 'on' : 'off'}`}
        onClick={() => onChange(!value)}
    >
        <div className="handle" />
    </div>
);

// NumericInput fires onChange on Enter or onBlur
export class NumericInput extends React.Component {
    state = {};

    componentWillMount() {
        const { value } = this.props;
        this.setState({
            originalValue: value,
            value,
        });
    }

    componentWillReceiveProps(newProps) {
        const { value } = newProps;
        if (value !== this.state.originalValue) {
            this.setState({
                originalValue: value,
                value,
            }, this.fireOnChange);
        }
    }

    fireOnChange = () => {
        const { min, max, onChange } = this.props;
        const setAndChange = val => this.setState({ value: val }, () => onChange(this.state.value));
        if (max !== undefined && this.state.value > max) {
            setAndChange(max);
        } else if (min !== undefined && this.state.value < min) {
            setAndChange(min);
        } else {
            onChange(this.state.value);
        }
    };

    onUpdateValue = (e) => {
        this.setState({ value: e.target.value });
    };

    fireOnEnter = (e) => {
        if (e.key === 'Enter') {
            this.fireOnChange();
        }
    };

    render() {
        const { min, max, step } = this.props;
        return (
            <input
                type="number"
                value={this.state.value}
                onBlur={this.fireOnChange}
                onChange={this.onUpdateValue}
                onKeyPress={this.fireOnEnter}
                min={min}
                max={max}
                step={step}
            />
        );
    }
}

export const NumberColorPicker = ({
    value,
    onChange,
}) => {
    // Do NOT rename the variables Value and Color! The keys are also
    // used as attribute suffixes
    const { Value, Color } = value;
    const onValueChange = v => onChange({ Color,    Value: v });
    const onColorChange = c => onChange({ Color: c, Value    });

    return (
        <span className="cq-numbercolorpicker">
            <NumericInput
                value={Value}
                onChange={val => onValueChange(val)}
            />
            <ColorPicker
                color={Color}
                setColor={val => onColorChange(val)}
            />
        </span>
    );
};

export const Toggle = ({
    className,
    children,
    active,
    onChange,
}) => (
    <div
        onClick={() => onChange(!active)}
        className={`${className || ''} ${active ? 'active' : ''} cq-toggle`}
    >
        {children}
    </div>
);

export const FontSetting = ({
    onChange,
    value,
}) => {
    const families = [
        'Default',
        'Helvetica',
        'Courier',
        'Garamond',
        'Palatino',
        'Times New Roman',
    ];
    const fontSizes = [8, 10, 12, 13, 14, 16, 20, 28, 36, 48, 64];

    const fireChange = change => onChange({ ...value, ...change });
    const onFontFamilyChange = family => fireChange({ family });
    const onFontSizeChange = size => fireChange({ size: `${size}px` });
    const onBoldChange = isBold => fireChange({ weight: isBold ? 'bold' : undefined });
    const onItalicChange = isItalic => fireChange({ style: isItalic ? 'italic' : undefined });
    const {
        family, style, weight, size,
    } = value;

    return (
        <span className="cq-fontsetting">
            <Toggle
                onChange={onBoldChange}
                active={!!weight}
            >
                <div className="cq-text-icon"><b>B</b></div>
            </Toggle>
            <Toggle
                active={!!style}
                onChange={onItalicChange}
            >
                <div className="cq-text-icon"><i>i</i></div>
            </Toggle>
            <DropDown
                className="cq-changefontsize"
                rows={fontSizes}
                title={size || '13px'}
                onRowClick={onFontSizeChange}
            >
                {p => <span className="option">{p}</span>}
            </DropDown>
            <DropDown
                className="cq-changefontfamily"
                rows={families}
                title={family || families[0]}
                onRowClick={onFontFamilyChange}
            >
                {p => <span className="option">{p}</span>}
            </DropDown>
        </span>
    );
};
