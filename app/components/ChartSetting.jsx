/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import { CSSTransition } from 'react-transition-group';
import Menu from '@binary-com/smartcharts/components/Menu.jsx';
import { connect } from '@binary-com/smartcharts/store/Connect';
import { Switch } from '@binary-com/smartcharts/components/Form.jsx';
import ChartSettingStore from '../store/ChartSettingStore';
import {
    SettingIcon,
    PositionLeftIcon,
    PositionBottomIcon,
    BackIcon,
    CloseIcon,
} from '@binary-com/smartcharts/components/Icons.jsx';
import '../sass/components/_ciq-chart-setting.scss';


const ChartSetting = ({
    Menu,
    menuOpen,
    selectedLanguage,
    languages,
    position,
    setPosition,
    setView,
    view,
    setLanguage,
    theme,
    setTheme,
    countdown,
    setCountdown,
    closeMenu,
    assetInformation,
    setAssetInformation,
    isMobile,
}) => {
    const renderPosition = () => (
        <div>
            <div className="ciq-list-item ciq-list-item-position">
                <span className="ciq-icon-text">{t.translate('Position')}</span>
                <div className="ciq-action">
                    <PositionBottomIcon
                        onClick={() => setPosition('bottom')}
                        className={`${position === 'bottom' ? 'active' : ''}`}
                    />
                    <PositionLeftIcon
                        onClick={() => setPosition('left')}
                        className={`${position === 'left' ? 'active' : ''}`}
                    />
                </div>
            </div>
        </div>);
    const renderMain = () => (
        <div>
            <div className="title">
                <div className="title-text"> {t.translate('Settings')} </div>
                <CloseIcon className="icon-close-menu" onClick={() => closeMenu()} />
            </div>
            <div className="body">
                <div className="ciq-list ciq-list-setting">
                    {!isMobile ? renderPosition() : ''}
                    <div className="ciq-list-item">
                        <span className="ciq-icon-text">{t.translate('Dark Mode')}</span>
                        <div className="ciq-action">
                            <Switch
                                value={(theme === 'dark')}
                                onChange={setTheme}
                            />
                        </div>
                    </div>
                    <div className="ciq-list-item">
                        <span className="ciq-icon-text">{t.translate('Countdown')}</span>
                        <div className="ciq-action">
                            <Switch
                                value={countdown}
                                onChange={setCountdown}
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
    const renderLanguage = () => (
        <div>
            <div className="title">
                <BackIcon
                    onClick={() => setView()}
                />
                {t.translate('Language')}
            </div>
            <div className="body">
                <div className="ciq-list ciq-list-language">
                    {languages.map((language, index) => (
                        <div
                            className={`ciq-list-item ${(selectedLanguage.key === language.key) ? 'selected' : ''}`}
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
                <div className={`cq-setting-container container-${view === '' ? 'main' : view}`}>
                    <CSSTransition
                        in={view === ''}
                        timeout={250}
                        classNames="cq-setting-main animate"
                        unmountOnExit
                    >
                        {renderMain()}
                    </CSSTransition>

                    <CSSTransition
                        in={view === 'language'}
                        timeout={250}
                        classNames="cq-setting-language animate"
                        unmountOnExit
                    >
                        {renderLanguage()}
                    </CSSTransition>
                </div>
            </Menu.Body>
        </Menu>
    );
};

export default connect(
    ChartSettingStore,
    store => ({
        Menu: store.menu.connect(Menu),
        menuOpen: store.menu.dialog.open,
        selectedLanguage: store.language,
        languages: store.languages,
        position: store.position,
        setPosition: store.setPosition,
        setView: store.setView,
        view: store.view,
        setLanguage: store.setLanguage,
        theme: store.theme,
        setTheme: store.setTheme,
        countdown: store.countdown,
        setCountdown: store.setCountdown,
        closeMenu: store.menu.onTitleClick,
        assetInformation: store.assetInformation,
        setAssetInformation: store.setAssetInformation,
        isMobile: store.isMobile,
    }),
    (store, {
        
    }) => {
        
    },
)(ChartSetting);
