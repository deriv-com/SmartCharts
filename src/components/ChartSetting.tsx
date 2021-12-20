/* eslint-disable jsx-a11y/no-static-element-interactions */
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { useStores } from 'src/store';
import { TMainStore, TLanguage, TIcon } from 'src/types';
import '../../sass/components/_chart-setting.scss';
import { FormGroup, SwitchIcon } from './Form';
import {
    ChartIcon,
    LanguageIcon,
    SettingCountdownMap,
    SettingHighestLowestMap,
    SettingHistoricalMap,
    SettingIcon,
    ThemeDarkIcon,
    ThemeIcon,
    ThemeLightIcon,
} from './Icons';
import Menu from './Menu';

type ChartSettingsItemProps = {
    title: string;
    id: string;
    label: string;
    value: boolean;
    onChange: TMainStore['chartSetting']['showCountdown'];
    noramIcon: TIcon;
    activeIcon: TIcon;
};

const ChartSettingItem = ({ title, id, label, value, onChange, noramIcon, activeIcon }: ChartSettingsItemProps) => (
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

const ChartSetting = () => {
    const { chartSetting } = useStores();
    const {
        menuStore,
        countdown,
        historical,
        isHighestLowestMarkerEnabled,
        languages,
        language: selectedLanguage,
        setHistorical,
        setLanguage,
        setTheme,
        showCountdown,
        theme,
        toggleHighestLowestMarker,
    } = chartSetting;

    const menuOpen = menuStore.dialogStore.open;

    return (
        <Menu
            store={menuStore}
            className='sc-chart-setting'
            title={t.translate('Platform settings')}
            enableTabular
            modalMode
        >
            <Menu.Title>
                <SettingIcon
                    className={classNames('ic-icon-with-sub', { active: menuOpen })}
                    tooltip-title={t.translate('Settings')}
                />
            </Menu.Title>
            <Menu.Body>
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
                                {(languages as Array<TLanguage>).map(language => (
                                    <div
                                        key={language.key}
                                        onClick={() => setLanguage(language.key)}
                                        className={classNames('form__group__item', {
                                            'form__group__item--active':
                                                (selectedLanguage as TLanguage)?.key === language.key,
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
                                noramIcon={SettingCountdownMap[theme as keyof typeof SettingCountdownMap].normal}
                                activeIcon={SettingCountdownMap[theme as keyof typeof SettingCountdownMap].active}
                            />

                            <ChartSettingItem
                                title={t.translate('Historical data mode')}
                                id='historical'
                                label={t.translate('Display data for a specific date and time')}
                                value={historical}
                                onChange={setHistorical}
                                noramIcon={SettingHistoricalMap[theme as keyof typeof SettingHistoricalMap].normal}
                                activeIcon={SettingHistoricalMap[theme as keyof typeof SettingHistoricalMap].active}
                            />

                            <FormGroup title={t.translate('Highest and lowest spot')}>
                                <SwitchIcon
                                    id='highestlowest'
                                    label={t.translate('Display the highest and lowest spot price')}
                                    value={isHighestLowestMarkerEnabled}
                                    onChange={toggleHighestLowestMarker}
                                    noramIcon={
                                        SettingHighestLowestMap[theme as keyof typeof SettingHighestLowestMap].normal
                                    }
                                    activeIcon={
                                        SettingHighestLowestMap[theme as keyof typeof SettingHighestLowestMap].active
                                    }
                                />
                            </FormGroup>
                        </div>
                    </TabPanel>
                </Tabs>
            </Menu.Body>
        </Menu>
    );
};

export default observer(ChartSetting);
