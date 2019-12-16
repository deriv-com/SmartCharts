import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Scrollbars from 'tt-react-custom-scrollbars';
import {
    Switch,
    NumericInput,
    ColorPicker,
    Slider,
    Pattern,
    DropDown,
    NumberColorPicker,
    FontSetting,
} from './Form.jsx';
import '../../sass/components/_ciq-settings-dialog.scss';
import 'react-tabs/style/react-tabs.css';

const SettingsPanelItem = ({ group, title, type, Field }) => (
    <div className={`form__group form__group--${type}`}>
        {(type === 'select'
         || type === 'colorpicker'
         || group === 'OverBought'
         || group === 'OverSold'
        )
            ? ''
            : (
                <div className="form__label">
                    <span> {title} </span>
                </div>
            )}
        <div className="form__control">
            {Field}
        </div>
    </div>
);


const SettingsPanelGroup = ({
    title,
    items, // [{ id, title, value, defaultValue, type }]
    theme,
    onItemChange,
}) => {
    const renderMap = {
        switch: item => (
            <Switch
                value={item.value}
                onChange={v => onItemChange(item.id, v)}
            />
        ),
        colorpicker: item => (
            <ColorPicker
                theme={theme}
                color={item.value}
                subtitle={item.title}
                setColor={value => onItemChange(item.id, value)}
            />
        ),
        pattern: (item) => {
            const lineWidth = items.find(it => it.id === 'lineWidth').value;
            return (
                <Pattern
                    pattern={item.value}
                    lineWidth={lineWidth}
                    onChange={(v) => {
                        onItemChange('pattern', v.pattern);
                        onItemChange('lineWidth', v.width);
                    }}
                />
            );
        },
        select: item => (
            <DropDown
                rows={Object.keys(item.options)}
                value={item.value}
                subtitle={item.title}
                onRowClick={value => onItemChange(item.id, value)}
            >
                {row => row}
            </DropDown>
        ),
        number: item => (
            <Slider
                min={item.min || 1}
                step={item.step || 1}
                max={item.max || 100}
                value={item.value}
                onChange={val => onItemChange(item.id, val)}
            />
        ),
        numericinput: item => (
            <span className="ciq-num-input">
                <NumericInput
                    value={item.value}
                    onChange={val => onItemChange(item.id, val)}
                    min={item.min}
                    step={item.step}
                    max={item.max}
                />
            </span>
        ),
        numbercolorpicker: item => (
            <NumberColorPicker
                value={item.value}
                theme={theme}
                onChange={val => onItemChange(item.id, val)}
            />
        ),
        font: item => (
            <FontSetting
                value={item.value}
                onChange={val => onItemChange(item.id, val)}
            />
        ),
    };

    const input_group_name = `form__input-group--${title.toLowerCase().replace(' ', '-')}`;

    return (
        <div className={`form__input-group ${input_group_name}`}>
            {title === 'Show Zones' ? '' : (<h4>{title}</h4>)}
            {items.map(item => (renderMap[item.type]
                && (
                    <SettingsPanelItem
                        key={item.id}
                        group={title}
                        type={item.type}
                        active={item.active}
                        title={item.title}
                        Field={renderMap[item.type](item)}
                    />
                )
            ))}
        </div>
    );
};


const SettingsPanel = ({
    itemGroups,
    theme,
    onItemChange,
    setScrollPanel,
}) => (
    <Scrollbars
        className="form form--indicator-setting"
        ref={setScrollPanel}
        autoHide
    >
        {itemGroups.map(group => (group.fields.length
            ? (
                <SettingsPanelGroup
                    key={group.key}
                    title={group.key}
                    items={group.fields}
                    theme={theme}
                    onItemChange={onItemChange}
                />
            ) : ''
        ))
        }
    </Scrollbars>
);


const ResetButton = ({
    onResetClick,
}) => (
    <button
        type="button"
        className="reset"
        onClick={onResetClick}
    >{t.translate('Reset')}
    </button>
);

const DoneButton = ({
    setOpen,
}) => (
    <button
        type="button"
        className="done"
        onClick={() => setOpen(false)}
    >{t.translate('Save')}
    </button>
);

const CancelButton = ({
    setOpen,
}) => (
    <button
        type="button"
        className="cancel"
        onClick={() => setOpen(false)}
    >{t.translate('Cancel')}
    </button>
);

const SettingsDialog = ({
    itemGroups,
    title,
    description,
    setOpen,
    showTabs,
    onResetClick,
    onItemChange,
    Dialog,
    theme,
    setScrollPanel,
}) => (
    <Dialog
        className="cq-dialog cq-settings-dialog"
        title={title}
        enableTabular={showTabs}
        enableOverlay // this temprary, we remove it when all menus convert to modal
    >
        {showTabs
            ? (
                <Tabs className="tabs--vertical">
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
                        />
                        <div className="buttons">
                            <ResetButton onResetClick={onResetClick} />
                            <DoneButton setOpen={setOpen} />
                        </div>
                    </TabPanel>
                    <TabPanel>
                        {description}
                    </TabPanel>
                </Tabs>
            ) : (
            <>
                <SettingsPanel
                    itemGroups={itemGroups}
                    theme={theme}
                    onItemChange={onItemChange}
                    setScrollPanel={setScrollPanel}
                />
                <div className="buttons">
                    <ResetButton onResetClick={onResetClick} />
                    <div>
                        <CancelButton setOpen={setOpen} />
                        <DoneButton setOpen={setOpen} />
                    </div>
                </div>
            </>
            )}
    </Dialog>

);
export default SettingsDialog;
