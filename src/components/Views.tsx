import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';
import { TMainStore } from 'src/types';
import Tooltip from './Tooltip';
import Scroll from './Scroll';
import { wrapText } from '../utils';
import { TemplateIcon, AddIcon, DeleteIcon, EmptyStateIcon, OverwriteStateIcon } from './Icons';
import '../../sass/components/_view.scss';
import Menu from './Menu';

type TViewItemProps = {
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
    view: any;
    remove: TMainStore['view']['remove'];
};

const ViewItem: React.FC<TViewItemProps> = ({ view, remove, onClick }) => (
    <Tooltip
        className='sc-views__views__list__item'
        onClick={onClick}
        enabled={view.name.length > 27}
        content={wrapText(view.name, 26)}
    >
        <div className='text'>{view.name}</div>
        <DeleteIcon onClick={remove} />
    </Tooltip>
);

const EmptyView = ({ onClick }: { onClick: (event: React.MouseEvent<HTMLElement>) => void }) => (
    <div className='sc-views--empty'>
        <EmptyStateIcon />
        <p>{t.translate('You have no saved templates yet.')}</p>
        <button type='button' className='sc-btn' onClick={onClick}>
            <AddIcon />
            {t.translate('Add new template')}
        </button>
    </div>
);

type TOverwriteViewProps = {
    templateName: TMainStore['view']['templateName'];
    onCancel: TMainStore['view']['routes']['main'];
    onOverwrite: TMainStore['view']['routes']['overwrite'];
};

const OverwriteView: React.FC<TOverwriteViewProps> = ({ templateName, onCancel, onOverwrite }) => (
    <div className='sc-views--overwrite'>
        <div className='sc-views--overwrite__content'>
            <OverwriteStateIcon />
            <p>
                {`${templateName} ${t.translate('already exists.')}`}
                <br />
                {t.translate('Would you like to overwrite it?')}
            </p>
        </div>
        <div className='sc-views--overwrite__footer'>
            <button type='button' className='sc-btn sc-btn--outline-secondary' onClick={onCancel}>
                {t.translate('Cancel')}
            </button>
            <button type='button' className='sc-btn sc-btn--primary' onClick={onOverwrite}>
                {t.translate('Overwrite')}
            </button>
        </div>
    </div>
);

type TActiveListViewProps = {
    removeAll: TMainStore['view']['removeAll'];
    views: TMainStore['view']['sortedItems'];
    applyLayout: TMainStore['view']['applyLayout'];
    remove: TMainStore['view']['remove'];
};

const ActiveListView: React.FC<TActiveListViewProps> = ({ views, removeAll, applyLayout, remove }) => {
    if (!views.length) return null;

    return (
        <div className='sc-views__views'>
            <div className='sc-views__views__head'>
                <h5>{t.translate('Saved templates')}</h5>
                <button type='button' onClick={removeAll} className='sc-btn sc-btn--sm sc-btn--outline-secondary'>
                    {t.translate('Clear all')}
                </button>
            </div>
            <div className='sc-views__views__content'>
                <div className='sc-views__views__list'>
                    {views.map((view: any, i: any) => (
                        <ViewItem
                            view={view}
                            key={view.name}
                            onClick={(e: any) => applyLayout(i, e)}
                            remove={(e: any) => remove(i, e)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

type TViewsProps = {
    portalNodeId?: string;
};

const Views: React.FC<TViewsProps> = ({ portalNodeId }) => {
    const { view } = useStores();

    const {
        sortedItems: views,
        routes: { main, overwrite },
        onChange,
        remove,
        onSubmit,
        applyLayout,
        inputRef,
        currentRoute,
        templateName,
        onToggleNew,
        saveViews,
        removeAll,
        isInputActive,
        onFocus,
        onBlur,
        menuStore,
    } = view;

    const menuOpen = menuStore.dialogStore.open;

    const isActive = isInputActive || templateName !== '';

    return (
        <Menu
            store={menuStore}
            className='sc-views-menu'
            title={t.translate('Templates')}
            tooltip={t.translate('Templates')}
            modalMode
            portalNodeId={portalNodeId}
        >
            <Menu.Title>
                <div className={classNames('sc-views__menu', { 'sc-views__menu--active': menuOpen })}>
                    <TemplateIcon />
                </div>
            </Menu.Title>
            <Menu.Body>
                <div className='sc-views'>
                    {currentRoute === 'new' ? (
                        <EmptyView onClick={onToggleNew} />
                    ) : (
                        <React.Fragment>
                            {currentRoute !== 'overwrite' ? (
                                ''
                            ) : (
                                <OverwriteView templateName={templateName} onCancel={main} onOverwrite={overwrite} />
                            )}
                            <Scroll autoHide>
                                <div className='form form--sc-views'>
                                    <div className='form__input-group'>
                                        <div className='form__group'>
                                            <div className='form__control'>
                                                <div
                                                    className={classNames('form--sc-views__input', {
                                                        'form--sc-views__input--active': isActive,
                                                    })}
                                                >
                                                    <div className='subtitle'>
                                                        <span>{t.translate('Add new templates')}</span>
                                                    </div>
                                                    <input
                                                        type='text'
                                                        className={classNames('sc-input', {
                                                            'sc-input--active': isActive,
                                                        })}
                                                        placeholder={isActive ? '' : t.translate('Add new templates')}
                                                        ref={inputRef}
                                                        value={templateName}
                                                        onKeyUp={onSubmit}
                                                        onChange={onChange}
                                                        onFocus={onFocus}
                                                        onClick={onFocus}
                                                        onBlur={onBlur}
                                                    />
                                                    <button
                                                        type='button'
                                                        onClick={saveViews}
                                                        className={classNames('sc-btn', 'sc-btn--primary', {
                                                            'sc-btn--primary--disabled': !isActive,
                                                        })}
                                                    >
                                                        <AddIcon />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <ActiveListView
                                    views={views}
                                    removeAll={removeAll}
                                    applyLayout={applyLayout}
                                    remove={remove}
                                />
                            </Scroll>
                        </React.Fragment>
                    )}
                </div>
            </Menu.Body>
        </Menu>
    );
};

export default observer(Views);
