/* eslint-disable jsx-a11y/no-static-element-interactions */
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Form.jsx' was resolved to '/Users/balakr... Remove this comment to see the full error message
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
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons.jsx' was resolved to '/Users/balak... Remove this comment to see the full error message
} from './Icons.jsx';
import '../../sass/components/_chart-setting.scss';

const ChartSettingItem = ({
    title,
    id,
    label,
    value,
    onChange,
    noramIcon,
    activeIcon,
}: any) => (
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <FormGroup title={title} type={id}>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
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
}: any) => (
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <ChartSettingMenu className='sc-chart-setting' title={t.translate('Platform settings')} enableTabular modalMode>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <ChartSettingMenu.Title>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <SettingIcon
                className={classNames('ic-icon-with-sub', { active: menuOpen })}
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                tooltip-title={t.translate('Settings')}
            />
        </ChartSettingMenu.Title>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <ChartSettingMenu.Body>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Tabs className='tabs--vertical'>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <TabList>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <Tab key='theme'>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <ThemeIcon />
                        {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
                        {t.translate('Themes')}
                    </Tab>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <Tab key='language'>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <LanguageIcon />
                        {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
                        {t.translate('Language')}
                    </Tab>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <Tab key='platform'>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <ChartIcon />
                        {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
                        {t.translate('Charts')}
                    </Tab>
                </TabList>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <TabPanel>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <div className='sc-chart-setting__panel'>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <FormGroup title={t.translate('Select theme')} type='theme'>
                            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                            <div
                                className={classNames('form__group__item', {
                                    'form__group__item--active': theme === 'dark',
                                })}
                                onClick={() => setTheme('dark')}
                            >
                                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                                <ThemeDarkIcon />
                                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                <div className='text'>{t.translate('Dark')}</div>
                            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                            </div>
                            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                            <div
                                className={classNames('form__group__item', {
                                    'form__group__item--active': theme === 'light',
                                })}
                                onClick={() => setTheme('light')}
                            >
                                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                                <ThemeLightIcon />
                                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                <div className='text'>{t.translate('Light')}</div>
                            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                            </div>
                        </FormGroup>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    </div>
                </TabPanel>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <TabPanel>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <div className='sc-chart-setting__panel'>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <FormGroup title={t.translate('Select language')} type='language'>
                            {languages.map((language: any) => (
// @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
<div
                                key={language.key}
                                onClick={() => setLanguage(language.key)}
                                className={classNames('form__group__item', {
                                    'form__group__item--active': selectedLanguage.key === language.key,
                                })}
>
                                {language.icon}
                                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                <span className='text'>{language.name}</span>
// @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
</div>
))}
                        </FormGroup>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    </div>
                </TabPanel>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <TabPanel>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <div className='sc-chart-setting__panel'>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <ChartSettingItem
                            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                            title={t.translate('Interval duration')}
                            id='countdown'
                            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                            label={t.translate('Display remaining time for each interval')}
                            value={countdown}
                            onChange={showCountdown}
                            noramIcon={SettingCountdownMap[theme].normal}
                            activeIcon={SettingCountdownMap[theme].active}
                        />

                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <ChartSettingItem
                            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                            title={t.translate('Historical data mode')}
                            id='historical'
                            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                            label={t.translate('Display data for a specific date and time')}
                            value={historical}
                            onChange={setHistorical}
                            noramIcon={SettingHistoricalMap[theme].normal}
                            activeIcon={SettingHistoricalMap[theme].active}
                        />

                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <FormGroup title={t.translate('Highest and lowest spot')} id='highestlowest'>
                            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                            <SwitchIcon
                                id='highestlowest'
                                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                                label={t.translate('Display the highest and lowest spot price')}
                                value={isHighestLowestMarkerEnabled}
                                onChange={toggleHighestLowestMarker}
                                noramIcon={SettingHighestLowestMap[theme].normal}
                                activeIcon={SettingHighestLowestMap[theme].active}
                            />
                        </FormGroup>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    </div>
                </TabPanel>
            </Tabs>
        </ChartSettingMenu.Body>
    </ChartSettingMenu>
);

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
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
