import React, {Component, Fragment} from 'react';
import { connect } from '../store/Connect';
import '../../sass/_ciq-settings-dialog.scss';
import {Switch, ColorPicker, Slider, Line} from './Form.jsx';

const SettingsDialog = ({
    items,
    title,
    description,
    activeTab,
    showTabs,
    onTabClick,
    stared,
    onDeleteClick,
    onStarClick,
    onItemChange,
    Dialog,
}) => {
    const getItemValue = item => {
        if(typeof item.value === 'boolean') {
            return <Switch
                value={item.value}
                onChange={(v) => onItemChange(item.id, v)}
            />;
        }
        if(item.id === 'pattern') {
            const lineWidth = items.filter(it => it.id === 'lineWidth')[0].value;
            return `${item.value} ${lineWidth ? (lineWidth+1)/2 : ''}`;
        }
        return item.value;
    }
    return (
        <Dialog className="cq-dialog cq-settings-dialog">
            <div className={`titlebar ${!showTabs ? 'no-tabs' : ''}`}>
                <div className='title'>{title}</div>
                <div className='icons'>
                    <span
                        onClick={onDeleteClick}
                        className='ciq-icon ciq-ic-delete'
                    />
                    <span
                        onClick={onStarClick}
                        className={`ciq-icon ciq-ic-star ${stared ? 'active' : ''}`}
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
                <div className='items' >
                    {items
                        .filter(item => !/(object|array)/.test(typeof item.value))
                        .filter(item => item.id !== 'lineWidth')
                        .map(item => (
                            <div key={item.id} className='item'>
                                <div className='title'>
                                    <span>{item.title}</span>
                                    <strong>{getItemValue(item)}</strong>
                                </div>
                                {/nothing-yet/.test(item.id) &&
                                    <Slider
                                        onChange={value => onItemChange(item.id, value)}
                                        className='value'
                                        value={item.value}
                                    />
                                }
                                {/color/i.test(item.id) &&
                                    <ColorPicker
                                        color={item.value}
                                        setColor={(value) => onItemChange(item.id, value)}
                                    />
                                }
                                {/pattern/.test(item.id) &&
                                    <Line
                                        pattern={item.value}
                                        lineWidth={items.filter(it => it.id === 'lineWidth')[0].value}
                                        setLine={({ pattern, width }) => {
                                            onItemChange('pattern', pattern);
                                            onItemChange('lineWidth', width);
                                        }}
                                    />
                                }
                                {!/(lineWidth|pattern|color|axisLabel)/i.test(item.id) && <div className='value'>{item.value}</div>}
                            </div>
                        ))}
                </div>
                :
                <div className='description'>
                    {description}
                </div>
            }
        </Dialog>
    );
};

export default SettingsDialog;