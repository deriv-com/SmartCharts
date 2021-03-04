/* eslint-disable max-classes-per-file */
/* eslint-disable react/sort-comp,react/no-multi-comp */
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import debounce from 'lodash.debounce';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Scroll.jsx' was resolved to '/Users/bala... Remove this comment to see the full error message
import Scroll from './Scroll.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons.jsx' was resolved to '/Users/balak... Remove this comment to see the full error message
import { ArrowIcon, InputNumberPlusIcon, InputNumberMinusIcon, CheckboxIcon, CheckboxActiveIcon } from './Icons.jsx';
import '../../sass/components/_form.scss';

export const FormGroup = ({
    title,
    type,
    children,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className={`form__group ${type ? `form__group--${type}` : ''}`}>
        {title && (
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div className='form__label'>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <span> {title} </span>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        )}
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <div className='form__control'>{children}</div>
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);

export const Checkbox = ({
    id,
    label,
    checked,
    disabled,
    onChange,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <span onClick={() => onChange(!checked)}>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <label
            htmlFor={id}
            className={`sc-checkbox ${checked ? 'sc-checkbox--checked' : ''} ${
                disabled ? 'sc-checkbox--disabled' : ''
            }`}
        >
            {checked ? (
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <CheckboxActiveIcon className='sc-checkbox__box' />
            ) : (
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <CheckboxIcon className='sc-checkbox__box' />
            )}
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <span className='sc-checkbox__label'>{label}</span>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </label>
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </span>
);

export const Slider = ({
    min = 1,
    max = 10,
    step = 1,
    value,
    onChange,
}: any) => {
    const activeWidth = React.useMemo(() => {
        const barWidth = 238; // css hardcode
        const width = Math.round((barWidth * (value - min)) / (max - min));
        return width < 0 ? 0 : width;
    }, [value, min, max]);

    const handleChange = React.useCallback((el: any) => onChange(el.currentTarget.value), [onChange]);

    return (
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className='sc-slider'>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='sc-slider-range'>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className='sc-slider-bar' />
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className='sc-slider-active-bar' style={{ width: activeWidth }} />
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <input type='range' min={min} max={max} step={step} onChange={handleChange} value={value} />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='value'>{value}</div>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    );
};

export const DropDown = ({
    subtitle,
    rows,
    children,
    value,
    onRowClick,
    className,
}: any) => {
    const [open, setOpen] = React.useState(false);
    const [top, setTop] = React.useState(0);
    const [left, setLeft] = React.useState(0);
    const [width, setWidth] = React.useState(null);
    const innerRef = React.useRef();
    const innerTitleRef = React.useRef();

    const handleClick = React.useCallback(() => {
        const bounding = innerRef.current.getBoundingClientRect();
        setTop(!open ? bounding.top : null);
        setLeft(!open ? bounding.left : null);
        setWidth(bounding.width);
        setOpen((prevState: any) => !prevState);
    }, [open, innerRef]);
    const handleClose = React.useCallback(
        (e: any) => {
            if (e.target !== innerTitleRef.current) {
                setOpen(false);
                setTop(0);
                setLeft(0);
            }
        },
        [innerTitleRef]
    );

    React.useEffect(() => {
        document.addEventListener('click', handleClose, false);
        return () => {
            document.removeEventListener('click', handleClose);
        };
    }, [handleClose]);

    return (
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div
            className={classNames(className, 'sc-dropdown', { active: open })}
            ref={innerRef}
            style={{ left, top, width }}
        >
            {!!subtitle && (
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div className='subtitle'>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <span>{subtitle}</span>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            )}
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className={classNames('value', { active: open })} onClick={handleClick} ref={innerTitleRef}>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <span className='text'>{value}</span>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <ArrowIcon />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Scroll autoHide height={`${open ? '200px' : '1px'}`} className={classNames('dropdown', { active: open })}>
                {rows.map((row: any, idx: any) => (
                    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <div
                        key={idx} // eslint-disable-line react/no-array-index-key
                        className={classNames('row', { 'row--selected': row === value })}
                        onClick={() => onRowClick && onRowClick(row)}
                    >
                        {children(row)}
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    </div>
                ))}
            </Scroll>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    );
};

export const Pattern = ({
    pattern,
    subtitle,
    lineWidth,
    onChange,
    onActive,
}: any) => {
    const patterns = [
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
    const getValue = () =>
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        pattern !== 'none' ? <span className={`option ${pattern}-${lineWidth}`} /> : <span className='none'>None</span>;

    return (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <DropDown rows={patterns} value={getValue()} onActive={onActive} onRowClick={onChange} subtitle={subtitle}>
            {(p: any) => p.pattern !== 'none' ? (
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <span className={`option ${p.pattern}-${p.width}`} />
            ) : (
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <span className='none'>None</span>
            )
            }
        </DropDown>
    );
};

export const ColorPicker = ({
    subtitle,
    color,
    theme,
    setColor,
}: any) => {
    const colorMap = [
        [
            '#ffffff',
            '#e1e1e1',
            '#cccccc',
            '#b7b7b7',
            '#a0a0a5',
            '#898989',
            '#707070',
            '#626262',
            '#555555',
            '#464646',
            '#363636',
            '#262626',
            '#1d1d1d',
            '#000000',
        ],
        [
            '#f4977c',
            '#f7ac84',
            '#fbc58d',
            '#fff69e',
            '#c4de9e',
            '#85c99e',
            '#7fcdc7',
            '#75d0f4',
            '#81a8d7',
            '#8594c8',
            '#8983bc',
            '#a187bd',
            '#bb8dbe',
            '#f29bc1',
        ],
        [
            '#ef6c53',
            '#f38d5b',
            '#f8ae63',
            '#fff371',
            '#acd277',
            '#43b77a',
            '#2ebbb3',
            '#00bff0',
            '#4a8dc8',
            '#5875b7',
            '#625da6',
            '#8561a7',
            '#a665a7',
            '#ee6fa9',
        ],
        [
            '#ea1d2c',
            '#ee652e',
            '#f4932f',
            '#fff126',
            '#8ec648',
            '#00a553',
            '#00a99c',
            '#00afed',
            '#0073ba',
            '#0056a4',
            '#323390',
            '#66308f',
            '#912a8e',
            '#e9088c',
        ],
        [
            '#9b0b16',
            '#9e4117',
            '#a16118',
            '#c6b920',
            '#5a852d',
            '#007238',
            '#00746a',
            '#0077a1',
            '#004c7f',
            '#003570',
            '#1d1762',
            '#441261',
            '#62095f',
            '#9c005d',
        ],
        [
            '#770001',
            '#792e03',
            '#7b4906',
            '#817a0b',
            '#41661e',
            '#005827',
            '#005951',
            '#003b5c',
            '#001d40',
            '#000e35',
            '#04002c',
            '#19002b',
            '#2c002a',
            '#580028',
        ],
    ];
    const [open, setOpen] = React.useState(false);
    const [top, setTop] = React.useState(0);
    const [left, setLeft] = React.useState(0);
    const [width, setWidth] = React.useState(null);
    const innerRef = React.useRef();
    const innerTitleRef = React.useRef();

    const backgroundColor = React.useMemo(() => {
        if (color !== 'auto') return color;
        return theme === 'light' ? '#000000' : '#ffffff';
    }, [color, theme]);

    const handleClick = React.useCallback(() => {
        const bounding = innerRef.current.getBoundingClientRect();
        setTop(!open ? bounding.top : null);
        setLeft(!open ? bounding.left : null);
        setWidth(bounding.width);
        setOpen((prevState: any) => !prevState);
    }, [open, innerRef]);
    const handleClose = React.useCallback(
        (e: any) => {
            if (e.target !== innerTitleRef.current) {
                setOpen(false);
                setTop(0);
                setLeft(0);
            }
        },
        [innerTitleRef]
    );

    React.useEffect(() => {
        document.addEventListener('click', handleClose, false);
        return () => {
            document.removeEventListener('click', handleClose);
        };
    }, [handleClose]);

    return (
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div ref={innerRef} className={classNames('sc-color-picker', { active: open })} style={{ top, left, width }}>
            {!!subtitle && (
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div className='subtitle'>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <span>{subtitle}</span>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            )}
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='value' onClick={handleClick} ref={innerTitleRef}>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className='sc-input-color' style={{ backgroundColor }} />
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <ArrowIcon />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className={classNames('dropdown', { open })}>
                {colorMap.map((row, rowIdx) => (
                    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <div key={rowIdx /* eslint-disable-line react/no-array-index-key */} className='row'>
                        {row.map(tileColor => (
                            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                            <div
                                key={tileColor}
                                className='tile-color'
                                style={{ backgroundColor: tileColor }}
                                onClick={() => setColor(tileColor)}
                            />
                        ))}
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    </div>
                ))}
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    );
};

export const Switch = ({
    value,
    onChange,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className={`sc-switch ${value ? 'on' : 'off'}`} onClick={() => onChange(!value)}>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <div className='handle' />
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);

export const SwitchIcon = ({
    id,
    label,
    value,
    onChange,
    noramIcon,
    activeIcon,
}: any) => {
    const Icon = value ? activeIcon : noramIcon;
    return (
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className='sc-switch-icon'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Icon className='sc-switch-icon__icon' />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='sc-switch-icon__description'>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <Checkbox id={id} label={label} checked={value} onChange={onChange} />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    );
};

// NumericInput fires onChange on Enter or onBlur
export const NumericInput = ({
    subtitle,
    onChange,
    min,
    max,
    step,
    value,
}: any) => {
    const [innerValue, setInnerValue] = React.useState(false);

    const handleFireOnChange = debounce(
        () => {
            const setAndChange = (val: any) => {
                setInnerValue(val);
                onChange(val);
            };
            if (max !== undefined && innerValue > max) {
                setAndChange(max);
            } else if (min !== undefined && innerValue < min) {
                setAndChange(min);
            } else {
                onChange(innerValue);
            }
        },
        300,
        { leading: true, trailing: false }
    );

    const handleUpdateValue = (e: any) => {
        e.persist();
        setInnerValue(e.target.value);
    };

    const handleFireOnEnter = (e: any) => {
        if (['e', '+', 'E'].includes(e.key)) {
            e.preventDefault();
        }
        if (e.key === 'Enter') {
            handleFireOnChange();
        }
    };

    const onIncrease = () => {
        setInnerValue((prevState: any) => prevState + 1);
        handleFireOnChange();
    };
    const onDecrease = () => {
        setInnerValue((prevState: any) => prevState - 1);
        handleFireOnChange();
    };

    React.useEffect(() => {
        setInnerValue(value);
    }, [value]);

    return (
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className='sc-numeric-input'>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <input
                type='number'
                value={innerValue}
                onBlur={handleFireOnChange}
                onChange={handleUpdateValue}
                onKeyPress={handleFireOnEnter}
                min={min}
                max={max}
                step={step}
            />
            {!!subtitle && (
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div className='subtitle'>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <span>{subtitle}</span>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            )}
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='sc-numeric-input-buttons'>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <InputNumberPlusIcon onClick={onIncrease} />
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <InputNumberMinusIcon onClick={onDecrease} />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    );
};

export const NumberColorPicker = ({
    value,
    theme,
    onChange,
    onActive,
}: any) => {
    // Do NOT rename the variables Value and Color! The keys are also
    // used as attribute suffixes
    const { Value, Color } = value;
    const onValueChange = (v: any) => onChange({ Color, Value: v });
    const onColorChange = (c: any) => onChange({ Color: c, Value });

    return (
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <span className='sc-numbercolorpicker'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <NumericInput value={Value} subtitle={t.translate('Size')} onChange={(val: any) => onValueChange(val)} />
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <ColorPicker
                color={Color}
                theme={theme}
                onActive={onActive}
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                subtitle={t.translate('Color')}
                setColor={(val: any) => onColorChange(val)}
            />
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </span>
    );
};

export const Toggle = ({
    className,
    children,
    active,
    onChange,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div onClick={() => onChange(!active)} className={`${className || ''} ${active ? 'active' : ''} sc-toggle`}>
        {children}
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);

export const FontSetting = ({
    onChange,
    value,
}: any) => {
    const families = ['Default', 'Helvetica', 'Courier', 'Garamond', 'Palatino', 'Times New Roman'];
    const fontSizes = [8, 10, 12, 13, 14, 16, 20, 28, 36, 48, 64];

    const fireChange = (change: any) => onChange({ ...value, ...change });
    const onFontFamilyChange = (family: any) => fireChange({ family });
    const onFontSizeChange = (size: any) => fireChange({ size: `${size}px` });
    const onBoldChange = (isBold: any) => fireChange({ weight: isBold ? 'bold' : undefined });
    const onItalicChange = (isItalic: any) => fireChange({ style: isItalic ? 'italic' : undefined });
    const { family, style, weight, size } = value;

    return (
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <span className='sc-fontsetting'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Toggle onChange={onBoldChange} active={!!weight}>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className='sc-text-icon'>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <b>B</b>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            </Toggle>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Toggle active={!!style} onChange={onItalicChange}>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className='sc-text-icon'>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <i>i</i>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            </Toggle>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <DropDown
                className='sc-changefontsize'
                rows={fontSizes}
                title={size || '13px'}
                onRowClick={onFontSizeChange}
            >
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                {(p: any) => <span className='option'>{p}</span>}
            </DropDown>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <DropDown
                className='sc-changefontfamily'
                rows={families}
                title={family || families[0]}
                onRowClick={onFontFamilyChange}
            >
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                {(p: any) => <span className='option'>{p}</span>}
            </DropDown>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </span>
    );
};
