/* eslint-disable max-classes-per-file */
/* eslint-disable react/sort-comp,react/no-multi-comp */
import React from 'react';
import debounce from 'lodash.debounce';

import classNames from 'classnames';
import Scroll from './Scroll';
import { ArrowIcon, InputNumberPlusIcon, InputNumberMinusIcon, CheckboxIcon, CheckboxActiveIcon } from './Icons';
import '../../sass/components/_form.scss';

type TFormGroupProps = {
    title?: string | null;
    type?: string;
};

export const FormGroup: React.FC<TFormGroupProps> = ({ title, type, children }) => (
    <div className={`form__group ${type ? `form__group--${type}` : ''}`}>
        {title && (
            <div className='form__label'>
                <span> {title} </span>
            </div>
        )}
        <div className='form__control'>{children}</div>
    </div>
);

type TCheckboxProps = {
    id: string;
    label: string;
    checked: boolean;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
};

export const Checkbox: React.FC<TCheckboxProps> = ({ id, label, checked, disabled, onChange }) => (
    <span onClick={() => onChange(!checked)}>
        <label
            htmlFor={id}
            className={`sc-checkbox ${checked ? 'sc-checkbox--checked' : ''} ${
                disabled ? 'sc-checkbox--disabled' : ''
            }`}
        >
            {checked ? (
                <CheckboxActiveIcon className='sc-checkbox__box' />
            ) : (
                <CheckboxIcon className='sc-checkbox__box' />
            )}
            <span className='sc-checkbox__label'>{label}</span>
        </label>
    </span>
);

export const Slider = ({ min = 1, max = 10, step = 1, value, onChange }: any) => {
    const activeWidth = React.useMemo(() => {
        const barWidth = 238; // css hardcode
        const width = Math.round((barWidth * (value - min)) / (max - min));
        return width < 0 ? 0 : width;
    }, [value, min, max]);

    const handleChange = React.useCallback((el: any) => onChange(el.currentTarget.value), [onChange]);

    return (
        <div className='sc-slider'>
            <div className='sc-slider-range'>
                <div className='sc-slider-bar' />
                <div className='sc-slider-active-bar' style={{ width: activeWidth }} />
                <input type='range' min={min} max={max} step={step} onChange={handleChange} value={value} />
            </div>
            <div className='value'>{value}</div>
        </div>
    );
};

export const DropDown = ({ subtitle, rows, children, value, onRowClick, className }: any) => {
    const [open, setOpen] = React.useState(false);
    const [top, setTop] = React.useState<number | undefined>(0);
    const [left, setLeft] = React.useState<number | undefined>(0);
    const [width, setWidth] = React.useState<number | undefined>();
    const innerRef = React.useRef<HTMLDivElement>(null);
    const innerTitleRef = React.useRef<HTMLDivElement>(null);

    const handleClick = React.useCallback(() => {
        const bounding = innerRef.current?.getBoundingClientRect();
        setTop(!open ? bounding?.top : undefined);
        setLeft(!open ? bounding?.left : undefined);
        setWidth(bounding?.width);
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
        <div
            className={classNames(className, 'sc-dropdown', { active: open })}
            ref={innerRef}
            style={{ left, top, width }}
        >
            {!!subtitle && (
                <div className='subtitle'>
                    <span>{subtitle}</span>
                </div>
            )}
            <div className={classNames('value', { active: open })} onClick={handleClick} ref={innerTitleRef}>
                <span className='text'>{value}</span>
                <ArrowIcon />
            </div>
            <Scroll autoHide height={`${open ? '200px' : '1px'}`} className={classNames('dropdown', { active: open })}>
                {rows.map((row: any, idx: any) => (
                    <div
                        key={idx} // eslint-disable-line react/no-array-index-key
                        className={classNames('row', { 'row--selected': row === value })}
                        onClick={() => onRowClick && onRowClick(row)}
                    >
                        {children(row)}
                    </div>
                ))}
            </Scroll>
        </div>
    );
};

export const Pattern = ({ pattern, subtitle, lineWidth, onChange, onActive }: any) => {
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
        pattern !== 'none' ? <span className={`option ${pattern}-${lineWidth}`} /> : <span className='none'>None</span>;

    return (
        <DropDown rows={patterns} value={getValue()} onActive={onActive} onRowClick={onChange} subtitle={subtitle}>
            {(p: any) =>
                p.pattern !== 'none' ? (
                    <span className={`option ${p.pattern}-${p.width}`} />
                ) : (
                    <span className='none'>None</span>
                )
            }
        </DropDown>
    );
};

export const ColorPicker = ({ subtitle, color, theme, setColor }: any) => {
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
    const [top, setTop] = React.useState<number | undefined>(0);
    const [left, setLeft] = React.useState<number | undefined>(0);
    const [width, setWidth] = React.useState<number | undefined>();
    const innerRef = React.useRef<HTMLDivElement>(null);
    const innerTitleRef = React.useRef<HTMLDivElement>(null);

    const backgroundColor = React.useMemo(() => {
        if (color !== 'auto') return color;
        return theme === 'light' ? '#000000' : '#ffffff';
    }, [color, theme]);

    const handleClick = React.useCallback(() => {
        const bounding = innerRef.current?.getBoundingClientRect();
        setTop(!open ? bounding?.top : undefined);
        setLeft(!open ? bounding?.left : undefined);
        setWidth(bounding?.width);
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
        <div ref={innerRef} className={classNames('sc-color-picker', { active: open })} style={{ top, left, width }}>
            {!!subtitle && (
                <div className='subtitle'>
                    <span>{subtitle}</span>
                </div>
            )}
            <div className='value' onClick={handleClick} ref={innerTitleRef}>
                <div className='sc-input-color' style={{ backgroundColor }} />
                <ArrowIcon />
            </div>
            <div className={classNames('dropdown', { open })}>
                {colorMap.map((row, rowIdx) => (
                    <div key={rowIdx /* eslint-disable-line react/no-array-index-key */} className='row'>
                        {row.map(tileColor => (
                            <div
                                key={tileColor}
                                className='tile-color'
                                style={{ backgroundColor: tileColor }}
                                onClick={() => setColor(tileColor)}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const Switch = ({ value, onChange }: any) => (
    <div className={`sc-switch ${value ? 'on' : 'off'}`} onClick={() => onChange(!value)}>
        <div className='handle' />
    </div>
);

export const SwitchIcon = ({
    id,
    label,
    value,
    onChange,
    noramIcon,
    activeIcon,
}: {
    id: string;
    label: string;
    value: boolean;
    onChange: (checked: boolean) => void;
    noramIcon: (props: any) => JSX.Element;
    activeIcon: (props: any) => JSX.Element;
}) => {
    const Icon = value ? activeIcon : noramIcon;
    return (
        <div className='sc-switch-icon'>
            <Icon className='sc-switch-icon__icon' />
            <div className='sc-switch-icon__description'>
                <Checkbox id={id} label={label} checked={value} onChange={onChange} />
            </div>
        </div>
    );
};

// NumericInput fires onChange on Enter or onBlur
export const NumericInput = ({ subtitle, onChange, min, max, step, value }: any) => {
    const [innerValue, setInnerValue] = React.useState('');

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
        setInnerValue((prevState: any) => (prevState - 1) as any);
        handleFireOnChange();
    };

    React.useEffect(() => {
        setInnerValue(value);
    }, [value]);

    return (
        <div className='sc-numeric-input'>
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
                <div className='subtitle'>
                    <span>{subtitle}</span>
                </div>
            )}
            <div className='sc-numeric-input-buttons'>
                <InputNumberPlusIcon onClick={onIncrease} />
                <InputNumberMinusIcon onClick={onDecrease} />
            </div>
        </div>
    );
};

export const NumberColorPicker = ({ value, theme, onChange, onActive }: any) => {
    // Do NOT rename the variables Value and Color! The keys are also
    // used as attribute suffixes
    const { Value, Color } = value;
    const onValueChange = (v: any) => onChange({ Color, Value: v });
    const onColorChange = (c: any) => onChange({ Color: c, Value });

    return (
        <span className='sc-numbercolorpicker'>
            <NumericInput value={Value} subtitle={t.translate('Size')} onChange={(val: any) => onValueChange(val)} />
            <ColorPicker
                color={Color}
                theme={theme}
                onActive={onActive}
                subtitle={t.translate('Color')}
                setColor={(val: any) => onColorChange(val)}
            />
        </span>
    );
};

export const Toggle = ({ className, children, active, onChange }: any) => (
    <div onClick={() => onChange(!active)} className={`${className || ''} ${active ? 'active' : ''} sc-toggle`}>
        {children}
    </div>
);

export const FontSetting = ({ onChange, value }: any) => {
    const families = ['Default', 'Helvetica', 'Courier', 'Garamond', 'Palatino', 'Times New Roman'];
    const fontSizes = [8, 10, 12, 13, 14, 16, 20, 28, 36, 48, 64];

    const fireChange = (change: any) => onChange({ ...value, ...change });
    const onFontFamilyChange = (family: any) => fireChange({ family });
    const onFontSizeChange = (size: any) => fireChange({ size: `${size}px` });
    const onBoldChange = (isBold: any) => fireChange({ weight: isBold ? 'bold' : undefined });
    const onItalicChange = (isItalic: any) => fireChange({ style: isItalic ? 'italic' : undefined });
    const { family, style, weight, size } = value;

    return (
        <span className='sc-fontsetting'>
            <Toggle onChange={onBoldChange} active={!!weight}>
                <div className='sc-text-icon'>
                    <b>B</b>
                </div>
            </Toggle>
            <Toggle active={!!style} onChange={onItalicChange}>
                <div className='sc-text-icon'>
                    <i>i</i>
                </div>
            </Toggle>
            <DropDown
                className='sc-changefontsize'
                rows={fontSizes}
                title={size || '13px'}
                onRowClick={onFontSizeChange}
            >
                {(p: any) => <span className='option'>{p}</span>}
            </DropDown>
            <DropDown
                className='sc-changefontfamily'
                rows={families}
                title={family || families[0]}
                onRowClick={onFontFamilyChange}
            >
                {(p: any) => <span className='option'>{p}</span>}
            </DropDown>
        </span>
    );
};
