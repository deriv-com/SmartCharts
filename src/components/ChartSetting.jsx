/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import classNames from 'classnames';
import { connect } from '../store/Connect';
import { FormGroup, SwitchIcon } from './Form.jsx';
import {
    SettingIcon,
    LanguageIcon,
    ThemeIcon,
    ChartIcon,
    ThemeLightIcon,
    ThemeDarkIcon,
    SettingCountdownMap,
    SettingHistoricalMap,
    SettingHighestLowestMap,
} from './Icons.jsx';
import '../../sass/components/_chart-setting.scss';

const ChartSettingItem = ({ title, id, label, value, onChange, noramIcon, activeIcon }) => (
    <FormGroup title={title} type={id}>
        <SwitchIcon
            id={id}
            label={label}
            value={value}
            onChange={onChange}
            noramIcon={noramIcon}
            activeIcon={activeIcon}
        />
    </FormGroup>
);

const ChartSetting = ({
    ChartSettingMenu,
    countdown,
    historical,
    isHighestLowestMarkerEnabled,
    languages,
    menuOpen,
    selectedLanguage,
    setHistorical,
    setLanguage,
    setTheme,
    showCountdown,
    theme,
    toggleHighestLowestMarker,
}) => (
    <ChartSettingMenu className='sc-chart-setting' title={t.translate('Platform settings')} enableTabular modalMode>
        <ChartSettingMenu.Title>
            <SettingIcon
                className={classNames('ic-icon-with-sub', { active: menuOpen })}
                tooltip-title={t.translate('Settings')}
            />
        </ChartSettingMenu.Title>
        <ChartSettingMenu.Body>
            <Tabs className='tabs--vertical'>
                <TabList>
                    <Tab key='theme'>
                        <ThemeIcon />
                        {t.translate('Themes')}
                    </Tab>
                    <Tab key='language'>
                        <LanguageIcon />
                        {t.translate('Language')}
                    </Tab>
                    <Tab key='platform'>
                        <ChartIcon />
                        {t.translate('Charts')}
                    </Tab>
                </TabList>
                <TabPanel>
                    <div className='sc-chart-setting__panel'>
                        <FormGroup title={t.translate('Select theme')} type='theme'>
                            <div
                                className={classNames('form__group__item', {
                                    'form__group__item--active': theme === 'dark',
                                })}
                                onClick={() => setTheme('dark')}
                            >
                                <ThemeDarkIcon />
                                <div className='text'>{t.translate('Dark')}</div>
                            </div>
                            <div
                                className={classNames('form__group__item', {
                                    'form__group__item--active': theme === 'light',
                                })}
                                onClick={() => setTheme('light')}
                            >
                                <ThemeLightIcon />
                                <div className='text'>{t.translate('Light')}</div>
                            </div>
                        </FormGroup>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className='sc-chart-setting__panel'>
                        <FormGroup title={t.translate('Select language')} type='language'>
                            {languages.map(language => (
                                <div
                                    key={language.key}
                                    onClick={() => setLanguage(language.key)}
                                    className={classNames('form__group__item', {
                                        'form__group__item--active': selectedLanguage.key === language.key,
                                    })}
                                >
                                    {language.icon}
                                    <span className='text'>{language.name}</span>
                                </div>
                            ))}
                        </FormGroup>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className='sc-chart-setting__panel'>
                        <ChartSettingItem
                            title={t.translate('Interval duration')}
                            id='countdown'
                            label={t.translate('Display remaining time for each interval')}
                            value={countdown}
                            onChange={showCountdown}
                            noramIcon={SettingCountdownMap[theme].normal}
                            activeIcon={SettingCountdownMap[theme].active}
                        />

                        <ChartSettingItem
                            title={t.translate('Historical data mode')}
                            id='historical'
                            label={t.translate('Display data for a specific date and time')}
                            value={historical}
                            onChange={setHistorical}
                            noramIcon={SettingHistoricalMap[theme].normal}
                            activeIcon={SettingHistoricalMap[theme].active}
                        />

                        <FormGroup title={t.translate('Highest and lowest spot')} id='highestlowest'>
                            <SwitchIcon
                                id='highestlowest'
                                label={t.translate('Display the highest and lowest spot price')}
                                value={isHighestLowestMarkerEnabled}
                                onChange={toggleHighestLowestMarker}
                                noramIcon={SettingHighestLowestMap[theme].normal}
                                activeIcon={SettingHighestLowestMap[theme].active}
                            />
                        </FormGroup>
                    </div>
                </TabPanel>
            </Tabs>
        </ChartSettingMenu.Body>
    </ChartSettingMenu>
);

export default connect(({ chartSetting: s }) => ({
    ChartSettingMenu: s.ChartSettingMenu,
    closeMenu: s.menu.onTitleClick,
    countdown: s.countdown,
    historical: s.historical,
    isAutoScale: s.isAutoScale,
    isHighestLowestMarkerEnabled: s.isHighestLowestMarkerEnabled,
    languages: s.languages,
    menuOpen: s.menu.dialog.open,
    selectedLanguage: s.language,
    setAutoScale: s.setAutoScale,
    setHistorical: s.setHistorical,
    setLanguage: s.setLanguage,
    setTheme: s.setTheme,
    showCountdown: s.showCountdown,
    theme: s.theme,
    toggleHighestLowestMarker: s.toggleHighestLowestMarker,
}))(ChartSetting);
