import React from 'react';
import Menu from './Menu.jsx';
import { connect } from '../store/Connect';
import { 
    EditIcon,
    PositionLeftIcon,
    PositionBottomIcon,
    ThemeDarkIcon,
    ThemeLightIcon,
    ChevronRightIcon,
    BackIcon,
    FlagIcons
} from './Icons.jsx';
import '../../sass/_ciq-chart-setting.scss';


const ChartSetting = ({
    Menu,
    menuOpen,
    hasActiveView,
    clearView,
    onViewLanguage,
    isViewLanguage,
    setLanguage
}) => {
    const renderMain = () => {
        return <div>
            <div className='title'> {t.translate('Settings')} </div>
            <div className='body'>
                <div className="ciq-list ciq-list-setting">
                    <div className="ciq-list-item">
                        <span className="ciq-icon-text">{t.translate('Position')}</span>
                        <div className="ciq-action">
                            <PositionLeftIcon 
                            />
                            <PositionBottomIcon 
                            />
                        </div>
                    </div>
                    <div className="ciq-list-item">
                        <span className="ciq-icon-text">{t.translate('Theme')}</span>
                        <div className="ciq-action">
                            <ThemeDarkIcon 
                            />
                            <ThemeLightIcon 
                            />
                        </div>
                    </div>
                    <div className="ciq-list-item ciq-list-item-lng">
                        <span className="ciq-icon-text">{t.translate('Language')}</span>
                        <div className="ciq-action">
                            <span></span>
                            <ChevronRightIcon 
                                onClick={ () => onViewLanguage() }
                                />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
    const renderView = () => {
        if ( isViewLanguage ) {
            return <div>{renderLanguage()}</div>;
        }

        return <div>Empty</div>
    }
    const renderLanguage = () =>{
        return <div>
            <div className='title'>
                <BackIcon
                    onClick={() => clearView() }
                    />
                {t.translate('Language')}
            </div>
            <div className='body'>
                <div className="ciq-list ciq-list-language">
                    <div className="ciq-list-item" onClick={()=> setLanguage('usd') }>
                        <FlagIcons.USD />
                        <span className="ciq-icon-text">{t.translate('English')}</span>
                    </div>
                    <div className="ciq-list-item" onClick={()=> setLanguage('de') }>
                        <FlagIcons.German />
                        <span className="ciq-icon-text">{t.translate('Deutsch')}</span>
                    </div>
                    <div className="ciq-list-item" onClick={()=> setLanguage('fr') }>
                        <FlagIcons.USD />
                        <span className="ciq-icon-text">{t.translate('French')}</span>
                    </div>
                    <div className="ciq-list-item" onClick={()=> setLanguage('it') }>
                        <FlagIcons.German />
                        <span className="ciq-icon-text">{t.translate('Itly')}</span>
                    </div>
                    <div className="ciq-list-item" onClick={()=> setLanguage('ja') }>
                        <FlagIcons.USD />
                        <span className="ciq-icon-text">{t.translate('Japan')}</span>
                    </div>
                    
                    <div className="ciq-list-item" onClick={()=> setLanguage('usd') }>
                        <FlagIcons.German />
                        <span className="ciq-icon-text">{t.translate('Deutsch')}</span>
                    </div>
                    <div className="ciq-list-item" onClick={()=> setLanguage('usd') }>
                        <FlagIcons.USD />
                        <span className="ciq-icon-text">{t.translate('English')}</span>
                    </div>
                    <div className="ciq-list-item" onClick={()=> setLanguage('usd') }>
                        <FlagIcons.German />
                        <span className="ciq-icon-text">{t.translate('Deutsch')}</span>
                    </div>
                </div>
            </div>
        </div>

    }
    return (
        <Menu className="cq-chart-setting">
            <Menu.Title>
                <EditIcon
                    className = {menuOpen ? 'active' : ''}
                    tooltip-title={t.translate('Settings')}
                />
            </Menu.Title>
            <Menu.Body>
                {hasActiveView ? renderView() : renderMain()}                
            </Menu.Body>
        </Menu>
    );
};

export default connect(({chartSetting: s}) => ({
    Menu: s.menu.connect(Menu),
    menuOpen: s.menu.dialog.open,
    hasActiveView: s.hasActiveView,
    clearView: s.clearView,
    onViewLanguage: s.onViewLanguage,
    isViewLanguage: s.isViewLanguage,
    setLanguage: s.setLanguage
}))(ChartSetting);
