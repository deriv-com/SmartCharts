import React from 'react';
import Menu from './Menu.jsx';
import { connect } from '../store/Connect';
import {Switch} from './Form.jsx';
import {
    SettingIcon,
    PositionLeftIcon,
    PositionBottomIcon,
    ChevronRightIcon,
    BackIcon,
    FlagIcons
} from './Icons.jsx';
import '../../sass/components/_ciq-chart-setting.scss';


const ChartSetting = ({
    Menu,
    menuOpen,
    selectedLanguage,
    languages,
    setView,
    view,
    setLanguage,
    isDarkTheme,
    setTheme
}) => {
    const renderMain = () => {
        return <div>
            <div className='title'> {t.translate('Settings')} </div>
            <div className='body'>
                <div className="ciq-list ciq-list-setting">
                    {/*<div className="ciq-item">
                        <span className="ciq-icon-text">{t.translate('Position')}</span>
                        <div className="ciq-action">
                            <PositionLeftIcon
                            />
                            <PositionBottomIcon
                            />
                        </div>
                    </div>
                    */}
                    <div className="ciq-list-item">
                        <span className="ciq-icon-text">{t.translate('Theme')}</span>
                        <div className="ciq-action">
                            <Switch
                                value={isDarkTheme}
                                onChange={setTheme}
                                />
                        </div>
                    </div>
                    <div className="ciq-list-item">
                        <span className="ciq-icon-text">{t.translate('Language')}</span>
                        <div className="ciq-action">
                            <span></span>
                            <ChevronRightIcon
                                onClick={ () => setView('language') }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    };
    const renderLanguage = () =>{
        return <div>
            <div className='title'>
                <BackIcon
                    onClick={() => setView() }
                />
                {t.translate('Language')}
            </div>
            <div className='body'>
                <div className="ciq-list ciq-list-language">
                    {languages.map( (language,index) => {
                        return <div
                            className={`ciq-list-item ${(selectedLanguage == language.key) ? 'selected' : ''}`}
                            key={index}
                            onClick={()=> setLanguage(language.key) }
                        >
                            <span>
                                {language.icon}
                            </span>
                            <span className="ciq-icon-text">{language.name}</span>
                        </div>;
                    })}
                </div>
            </div>
        </div>;
    };
    return (
        <Menu className="cq-chart-setting">
            <Menu.Title>
                <SettingIcon
                    className = {`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                    tooltip-title={t.translate('Settings')}
                />
            </Menu.Title>
            <Menu.Body>
                <div className={`cq-menu-container ${view == '' ? 'active': ''}`}>
                    {renderMain()}
                </div>
                <div className={`cq-menu-container ${view == 'language' ? 'active': ''}`}>
                    {renderLanguage()}
                </div>

            </Menu.Body>
        </Menu>
    );
};

export default connect(({chartSetting: s}) => ({
    Menu: s.menu.connect(Menu),
    menuOpen: s.menu.dialog.open,
    selectedLanguage: s.language,
    languages: s.languages,
    setView: s.setView,
    view: s.view,
    setLanguage: s.setLanguage,
    isDarkTheme: s.isDarkTheme,
    setTheme: s.setTheme,
}))(ChartSetting);
