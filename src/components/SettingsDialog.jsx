import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/_ciq-settings-dialog.scss';

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
    Dialog,
}) => {
    return (
        <Dialog
            className="cq-dialog cq-settings-dialog"
        >
            <div className='titlebar'>
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
            {showTabs &&
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
            <div className='items'>
                {items.map(item => (
                    <div key={item.id} className='item'>
                        <div className='title'>{item.title}</div>
                        <div className='value'>{item.value}</div>
                    </div>
                ))}
            </div>
            <div className='description'>
                {description}
            </div>
        </Dialog>
    );
};

export default SettingsDialog;