import React from 'react';
import Scrollbars from 'tt-react-custom-scrollbars';
import { connect } from '../store/Connect';
import ViewStore from '../store/ViewStore';
import {
    // BackIcon,
    TemplateIcon,
    AddIcon,
    // TickIcon,
    DeleteIcon,
    alertIconMap,
    EmptyStateIcon,
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
        <p>You have no save templates yet.</p>
        <button type="button" onClick={onClick}>
            <AddIcon />
            Add new templates
        </button>
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
}) => (
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
                                    <div className="ovrwrit-alrt">
                                        <div className="ovrwrit-alrt-title">
                                            <alertIconMap.warning />
                                            <span>
                                                {templateName + t.translate(' already exists.')}
                                            </span>
                                            <span>
                                                {t.translate('Would you like to overwrite it?')}
                                            </span>
                                        </div>
                                        <div className="ovrwrit-alrt-buttons">
                                            <div onClick={main}>
                                                {t.translate('CANCEL')}
                                            </div>
                                            <div onClick={overwrite}>
                                                {t.translate('OVERWRITE')}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            <div className="form form--ciq-views">
                                <div className="form__input-group">
                                    <div className="form__group">
                                        <div className="form__control">
                                            <div className={`form--ciq-views__input ${templateName !== '' ? 'form--ciq-views__input--active' : ''}`}>
                                                <div className="subtitle">
                                                    <span>Add new templates</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder={t.translate('Add new templates')}
                                                    ref={inputRef}
                                                    value={templateName}
                                                    onKeyUp={onSubmit}
                                                    onChange={onChange}
                                                />
                                                <button type="button" onClick={saveViews}> <AddIcon /> </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="ciq-views__views">
                                <div className="ciq-views__views__head">
                                    <h5>Saved templates</h5>
                                    <button type="button" onClick={removeAll}>Clear all</button>
                                </div>
                                <div className="ciq-views__views__content">
                                    <Scrollbars
                                        className="ciq-views__views__list"
                                    >
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
                                    </Scrollbars>
                                </div>
                            </div>
                        </React.Fragment>
                    )
                }
            </div>
        </ViewsMenu.Body>
    </ViewsMenu>
);

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
}))(Views);
