/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { connect } from '../store/Connect';
import { Switch } from './Form.jsx';
import {
    SettingIcon,
    ThemeLightIcon,
    ThemeDarkIcon,
} from './Icons.jsx';
import '../../sass/components/_sc-chart-setting.scss';

const ChartSetting = ({
    ChartSettingMenu,
    countdown,
    historical,
    isAutoScale,
    isHighestLowestMarkerEnabled,
    languages,
    menuOpen,
    selectedLanguage,
    setAutoScale,
    setHistorical,
    setLanguage,
    setTheme,
    showCountdown,
    theme,
    toggleHighestLowestMarker,
}) => (
    <ChartSettingMenu
        className="sc-chart-setting"
        title={t.translate('Settings')}
        enableTabular
        newStyle
    >
        <ChartSettingMenu.Title>
            <SettingIcon
                className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                tooltip-title={t.translate('Settings')}
            />
        </ChartSettingMenu.Title>
        <ChartSettingMenu.Body>
            <Tabs className="tabs--vertical">
                <TabList>
                    <Tab key="theme">{t.translate('Themes')}</Tab>
                    <Tab key="language">{t.translate('Language')}</Tab>
                    <Tab key="platform">{t.translate('Charts')}</Tab>
                </TabList>
                <TabPanel>
                    <div className="sc-chart-setting__panel">
                        <div className="sc-chart-setting__theme">
                            <div
                                className={`sc-chart-setting__theme__item ${theme === 'light' ? 'sc-chart-setting__theme__item--active' : ''}`}
                                onClick={() => setTheme('light')}
                            >
                                <ThemeLightIcon />
                                <span className="text">{t.translate('Light')}</span>
                            </div>
                            <div
                                className={`sc-chart-setting__theme__item ${theme === 'dark' ? 'sc-chart-setting__theme__item--active' : ''}`}
                                onClick={() => setTheme('dark')}
                            >
                                <ThemeDarkIcon />
                                <span className="text">{t.translate('Dark')}</span>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="sc-chart-setting__panel">
                        <div className="sc-chart-setting__languages">
                            {languages.map(language => (
                                <div
                                    className={`sc-chart-setting__languages__item ${(selectedLanguage.key === language.key) ? 'sc-chart-setting__languages__item--active' : ''}`}
                                    key={language.key}
                                    onClick={() => setLanguage(language.key)}
                                >
                                    {language.icon}
                                    <span className="text">{language.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="sc-chart-setting__panel">
                        <div className="sc-chart-setting__list">
                            <div className="sc-chart-setting__list__item">
                                <span className="text">{t.translate('Auto Scale')}</span>
                                <div className="action">
                                    <Switch
                                        value={isAutoScale}
                                        onChange={setAutoScale}
                                    />
                                </div>
                            </div>
                            <div className="sc-chart-setting__list__item">
                                <span className="text">{t.translate('Countdown')}</span>
                                <div className="action">
                                    <Switch
                                        value={countdown}
                                        onChange={showCountdown}
                                    />
                                </div>
                            </div>
                            <div className="sc-chart-setting__list__item">
                                <span className="text">{t.translate('Historical Data Mode')}</span>
                                <div className="action">
                                    <Switch
                                        value={historical}
                                        onChange={setHistorical}
                                    />
                                </div>
                            </div>
                            <div className={`sc-chart-setting__list__item ${historical && 'disabled'}`}>
                                <span className="text">{t.translate('Show Highest/Lowest Spot')}</span>
                                <div className="action">
                                    <Switch
                                        value={isHighestLowestMarkerEnabled}
                                        onChange={toggleHighestLowestMarker}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
            </Tabs>
        </ChartSettingMenu.Body>
    </ChartSettingMenu>
);

export default connect(({ chartSetting: s }) => ({
    ChartSettingMenu            : s.ChartSettingMenu,
    closeMenu                   : s.menu.onTitleClick,
    countdown                   : s.countdown,
    historical                  : s.historical,
    isAutoScale                 : s.isAutoScale,
    isHighestLowestMarkerEnabled: s.isHighestLowestMarkerEnabled,
    languages                   : s.languages,
    menuOpen                    : s.menu.dialog.open,
    selectedLanguage            : s.language,
    setAutoScale                : s.setAutoScale,
    setHistorical               : s.setHistorical,
    setLanguage                 : s.setLanguage,
    setTheme                    : s.setTheme,
    showCountdown               : s.showCountdown,
    theme                       : s.theme,
    toggleHighestLowestMarker   : s.toggleHighestLowestMarker,
}))(ChartSetting);
