import React from 'react';
import ReactSlider from 'react-slider';
import '../../sass/_ciq-form.scss';

// TODO: Add mobile support.

export const Slider = ({
    min = 1,
    max = 10,
    step = 1,
    value,
    className = '',
    onChange,
}) => {
    return (
        <div className='cq-slider'>
            <ReactSlider
                min={min}
                max={max}
                step={step}
                onChange={onChange}
                withBars
            />
            <div className='value'>{value}</div>
        </div>
    );
};

export const Line = ({
    pattern,
    lineWidth,
    setLine,
}) => {
    const patterns = [
        {width: 1, pattern: 'solid'},
        {width: 3, pattern: 'solid'},
        {width: 5, pattern: 'solid'},
        {width: 1, pattern: 'dotted'},
        {width: 3, pattern: 'dotted'},
        {width: 5, pattern: 'dotted'},
        {width: 1, pattern: 'dashed'},
        {width: 3, pattern: 'dashed'},
        {width: 5, pattern: 'dashed'},
        {width: 0, pattern: 'none'},
    ];
    return (
        <div className='cq-line'>
            <div className='title'>
                {pattern !== 'none' ?
                    <span className={`option ${pattern}-${lineWidth}`}></span> :
                    <span className='none'>None</span>
                }
            </div>
            <div className='dropdown'>
                { patterns.map((p, idx) => (
                    <div
                        key={idx}
                        onClick={() => setLine(p)}
                        className='parent'
                    >
                        {p.pattern !== 'none' ?
                            <span className={`option ${p.pattern}-${p.width}`}></span> :
                            <span className='none'>None</span>
                        }
                    </div>
                ))}
            </div>
        </div>
    );
};

export const DropDown = ({
    open,
    rows,
    children,
    title,
    onRowClick,
}) => (
    <div className='cq-dropdown'>
        <div className='title'>{title}</div>
        <div className={`dropdown ${open ? 'active' : ''}`}>
            {rows.map((row, rowIdx) => (
                <div
                    key={rowIdx}
                    className='row'
                    onClick={() => onRowClick && onRowClick(row)}
                >
                    {children(row)}
                </div>
            ))}
        </div>
    </div>
);

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
    onClick = () => this.setState({open: !this.state.open});
    close = (e) => {
        if(e.target !== this.titleRef) {
            this.setState({open: false});
        }
    }

    componentDidMount() { document.addEventListener('click', this.close, false); }
    componentWillUnmount() { document.removeEventListener('click', this.close); }

    render() {
        const { color, setColor } = this.props;
        return (
            <div className='cq-color-picker'>
                <div
                    ref={ref => this.titleRef = ref}
                    className='title'
                    style={{backgroundColor: color}}
                    onClick={this.onClick}
                />
                <div className={`dropdown ${this.state.open ? 'open' : ''}`}>
                    {this.colorMap.map((row, rowIdx) => (
                        <div key={rowIdx} className='row'>
                            {row.map((tileColor, idx) => (
                                <div
                                    key={idx}
                                    className='tile-color' style={{ backgroundColor: tileColor }}
                                    onClick={() => setColor(tileColor)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

};

export const Switch = ({
    value,
    onChange,
}) => (
    <div
        className={`cq-switch ${value ? 'on' : 'off'}`}
        onClick={() => onChange(!value)}
    >
        <div className='handle' />
    </div>
);
