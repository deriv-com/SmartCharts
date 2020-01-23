import React from 'react';
import Scrollbars from 'tt-react-custom-scrollbars';
import { connect } from '../store/Connect';
import ViewStore from '../store/ViewStore';
import {
    TemplateIcon,
    AddIcon,
    DeleteIcon,
    EmptyStateIcon,
    OverwriteStateIcon,
} from './Icons.jsx';
import '../../sass/components/_view.scss';

const ViewItem = ({
    view,
    remove,
    onClick,
}) => (
    <div className="ciq-views__views__list__item" onClick={onClick}>
        <span>{view.name}</span>
        <DeleteIcon onClick={remove} />
    </div>
);

const EmptyView = ({ onClick }) => (
    <div className="ciq-views--empty">
        <EmptyStateIcon />
        <p>{t.translate('You have no save templates yet.')}</p>
        <button type="button" className="btn" onClick={onClick}>
            <AddIcon />
            {t.translate('Add new templates')}
        </button>
    </div>
);

const OverwriteView = ({ templateName, onCancel, onOverwrite }) =>  (
    <div className="ciq-views--overwrite">
        <div className="ciq-views--overwrite__content">
            <OverwriteStateIcon />
            <p>
                {templateName + t.translate(' already exists.')}<br />
                {t.translate('Would you like to overwrite it?')}
            </p>
        </div>
        <div className="ciq-views--overwrite__footer">
            <button type="button" className="btn" onClick={onCancel}>
                {t.translate('Cancel')}
            </button>
            <button type="button" className="btn btn--primary" onClick={onOverwrite}>
                {t.translate('Overwrite')}
            </button>
        </div>
    </div>
);


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
}) => {
    const isActive = isInputActive || templateName !== '';

    return (
        <ViewsMenu
            className="ciq-views-menu"
            title={t.translate('Templates')}
            newStyle
        >
            <ViewsMenu.Title className="cq-menu-btn">
                <TemplateIcon
                    className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                    tooltip-title={t.translate('Templates')}
                />
            </ViewsMenu.Title>
            <ViewsMenu.Body>
                <div className="ciq-views">
                    {(currentRoute === 'new')
                        ? (<EmptyView onClick={onToggleNew} />)
                        : (
                            <React.Fragment>
                                {
                                    currentRoute !== 'overwrite' ? '' : (
                                        <OverwriteView
                                            templateName={templateName}
                                            onCancel={main}
                                            onOverwrite={overwrite}
                                        />
                                    )
                                }
                                <Scrollbars>
                                    <div className="form form--ciq-views">
                                        <div className="form__input-group">
                                            <div className="form__group">
                                                <div className="form__control">
                                                    <div className={`form--ciq-views__input ${isActive ? 'form--ciq-views__input--active' : ''}`}>
                                                        <div className="subtitle">
                                                            <span>{t.translate('Add new templates')}</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className={`input ${isActive ? 'input--active' : ''}`}
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
                                                            type="button"
                                                            onClick={saveViews}
                                                            className={`btn btn--primary ${isActive ? '' : 'btn--primary--disabled'}`}
                                                        >
                                                            <AddIcon />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {views.length > 0
                                        ? (
                                            <div className="ciq-views__views">
                                                <div className="ciq-views__views__head">
                                                    <h5>{t.translate('Saved templates')}</h5>
                                                    <button type="button" onClick={removeAll}>{t.translate('Clear all')}</button>
                                                </div>
                                                <div className="ciq-views__views__content">
                                                    <div className="ciq-views__views__list">
                                                        {
                                                            views.map((view, i) => (
                                                                <ViewItem
                                                                    view={view}
                                                                    key={view.name}
                                                                    onClick={e => applyLayout(i, e)}
                                                                    remove={e => remove(i, e)}
                                                                />
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                        : ''}
                                </Scrollbars>
                            </React.Fragment>
                        )
                    }
                </div>
            </ViewsMenu.Body>
        </ViewsMenu>
    );
};


export default connect(({ view: s }) => ({
    ViewsMenu: s.ViewsMenu,
    views: ViewStore.views,
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
