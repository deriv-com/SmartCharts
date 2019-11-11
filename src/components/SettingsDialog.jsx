import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
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

const SettingsPanel = ({
    items,
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
                title={item.value}
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

    return (
        <div className="items">
            {items
                .map(item => (renderMap[item.type]
                        && (
                            <div key={item.id} className="item">
                                <div className="title">
                                    <span>{item.title}</span>
                                    {renderMap[item.type](item)}
                                </div>
                            </div>
                        )
                ))
            }
        </div>
    );
};

const ResetButton = ({
    onResetClick,
}) => (
    <div
        className="reset"
        onClick={onResetClick}
    >{t.translate('RESET')}
    </div>
);

const DoneButton = ({
    setOpen,
}) => (
    <div
        className="done"
        onClick={() => setOpen(false)}
    >{t.translate('DONE')}
    </div>
);

const SettingsDialog = ({
    items, // [{ id, title, value, defaultValue, type }]
    title,
    description,
    setOpen,
    showTabs,
    onResetClick,
    onItemChange,
    Dialog,
    theme,
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
                            items={items}
                            theme={theme}
                            onItemChange={onItemChange}
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
                    items={items}
                    theme={theme}
                    onItemChange={onItemChange}
                />
                <div className="buttons">
                    <ResetButton onResetClick={onResetClick} />
                    <DoneButton setOpen={setOpen} />
                </div>
            </>
            )}
    </Dialog>

);
export default SettingsDialog;
