import React from 'react';
import Menu from './Menu.jsx';
import { connect } from '../store/Connect';
import {
    CloseIcon,
    TemplateIcon,
    AddIcon,
    TickIcon,
    DeleteIcon,
    alertIconMap
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
    Menu,
    menuOpen,
    views,
    routes: { current: currentRoute, add, main, overwrite, cancel , cancelOverwrite },
    onChange,
    onSubmit,
    applyLayout,
    remove,
    inputRef,
}) => (
    <div className="ciq-views">
        {/* <OverwriteAlert
            alertTitle={t.translate('Template already exist. would you like to overwrite it?')}
            closeDisplay={t.translate('CANCEL')}
            sureDisplay={t.translate('OVERWRITE')} 
            onSure={overwrite}
            onClose={overwriteAlertClose}>
        </OverwriteAlert> */}
        <Menu>
            <Menu.Title className="cq-menu-btn">
                <TemplateIcon
                    className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                    tooltip-title={t.translate('Templates')}
                />
            </Menu.Title>
            <Menu.Body>
                <div className="title">
                    {
                        currentRoute === 'add' || currentRoute === 'overwrite' ?
                            <span className={`add ${currentRoute === 'overwrite' ? 'readonly' :''}`}>
                                <input
                                    ref={inputRef}
                                    className="view-input"
                                    placeholder={t.translate('Template name')}
                                    maxLength={20}
                                    onChange={onChange}
                                    onKeyUp={onSubmit}
                                />
                                <CloseIcon onClick={cancel} />
                            </span>
                            : t.translate('Templates')
                    }
                    <span className="icon">
                        {
                            currentRoute === 'add' || currentRoute === 'overwrite'
                                // TODO: change this to tick icon.
                                ? <TickIcon className="ic-clear stroke" onClick={add} />
                                : <AddIcon className="ic-clear fill" onClick={main} />
                        }
                    </span>
                </div>
                <div className="content">
                    {
                        currentRoute !== 'overwrite' ?
                            <div className="ciq-list">
                                {
                                    views.length
                                        ? views.map((view, i) => (
                                            <ViewItem
                                                view={view}
                                                key={i}
                                                onClick={e => applyLayout(i, e)}
                                                remove={e => remove(i, e)}
                                            />
                                        ))
                                        :
                                        <span className="placeholder">
                                            <p>{t.translate('There is no template added by you.')}</p>
                                            <p>{t.translate('Click + icon to add one.')}</p>
                                        </span>
                                }
                            </div>
                        :
                            <div className='ovrwrit-alrt'>
                                <div className="ovrwrit-alrt-title">
                                    <alertIconMap.warning/>
                                    <span>
                                        {t.translate('Template already exist.')}
                                    </span>
                                    <span>
                                        {t.translate('Would you like to overwrite it?')}
                                    </span>
                                </div>
                                <div className="ovrwrit-alrt-buttons">
                                    <div onClick={cancelOverwrite}>
                                        {t.translate('CANCEL')}
                                    </div>
                                    <div onClick={overwrite}>
                                        {t.translate('OVERWRITE')} 
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </Menu.Body>
        </Menu>
   </div>
);

export default connect(({ view: s }) => ({
    Menu: s.menu.connect(Menu),
    views: s.views,
    routes: s.routes,
    onOverwrite: s.onOverwrite,
    onCancel: s.onCancel,
    onChange: s.onChange,
    remove: s.remove,
    onSubmit: s.onSubmit,
    applyLayout: s.applyLayout,
    menuOpen: s.menu.dialog.open,
    inputRef: s.inputRef,
}))(Views);
