/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import { CSSTransition } from 'react-transition-group';
import Menu from './Menu.jsx';
import { connect } from '../store/Connect';
import { Switch } from './Form.jsx';
import {
    SettingIcon,
    // PositionLeftIcon,
    // PositionBottomIcon,
    BackIcon,
    CloseIcon,
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
    theme,
    setTheme,
    candleCountdown,
    showCandleCountdown,
    closeMenu,
    assetInformation,
    setAssetInformation,
}) => {
    const renderMain = () => (<div>
        <div className="title">
            <div className="title-text"> {t.translate('Settings')} </div>
            <CloseIcon className="icon-close-menu" onClick={() => closeMenu()} />
        </div>
        <div className="body">
            <div className="ciq-list ciq-list-setting">
                {/* <div className="ciq-item">
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
                    <span className="ciq-icon-text">{t.translate('Dark Mode')}</span>
                    <div className="ciq-action">
                        <Switch
                            value={(theme == 'dark')}
                            onChange={setTheme}
                        />
                    </div>
                </div>
                <div className="ciq-list-item">
                    <span className="ciq-icon-text">{t.translate('Candle Countdown')}</span>
                    <div className="ciq-action">
                        <Switch
                            value={candleCountdown}
                            onChange={showCandleCountdown}
                        />
                    </div>
                </div>
                <div className="ciq-list-item">
                    <span className="ciq-icon-text">{t.translate('Asset Information')}</span>
                    <div className="ciq-action">
                        <Switch
                            value={assetInformation}
                            onChange={setAssetInformation}
                        />
                    </div>
                </div>
                <div
                    className="ciq-list-item ciq-list-item-lng"
                    onClick={() => setView('language')}
                >
                    <span className="ciq-icon-text">{t.translate('Language')}</span>
                    <div className="ciq-action">
                        {selectedLanguage.icon}
                    </div>
                </div>
            </div>
        </div>
                              </div>);
    const renderLanguage = () => (<div>
        <div className="title">
            <BackIcon
                onClick={() => setView()}
            />
            {t.translate('Language')}
        </div>
        <div className="body">
            <div className="ciq-list ciq-list-language">
                {languages.map((language, index) => (<div
                    className={`ciq-list-item ${(selectedLanguage.key == language.key) ? 'selected' : ''}`}
                    key={index}
                    onClick={() => setLanguage(language)}
                >
                    {language.icon}
                    <span className="ciq-icon-text">{language.name}</span>
                                                     </div>))}
            </div>
        </div>
                                  </div>);
    return (
        <Menu className="cq-chart-setting">
            <Menu.Title>
                <SettingIcon
                    className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                    tooltip-title={t.translate('Settings')}
                />
            </Menu.Title>
            <Menu.Body>

                <CSSTransition
                    in={view === ''}
                    timeout={300}
                    classNames="cq-menu-container"
                    unmountOnExit
                >
                    {renderMain()}
                </CSSTransition>

                <CSSTransition
                    in={view === 'language'}
                    timeout={300}
                    classNames="cq-menu-container"
                    unmountOnExit
                >
                    {renderLanguage()}
                </CSSTransition>

            </Menu.Body>
        </Menu>
    );
};

export default connect(({ chartSetting: s, assetInformation: ai }) => ({
    Menu: s.menu.connect(Menu),
    menuOpen: s.menu.dialog.open,
    selectedLanguage: s.language,
    languages: s.languages,
    setView: s.setView,
    view: s.view,
    setLanguage: s.setLanguage,
    theme: s.theme,
    setTheme: s.setTheme,
    candleCountdown: s.candleCountdown,
    showCandleCountdown: s.showCandleCountdown,
    closeMenu: s.menu.onTitleClick,
    assetInformation: ai.visible,
    setAssetInformation: ai.setVisible,
}))(ChartSetting);
