import React from 'react';
import Menu from './Menu.jsx';
import { connect } from '../store/Connect';
import {
    CloseIcon,
    TemplateIcon,
    AddIcon,
    TickIcon,
    DeleteIcon
} from './Icons.jsx';

const ViewItem = ({
    view,
    remove,
    onClick,
}) => (
    <div className="view" onClick={onClick}>
        <span className="name">{view.name}</span>
        <DeleteIcon onClick={remove}/>
    </div>
);

const Views = ({
    Menu,
    menuOpen,
    views,
    routes: {current: currentRoute, add, main, cancel},
    onChange,
    onSubmit,
    applyLayout,
    remove,
    inputRef,
}) => {
    return (
        <Menu className="views">
            <Menu.Title className="cq-menu-btn">
                <div>
                    <TemplateIcon
                        className = {menuOpen ? 'active' : ''}
                        subtitle={t.translate("Templates")} />
                </div>
            </Menu.Title>
            <Menu.Body>
                <div className="dropdown-title">

                    {
                        currentRoute === 'add'
                            ? <span className="add">
                                <input
                                    ref={inputRef}
                                    className="view-input"
                                    placeholder={t.translate("Template name")}
                                    maxLength={20}
                                    onChange={onChange}
                                    onKeyUp={onSubmit}
                                />
                                <CloseIcon onClick={cancel} />
                            </span>
                            : <span className="title">Templates</span>
                    }
                    <span className="icon">
                        {
                            currentRoute === 'add'
                            //TODO: change this to tick icon.
                                ? <TickIcon className="ic-clear stroke" onClick={add}/>
                                : <AddIcon className="ic-clear fill" onClick={main}/>
                        }
                    </span>
                </div>
                <div className='content'>
                    {
                        views.length
                            ? views.map((view, i) => (
                                <ViewItem
                                    view={view}
                                    key={i}
                                    onClick={applyLayout.bind(null, i)}
                                    remove={remove.bind(null, i)}
                                />
                            ))
                            : <span className="placeholder">
                                <p>{t.translate('There is no template added by you.')}</p>
                                <p>{t.translate('Click + icon to add one.')}</p>
                            </span>
                    }
                </div>
            </Menu.Body>
        </Menu>
    );
};

export default connect(({view: s}) => ({
    Menu: s.menu.connect(Menu),
    views: s.views,
    routes: s.routes,
    onChange: s.onChange,
    remove: s.remove,
    onSubmit: s.onSubmit,
    applyLayout: s.applyLayout,
    menuOpen: s.menu.dialog.open,
    inputRef: s.inputRef,
}))(Views);
