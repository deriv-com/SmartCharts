import React, { Component, Fragment } from 'react';
import { connect } from '../store/Connect';
import { Switch, ColorPicker, Slider, Pattern, DropDown } from './Form.jsx';
import { DeleteIcon, StarIcon } from './Icons.jsx';
import '../../sass/_ciq-settings-dialog.scss';

const SettingsDialog = ({
    items, // [{ id, title, value, defaultValue, type }]
    title,
    description,
    activeTab,
    setOpen,
    showTabs,
    onTabClick,
    stared,
    onDeleteClick,
    onStarClick,
    onResetClick,
    onItemChange,
    Dialog,
}) => {
    const renderMap = {
        switch: item => (
            <div key={item.id} className='item'>
                <div className='title'>
                    <span>{item.title}</span>
                    <Switch
                        value={item.value}
                        onChange={(v) => onItemChange(item.id, v)}
                    />
                </div>
            </div>
        ),
        colorpicker: item => (
            <div key={item.id} className='item'>
                <div className='title'>
                    <span>{item.title}</span>
                    <ColorPicker
                        color={item.value}
                        setColor={(value) => onItemChange(item.id, value)}
                    />
                </div>
            </div>
        ),
        pattern: item => {
            const lineWidth = items.filter(it => it.id === 'lineWidth')[0].value;
            return (
                <div key={item.id} className='item'>
                    <div className='title'>
                        <span>{item.title}</span>
                        <Pattern
                            pattern={item.value}
                            lineWidth={lineWidth}
                            onChange={v => {
                                onItemChange('pattern', v.pattern);
                                onItemChange('lineWidth', v.width);
                            }}
                        />
                    </div>
                </div>
            );
        },
        select: item => (
            <div key={item.id} className='item'>
                <div className='title'>
                    <span>{item.title}</span>
                    <DropDown
                        rows={Object.keys(item.options)}
                        title={item.value}
                        onRowClick={value => onItemChange(item.id, value)}
                    >
                        {row => row}
                    </DropDown>
                </div>
            </div>
        ),
        number: item => (
            <div key={item.id} className='item'>
                <div className='title'>
                    <span>{item.title}</span>
                    <Slider
                        min={item.min || 1}
                        step={item.step || 1}
                        max={item.max || 100}
                        value={item.value}
                        onChange={val => onItemChange(item.id, val)}
                    />
                </div>
            </div>
        ),
        none: () => null,
    };
    return (
        <Dialog className="cq-dialog cq-settings-dialog">
            <div className={`titlebar ${!showTabs ? 'no-tabs' : ''}`}>
                <div className='title'>{title}</div>
                <div className='icons'>
                    <DeleteIcon
                        onClick={onDeleteClick}
                        className="margin"
                    />
                    <StarIcon
                        onClick={onStarClick}
                        className={`margin ${stared ? 'fill-orange' : ''}`}
                    />
                </div>
            </div>

            { showTabs &&
                <div className='tabs'>
                    <div
                        onClick={() => onTabClick('settings')}
                        className={activeTab === 'settings' ? 'active' : ''}
                    > Settings </div>
                    <div
                        onClick={() => onTabClick('description')}
                        className={activeTab === 'description' ? 'active' : ''}
                    > Description </div>
                    <div className={`active-border ${activeTab === 'settings' ? 'first' : 'second'}`} />
                </div>
            }

            { activeTab === 'settings' ?
                <React.Fragment>
                    <div className='items' >
                        {items
                            .map(item => {
                                if(renderMap[item.type]) {
                                    return renderMap[item.type](item);
                                }
                                return (
                                    <div key={item.id} className='item'>
                                        <div className='title'>
                                            <span>{item.title}</span>
                                            <strong>{item.type}</strong>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className='buttons'>
                        <div
                            className='reset'
                            onClick={onResetClick}
                        >{t.translate('RESET')}</div>
                        <div
                            className='done'
                            onClick={() => setOpen(false)}
                        >{t.translate('DONE')}</div>
                    </div>
                </React.Fragment>
                :
                <div className='description'>
                    {description}
                </div>
            }
        </Dialog>
    );
};

export default SettingsDialog;
