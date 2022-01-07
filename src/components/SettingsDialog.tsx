import { observer } from 'mobx-react-lite';
import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import SettingsDialogStore from 'src/store/SettingsDialogStore';
import { TObject, TSettingsItem, TSettingsItemGroup } from 'src/types';
import '../../sass/components/_settings-dialog.scss';
import {
    ColorPicker,
    DropDown,
    FontSetting,
    FormGroup,
    NumberColorPicker,
    NumericInput,
    Pattern,
    Slider,
    Switch,
} from './Form';
import { DeleteIcon } from './Icons';
import Menu from './Menu';
import Scroll from './Scroll';

type TSettingsPanelItem = {
    group?: string;
    title: string;
    type: string;
    Field: React.ReactChild;
};

type TSettingsPanelProps = {
    freezeScroll?: boolean;
    theme: string;
    formClassname?: string;
    setScrollPanel?: ((ref: HTMLDivElement) => void) | undefined;
    itemGroups: TSettingsItemGroup[];
    onItemChange: (id: string, value: string | number | boolean | TObject) => void;
};

type TSettingsPanelGroupProps = {
    title: string;
    theme: string;
    items: TSettingsItem[];
    onItemChange: (id: string, value: string | number | boolean | TObject) => void;
};

type TDoneButtonProps = {
    onClick: React.MouseEventHandler;
};

type TResetButtonProps = {
    onClick: React.MouseEventHandler;
};

type TFooterProps = {
    onDelete?: React.MouseEventHandler;
    onReset: React.MouseEventHandler;
    onDone: React.MouseEventHandler;
};

type TSettingsDialogProps = {
    store: SettingsDialogStore;
};

const SettingsPanelItem = ({ group, title, type, Field }: TSettingsPanelItem) => (
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
}: TSettingsPanelGroupProps) => {
    const renderMap = {
        switch: (item: TSettingsItem) => (
            <Switch value={item.value as string} onChange={v => onItemChange(item.id, v)} />
        ),
        colorpicker: (item: TSettingsItem) => (
            <ColorPicker
                theme={theme}
                color={item.value as string}
                subtitle={item.subtitle || item.title}
                setColor={value => onItemChange(item.id, value)}
            />
        ),
        pattern: (item: TSettingsItem) => {
            const lineWidth = items.find(it => it.id === 'lineWidth')?.value;
            return (
                <Pattern
                    pattern={item.value as string}
                    lineWidth={lineWidth as string}
                    subtitle={item.title}
                    onChange={v => {
                        onItemChange('pattern', v.pattern);
                        onItemChange('lineWidth', v.width);
                    }}
                />
            );
        },
        select: (item: TSettingsItem) => (
            <DropDown<string>
                rows={Object.keys(item.options || {})}
                value={item.value as string}
                subtitle={item.subtitle || item.title}
                onRowClick={value => onItemChange(item.id, value)}
            >
                {row => row}
            </DropDown>
        ),
        number: (item: TSettingsItem) => (
            <Slider
                min={item.min ?? 1}
                step={item.step ?? 1}
                max={item.max ?? 100}
                value={(item.value as unknown) as number}
                onChange={val => onItemChange(item.id, val)}
            />
        ),
        numericinput: (item: TSettingsItem) => (
            <span className='ciq-num-input'>
                <NumericInput
                    value={item.value as string}
                    onChange={val => onItemChange(item.id, val)}
                    min={item.min}
                    step={item.step}
                    max={item.max}
                />
            </span>
        ),
        numbercolorpicker: (item: TSettingsItem) => (
            <NumberColorPicker
                value={
                    item.value as {
                        Value: string;
                        Color: string;
                    }
                }
                theme={theme}
                onChange={val => onItemChange(item.id, val)}
            />
        ),
        font: (item: TSettingsItem) => (
            <FontSetting value={item.value as Record<string, string>} onChange={val => onItemChange(item.id, val)} />
        ),
    };

    const input_group_name = `form__input-group--${(title || '').toLowerCase().replace(' ', '-')}`;

    return (
        <div className={`form__input-group ${input_group_name}`}>
            {title === 'Show Zones' ? '' : <h4>{title}</h4>}
            {items.map(
                item =>
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

const Footer = ({ onDelete, onReset, onDone }: TFooterProps) => (
    <div className='buttons'>
        {onDelete && <DeleteIcon className='sc-btn--delete' onClick={onDelete} />}
        <div>
            <ResetButton onClick={onReset} />
            <DoneButton onClick={onDone} />
        </div>
    </div>
);

const SettingsPanel = ({
    itemGroups,
    theme,
    onItemChange,
    setScrollPanel,
    freezeScroll,
    formClassname,
}: TSettingsPanelProps) => (
    <div className={`form form--indicator-setting ${formClassname}`}>
        <Scroll setPanel={setScrollPanel} freeze={freezeScroll} autoHide height='282px'>
            {itemGroups.map(
                group =>
                    group.fields.length > 0 && (
                        <SettingsPanelGroup
                            key={group.key}
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

const ResetButton = ({ onClick }: TResetButtonProps) => (
    <button type='button' className='sc-btn sc-btn--outline-secondary sc-btn--reset' onClick={onClick}>
        {t.translate('Reset')}
    </button>
);

const DoneButton = ({ onClick }: TDoneButtonProps) => (
    <button type='button' className='sc-btn sc-btn--primary sc-btn--save' onClick={onClick}>
        {t.translate('Done')}
    </button>
);

const SettingsDialog = ({ store }: TSettingsDialogProps) => {
    const {
        itemGroups,
        title,
        formClassname,
        description,
        showTabs,
        onResetClick,
        onItemChange,
        onItemDelete,
        menuStore,
        theme,
        setScrollPanel,
        dialogPortalNodeId,
        freezeScroll,
    } = store;

    const close = menuStore.handleCloseDialog;

    return (
        <Menu
            store={menuStore}
            className='cq-modal--settings'
            title={title}
            modalMode
            enableTabular={showTabs}
            emptyMenu
            portalNodeId={dialogPortalNodeId}
        >
            <Menu.Title />
            <Menu.Body>
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
            </Menu.Body>
        </Menu>
    );
};
export default observer(SettingsDialog);
