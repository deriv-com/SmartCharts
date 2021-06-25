import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Scroll from './Scroll';
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
} from './Form';
import { DeleteIcon } from './Icons';
import '../../sass/components/_settings-dialog.scss';

type TSettingsPanelItem = {
    group?: string;
    title: string;
    type: string;
    Field: React.ReactChild;
};

const SettingsPanelItem: React.FC<TSettingsPanelItem> = ({ group, title, type, Field }) => (
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
        switch: (item: any) => <Switch value={item.value} onChange={(v: any) => onItemChange(item.id, v)} />,
        colorpicker: (item: any) => (
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
            <Slider
                min={item.min || 1}
                step={item.step || 1}
                max={item.max || 100}
                value={item.value}
                onChange={(val: any) => onItemChange(item.id, val)}
            />
        ),
        numericinput: (item: any) => (
            <span className='ciq-num-input'>
                <NumericInput
                    value={item.value}
                    onChange={(val: any) => onItemChange(item.id, val)}
                    min={item.min}
                    step={item.step}
                    max={item.max}
                />
            </span>
        ),
        numbercolorpicker: (item: any) => (
            <NumberColorPicker value={item.value} theme={theme} onChange={(val: any) => onItemChange(item.id, val)} />
        ),
        font: (item: any) => <FontSetting value={item.value} onChange={(val: any) => onItemChange(item.id, val)} />,
    };

    const input_group_name = `form__input-group--${(title || '').toLowerCase().replace(' ', '-')}`;

    return (
        <div className={`form__input-group ${input_group_name}`}>
            {title === 'Show Zones' ? '' : <h4>{title}</h4>}
            {items.map(
                (item: any) =>
                    renderMap[item.type as keyof typeof renderMap] && (
                        <SettingsPanelItem
                            key={item.id}
                            type={item.type}
                            title={title === 'Show Zones' ? item.title : item.title.replace(title, '')}
                            Field={renderMap[item.type as keyof typeof renderMap](item)}
                        />
                    )
            )}
            <FormGroup type='end' />
        </div>
    );
};

const Footer = ({ onDelete, onReset, onDone }: any) => (
    <div className='buttons'>
        {onDelete && <DeleteIcon className='sc-btn--delete' onClick={onDelete} />}
        <div>
            <ResetButton onClick={onReset} />
            <DoneButton onClick={onDone} />
        </div>
    </div>
);

const SettingsPanel = ({ itemGroups, theme, onItemChange, setScrollPanel, freezeScroll, formClassname }: any) => (
    <div className={`form form--indicator-setting ${formClassname}`}>
        <Scroll setPanel={setScrollPanel} freeze={freezeScroll} autoHide height='282px'>
            {itemGroups.map(
                (group: any) =>
                    group.fields.length > 0 && (
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
    </div>
);

const ResetButton = ({ onClick }: any) => (
    <button type='button' className='sc-btn sc-btn--outline-secondary sc-btn--reset' onClick={onClick}>
        {t.translate('Reset')}
    </button>
);

const DoneButton = ({ onClick }: any) => (
    <button type='button' className='sc-btn sc-btn--primary sc-btn--save' onClick={() => onClick()}>
        {t.translate('Done')}
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
    <SettingDialogMenu
        className='cq-modal--settings'
        title={title}
        modalMode
        enableTabular={showTabs}
        emptyMenu
        enableOverlay // this temprary, we remove it when all menus convert to modal
        portalNodeId={dialogPortalNodeId}
    >
        <SettingDialogMenu.Title />
        <SettingDialogMenu.Body>
            <div className='cq-chart-settings'>
                {showTabs ? (
                    <Tabs className='tabs--vertical'>
                        <TabList>
                            <Tab>Settings</Tab>
                            <Tab>Description</Tab>
                        </TabList>
                        <TabPanel>
                            <SettingsPanel
                                itemGroups={itemGroups}
                                theme={theme}
                                onItemChange={onItemChange}
                                setScrollPanel={setScrollPanel}
                                freezeScroll={freezeScroll}
                            />
                            <Footer onReset={onResetClick} onDone={close} />
                        </TabPanel>
                        <TabPanel>{description}</TabPanel>
                    </Tabs>
                ) : (
                    <>
                        <SettingsPanel
                            itemGroups={itemGroups}
                            theme={theme}
                            onItemChange={onItemChange}
                            setScrollPanel={setScrollPanel}
                            freezeScroll={freezeScroll}
                            formClassname={formClassname}
                        />
                        <Footer onDelete={onItemDelete} onReset={onResetClick} onDone={close} />
                    </>
                )}
            </div>
        </SettingDialogMenu.Body>
    </SettingDialogMenu>
);
export default SettingsDialog;
