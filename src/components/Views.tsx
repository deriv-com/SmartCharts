// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Tooltip.jsx' was resolved to '/Users/bal... Remove this comment to see the full error message
import Tooltip from './Tooltip.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Scroll.jsx' was resolved to '/Users/bala... Remove this comment to see the full error message
import Scroll from './Scroll.jsx';
import { wrapText } from '../utils';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons.jsx' was resolved to '/Users/balak... Remove this comment to see the full error message
import { TemplateIcon, AddIcon, DeleteIcon, EmptyStateIcon, OverwriteStateIcon } from './Icons.jsx';
import '../../sass/components/_view.scss';

const ViewItem = ({
    view,
    remove,
    onClick,
}: any) => (
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <Tooltip
        className='sc-views__views__list__item'
        onClick={onClick}
        enabled={view.name.length > 27}
        content={wrapText(view.name, 26)}
    >
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <div className='text'>{view.name}</div>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <DeleteIcon onClick={remove} />
    </Tooltip>
);

const EmptyView = ({
    onClick,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className='sc-views--empty'>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <EmptyStateIcon />
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <p>{t.translate('You have no saved templates yet.')}</p>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <button type='button' className='sc-btn' onClick={onClick}>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <AddIcon />
            {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
            {t.translate('Add new template')}
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </button>
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);

const OverwriteView = ({
    templateName,
    onCancel,
    onOverwrite,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className='sc-views--overwrite'>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <div className='sc-views--overwrite__content'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <OverwriteStateIcon />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <p>
                {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
                {`${templateName} ${t.translate('already exists.')}`}
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <br />
                {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
                {t.translate('Would you like to overwrite it?')}
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </p>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <div className='sc-views--overwrite__footer'>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <button type='button' className='sc-btn sc-btn--outline-secondary' onClick={onCancel}>
                {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
                {t.translate('Cancel')}
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </button>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <button type='button' className='sc-btn sc-btn--primary' onClick={onOverwrite}>
                {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
                {t.translate('Overwrite')}
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </button>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);

const ActiveListView = ({
    views,
    removeAll,
    applyLayout,
    remove,
}: any) => {
    if (!views.length) return '';

    return (
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className='sc-views__views'>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='sc-views__views__head'>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <h5>{t.translate('Saved templates')}</h5>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <button type='button' onClick={removeAll} className='sc-btn sc-btn--sm sc-btn--outline-secondary'>
                    {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
                    {t.translate('Clear all')}
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </button>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='sc-views__views__content'>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className='sc-views__views__list'>
                    {views.map((view: any, i: any) => (
                        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <ViewItem
                            view={view}
                            key={view.name}
                            onClick={(e: any) => applyLayout(i, e)}
                            remove={(e: any) => remove(i, e)}
                        />
                    ))}
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    );
};

const Views = ({
    ViewsMenu,
    menuOpen,
    views,
    currentRoute,
    onToggleNew,
    routes: { main, overwrite },
    onChange,
    onSubmit,
    applyLayout,
    remove,
    inputRef,
    saveViews,
    templateName,
    removeAll,
    isInputActive,
    onFocus,
    onBlur,
    portalNodeId,
}: any) => {
    const isActive = isInputActive || templateName !== '';

    return (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <ViewsMenu
            className='sc-views-menu'
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            title={t.translate('Templates')}
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            tooltip={t.translate('Templates')}
            modalMode
            portalNodeId={portalNodeId}
        >
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <ViewsMenu.Title>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className={classNames('sc-views__menu', { 'sc-views__menu--active': menuOpen })}>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <TemplateIcon />
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            </ViewsMenu.Title>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <ViewsMenu.Body>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className='sc-views'>
                    {currentRoute === 'new' ? (
                        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <EmptyView onClick={onToggleNew} />
                    ) : (
                        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <React.Fragment>
                            {currentRoute !== 'overwrite' ? (
                                ''
                            ) : (
                                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <OverwriteView templateName={templateName} onCancel={main} onOverwrite={overwrite} />
                            )}
                            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                            <Scroll autoHide>
                                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                <div className='form form--sc-views'>
                                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                    <div className='form__input-group'>
                                        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                        <div className='form__group'>
                                            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                            <div className='form__control'>
                                                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                                <div
                                                    className={classNames('form--sc-views__input', {
                                                        'form--sc-views__input--active': isActive,
                                                    })}
                                                >
                                                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                                    <div className='subtitle'>
                                                        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                                        <span>{t.translate('Add new templates')}</span>
                                                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                                    </div>
                                                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                                    <input
                                                        type='text'
                                                        className={classNames('sc-input', {
                                                            'sc-input--active': isActive,
                                                        })}
                                                        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                                                        placeholder={isActive ? '' : t.translate('Add new templates')}
                                                        ref={inputRef}
                                                        value={templateName}
                                                        onKeyUp={onSubmit}
                                                        onChange={onChange}
                                                        onFocus={onFocus}
                                                        onClick={onFocus}
                                                        onBlur={onBlur}
                                                    />
                                                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                                    <button
                                                        type='button'
                                                        onClick={saveViews}
                                                        className={classNames('sc-btn', 'sc-btn--primary', {
                                                            'sc-btn--primary--disabled': !isActive,
                                                        })}
                                                    >
                                                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                                                        <AddIcon />
                                                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                                    </button>
                                                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                                </div>
                                            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                            </div>
                                        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                        </div>
                                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                    </div>
                                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                </div>
                                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                                <ActiveListView
                                    views={views}
                                    removeAll={removeAll}
                                    applyLayout={applyLayout}
                                    remove={remove}
                                />
                            </Scroll>
                        </React.Fragment>
                    )}
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            </ViewsMenu.Body>
        </ViewsMenu>
    );
};

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default connect(({ view: s }) => ({
    ViewsMenu: s.ViewsMenu,
    views: s.sortedItems,
    routes: s.routes,
    onOverwrite: s.onOverwrite,
    onChange: s.onChange,
    remove: s.remove,
    onSubmit: s.onSubmit,
    applyLayout: s.applyLayout,
    menuOpen: s.menu.dialog.open,
    inputRef: s.inputRef,
    currentRoute: s.currentRoute,
    templateName: s.templateName,
    onToggleNew: s.onToggleNew,
    saveViews: s.saveViews,
    removeAll: s.removeAll,
    isInputActive: s.isInputActive,
    onFocus: s.onFocus,
    onBlur: s.onBlur,
}))(Views);
