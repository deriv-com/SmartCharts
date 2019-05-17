import PropTypes    from 'prop-types';
import React        from 'react';
import Scrollbars   from 'tt-react-custom-scrollbars';
import { connect }  from '../store/Connect';
import ViewStore    from '../store/ViewStore';
import {
    BackIcon,
    TemplateIcon,
    AddIcon,
    TickIcon,
    DeleteIcon,
    alertIconMap,
} from './Icons.jsx';
import '../../sass/components/_view.scss';

const ViewItem = ({
    view,
    remove,
    onClick,
}) => (
    <div className="ciq-list-item" onClick={onClick}>
        <span className="ciq-list-item-text">{view.name}</span>
        <DeleteIcon onClick={remove} />
    </div>
);

const Views = ({
    ViewsMenu,
    menuOpen,
    views,
    currentRoute,
    routes: { add, main, overwrite, cancel },
    onChange,
    onSubmit,
    applyLayout,
    remove,
    inputRef,
    templateName,
}) => (
    <ViewsMenu
        className="ciq-views"
        title={t.translate('Templates')}
    >
        <ViewsMenu.Title className="cq-menu-btn">
            <TemplateIcon
                className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                tooltip-title={t.translate('Templates')}
            />
        </ViewsMenu.Title>
        <ViewsMenu.Body>
            <div className="content">
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
                <div className="template-name">
                    {
                        currentRoute === 'add'
                            ? (
                                <span className="add">
                                    <BackIcon onClick={cancel} />
                                    <input
                                        ref={inputRef}
                                        className="view-input"
                                        value={templateName}
                                        placeholder={t.translate('Template name')}
                                        maxLength={20}
                                        onChange={onChange}
                                        onKeyUp={onSubmit}
                                    />
                                </span>
                            )
                            : <span className="add-new" onClick={main}> {t.translate('Add new')} </span>
                    }
                    <span className="icon">
                        {
                            currentRoute === 'add'
                                ? <TickIcon className="tick-icon" onClick={add} />
                                : <AddIcon className="add-icon" onClick={main} />
                        }
                    </span>
                </div>
                <Scrollbars
                    className="ciq-list"
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
        </ViewsMenu.Body>
    </ViewsMenu>
);

Views.propTypes = {
    ViewsMenu: PropTypes.any.isRequired,
    views: PropTypes.array,
    routes: PropTypes.object,
    onChange: PropTypes.func,
    remove: PropTypes.func,
    onSubmit: PropTypes.func,
    applyLayout: PropTypes.func,
    menuOpen: PropTypes.bool,
    inputRef: PropTypes.any,
    currentRoute: PropTypes.string,
    templateName: PropTypes.string,
};

Views.defaultProps = {
    views: [],
    routes: {},
    onChange: () => null,
    remove: () => null,
    onSubmit: () => null,
    applyLayout: () => null,
};

export default connect(({ view: s }) => ({
    ViewsMenu: s.ViewsMenu,
    views: ViewStore.views,
    routes: s.routes,
    onChange: s.onChange,
    remove: s.remove,
    onSubmit: s.onSubmit,
    applyLayout: s.applyLayout,
    menuOpen: s.menu.dialog.open,
    inputRef: s.inputRef,
    currentRoute: s.currentRoute,
    templateName :s.templateName,
}))(Views);
