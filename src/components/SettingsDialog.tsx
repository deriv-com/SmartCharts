// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Scroll.jsx' was resolved to '/Users/bala... Remove this comment to see the full error message
import Scroll from './Scroll.jsx';
import {
    FormGroup,
    Switch,
    NumericInput,
    ColorPicker,
    Slider,
    Pattern,
    DropDown,
    NumberColorPicker,
    FontSetting,
// @ts-expect-error ts-migrate(6142) FIXME: Module './Form.jsx' was resolved to '/Users/balakr... Remove this comment to see the full error message
} from './Form.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons.jsx' was resolved to '/Users/balak... Remove this comment to see the full error message
import { DeleteIcon } from './Icons.jsx';
import '../../sass/components/_settings-dialog.scss';

const SettingsPanelItem = ({
    group,
    title,
    type,
    Field,
}: any) => (
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <FormGroup
        title={
            type === 'select' ||
            type === 'pattern' ||
            type === 'colorpicker' ||
            type === 'numbercolorpicker' ||
            group === 'OverBought' ||
            group === 'OverSold'
                ? null
                : title
        }
        type={type}
    >
        {Field}
    </FormGroup>
);

const SettingsPanelGroup = ({
    title,

    // [{ id, title, value, defaultValue, type }]
    items,

    theme,
    onItemChange,
}: any) => {
    const renderMap = {
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        switch: (item: any) => <Switch value={item.value} onChange={(v: any) => onItemChange(item.id, v)} />,
        colorpicker: (item: any) => (
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
<ColorPicker
            theme={theme}
            color={item.value}
            subtitle={item.subtitle || item.title}
            setColor={(value: any) => onItemChange(item.id, value)}
/>
),
        pattern: (item: any) => {
            const lineWidth = items.find((it: any) => it.id === 'lineWidth').value;
            return (
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Pattern
                    pattern={item.value}
                    lineWidth={lineWidth}
                    subtitle={item.title}
                    onChange={(v: any) => {
                        onItemChange('pattern', v.pattern);
                        onItemChange('lineWidth', v.width);
                    }}
                />
            );
        },
        select: (item: any) => (
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
<DropDown
            rows={Object.keys(item.options)}
            value={item.value}
            subtitle={item.subtitle || item.title}
            onRowClick={(value: any) => onItemChange(item.id, value)}
>
            {(row: any) => row}
</DropDown>
),
        number: (item: any) => (
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
<Slider
            min={item.min || 1}
            step={item.step || 1}
            max={item.max || 100}
            value={item.value}
            onChange={(val: any) => onItemChange(item.id, val)}
/>
),
        numericinput: (item: any) => (
// @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
<span className='ciq-num-input'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <NumericInput
                value={item.value}
                onChange={(val: any) => onItemChange(item.id, val)}
                min={item.min}
                step={item.step}
                max={item.max}
            />
// @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
</span>
),
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        numbercolorpicker: (item: any) => <NumberColorPicker value={item.value} theme={theme} onChange={(val: any) => onItemChange(item.id, val)} />,
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        font: (item: any) => <FontSetting value={item.value} onChange={(val: any) => onItemChange(item.id, val)} />,
    };

    const input_group_name = `form__input-group--${(title || '').toLowerCase().replace(' ', '-')}`;

    return (
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className={`form__input-group ${input_group_name}`}>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            {title === 'Show Zones' ? '' : <h4>{title}</h4>}
            {items.map(
                // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                (item: any) => renderMap[item.type] && (
                    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <SettingsPanelItem
                        key={item.id}
                        type={item.type}
                        active={item.active}
                        title={title === 'Show Zones' ? item.title : item.title.replace(title, '')}
                        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                        Field={renderMap[item.type](item)}
                    />
                )
            )}
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <FormGroup type='end' />
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    );
};

const Footer = ({
    onDelete,
    onReset,
    onDone,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className='buttons'>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        {onDelete && <DeleteIcon className='sc-btn--delete' onClick={onDelete} />}
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <div>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <ResetButton onClick={onReset} />
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <DoneButton onClick={onDone} />
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);

const SettingsPanel = ({
    itemGroups,
    theme,
    onItemChange,
    setScrollPanel,
    freezeScroll,
    formClassname,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className={`form form--indicator-setting ${formClassname}`}>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <Scroll setPanel={setScrollPanel} freeze={freezeScroll} autoHide height='282px'>
            {itemGroups.map(
                (group: any) => group.fields.length > 0 && (
                    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <SettingsPanelGroup
                        key={group.key}
                        group={group.key}
                        title={group.key}
                        items={group.fields}
                        theme={theme}
                        onItemChange={onItemChange}
                    />
                )
            )}
        </Scroll>
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);

const ResetButton = ({
    onClick,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <button type='button' className='sc-btn sc-btn--outline-secondary sc-btn--reset' onClick={onClick}>
        {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
        {t.translate('Reset')}
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </button>
);

const DoneButton = ({
    onClick,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <button type='button' className='sc-btn sc-btn--primary sc-btn--save' onClick={() => onClick()}>
        {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
        {t.translate('Done')}
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </button>
);

const SettingsDialog = ({
    itemGroups,
    title,
    formClassname,
    description,
    showTabs,
    onResetClick,
    onItemChange,
    onItemDelete,
    SettingDialogMenu,
    theme,
    close,
    setScrollPanel,
    dialogPortalNodeId,
    freezeScroll,
}: any) => (
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <SettingDialogMenu
        className='cq-modal--settings'
        title={title}
        modalMode
        enableTabular={showTabs}
        emptyMenu
        enableOverlay // this temprary, we remove it when all menus convert to modal
        portalNodeId={dialogPortalNodeId}
    >
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <SettingDialogMenu.Title />
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <SettingDialogMenu.Body>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='cq-chart-settings'>
                {showTabs ? (
                    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <Tabs className='tabs--vertical'>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <TabList>
                            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                            <Tab>Settings</Tab>
                            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                            <Tab>Description</Tab>
                        </TabList>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <TabPanel>
                            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                            <SettingsPanel
                                itemGroups={itemGroups}
                                theme={theme}
                                onItemChange={onItemChange}
                                setScrollPanel={setScrollPanel}
                                freezeScroll={freezeScroll}
                            />
                            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                            <Footer onReset={onResetClick} onDone={close} />
                        </TabPanel>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <TabPanel>{description}</TabPanel>
                    </Tabs>
                ) : (
                    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <SettingsPanel
                            itemGroups={itemGroups}
                            theme={theme}
                            onItemChange={onItemChange}
                            setScrollPanel={setScrollPanel}
                            freezeScroll={freezeScroll}
                            formClassname={formClassname}
                        />
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <Footer onDelete={onItemDelete} onReset={onResetClick} onDone={close} />
                    </>
                )}
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        </SettingDialogMenu.Body>
    </SettingDialogMenu>
);
export default SettingsDialog;
