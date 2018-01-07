import { DialogContentTag } from './componentUI';
import { CIQ } from '../../js/chartiq';

/**
     * Study Dialogs web component `<cq-study-dialog>`.
     *
     * Creates and manages Study Dialogs based on the corresponding study library entry
     * (title, inputs, outputs, parameters, etc).
     *
     * @name CIQ.WebComponents.cq-study-dialog
     * @example
<cq-dialog cq-study-dialog>
    <cq-study-dialog>
        <h4 class="title">Study</h4>
        <cq-scroll cq-no-maximize>
            <cq-study-inputs>
                <template cq-study-input>
                    <cq-study-input>
                        <div class="ciq-heading"></div>
                        <div class="stx-data">
                            <template cq-menu>
                                <cq-menu class="ciq-select">
                                    <cq-selected></cq-selected>
                                    <cq-menu-dropdown cq-lift></cq-menu-dropdown>
                                </cq-menu>
                            </template>
                        </div>
                    </cq-study-input>
                </template>
            </cq-study-inputs>
            <hr>
            <cq-study-outputs>
                <template cq-study-output>
                    <cq-study-output>
                        <div class="ciq-heading"></div>
                        <cq-swatch cq-overrides="auto"></cq-swatch>
                    </cq-study-output>
                </template>
            </cq-study-outputs>
            <hr>
            <cq-study-parameters>
                <template cq-study-parameters>
                    <cq-study-parameter>
                        <div class="ciq-heading"></div>
                        <div class="stx-data"><cq-swatch cq-overrides="auto"></cq-swatch></div>
                    </cq-study-parameter>
                </template>
            </cq-study-parameters>
        </cq-scroll>
        <div class="ciq-dialog-cntrls">
            <div class="ciq-btn" stxtap="close()">Done</div>
        </div>
    </cq-study-dialog>
</cq-dialog>
     */

class StudyDialog extends DialogContentTag {
    setContext(context) {
        super.setContext(context);
        context.advertiseAs(this, 'StudyDialog');
    }

    attachedCallback() {
        if (this.attached) return;
        super.attachedCallback();
        let dialog = $(this);
        this.inputTemplate = dialog.find('template[cq-study-input]');
        this.outputTemplate = dialog.find('template[cq-study-output]');
        this.parameterTemplate = dialog.find('template[cq-study-parameters]');
        this.attached = true;
        this.queuedUpdates = {};
    }

    hide() {
        if (!CIQ.isEmpty(this.queuedUpdates)) {
            this.helper.updateStudy(this.queuedUpdates);
            this.queuedUpdates = {};
        }
        this.node.find('cq-menu').each(function () {
            if (this.unlift) this.unlift();
        });
        this.node.find('cq-swatch').each(function () {
            if (this.colorPicker) this.colorPicker.close();
        });
    }

    /**
     * Sets up a handler to process changes to input fields
     * @param {HTMLElement} node    The input field
     * @param {string} section The section that is being updated, "inputs","outputs","parameters"
     * @param {string} name    The name of the field being updated
     * @memberOf CIQ.UI.StudyDialog
     * @private
     */
    setChangeEvent(node, section, name) {
        let self = this;

        function closure() {
            return function () {
                let updates = {};
                updates[section] = {};
                updates[section][name] = this.value;
                if (this.type === 'checkbox' || this.type === 'radio') {
                    updates[section][name] = this.checked;
                }
                self.updateStudy(updates);
            };
        }
        node.change(closure());
    }

    updateStudy(updates) {
        if ($(this).find(':invalid').length) return;
        if (this.helper.libraryEntry.deferUpdate) {
            CIQ.extend(this.queuedUpdates, updates);
        } else {
            this.helper.updateStudy(updates);
        }
    }

    /**
     * Accepts new menu (select box) selections
     * @param {object} activator
     */
    setSelectOption(activator) {
        let node = $(activator.node);
        let name = node.attr('name');
        let value = node.attr('value');
        let newInput = $(node[0].cqMenuWrapper);
        let inputValue = newInput.find('cq-selected');
        inputValue.text(this.helper.stx.translateIf(value));
        newInput[0].fieldValue = value;
        let updates = {
            inputs: {},
        };
        updates.inputs[name] = value;
        this.updateStudy(updates);
    }

    open(params) {
        super.open(arguments);

        // Generate a "helper" which tells us how to create a dialog
        this.helper = new CIQ.Studies.DialogHelper(params);
        let dialog = $(this);

        dialog.find('.title').text(this.helper.title);

        let self = this;

        function makeMenu(name, currentValue, fields) {
            let menu = CIQ.UI.makeFromTemplate(self.menuTemplate);
            let cqMenu = menu.find('cq-menu-dropdown'); // scrollable in menu.
            cqMenu[0].context = self.context;
            for (let field in fields) {
                let item = $('<cq-item></cq-item>');
                item.text(fields[field]);
                item.attr('stxtap', 'StudyDialog.setSelectOption()'); // must call StudyDialog because the item is "lifted" and so doesn't know it's parent
                cqMenu.append(item);
                item[0].cqMenuWrapper = cqMenu.parents('cq-menu')[0];
                item.attr('name', name);
                item.attr('value', field);
            }
            let inputValue = menu.find('cq-selected');
            inputValue.text(self.helper.stx.translateIf(currentValue));
            return menu;
        }

        // Create form elements for all of the inputs
        let attributes;
        let inputs = dialog.find('cq-study-inputs');
        inputs.empty();
        for (var i in this.helper.inputs) {
            let input = this.helper.inputs[i];
            let newInput = CIQ.UI.makeFromTemplate(this.inputTemplate, inputs);
            this.menuTemplate = newInput.find('template[cq-menu]');
            newInput.find('.ciq-heading').text(input.heading);
            newInput[0].fieldName = input.name;
            let formField = null;

            var iAttr;
            attributes = this.helper.attributes[input.name];
            if (input.type === 'number') {
                formField = $('<input>');
                formField.attr('type', 'number');
                formField.val(input.value);
                this.setChangeEvent(formField, 'inputs', input.name);
                for (iAttr in attributes) formField.attr(iAttr, attributes[iAttr]);
            } else if (input.type === 'text') {
                formField = $('<input>');
                formField.attr('type', 'text');
                formField.val(input.value);
                this.setChangeEvent(formField, 'inputs', input.name);
                for (iAttr in attributes) formField.attr(iAttr, attributes[iAttr]);
            } else if (input.type === 'select') {
                formField = makeMenu(input.name, input.value, input.options);
                if (attributes && attributes.readonly) formField.attr('readonly', attributes.readonly);
            } else if (input.type === 'checkbox') {
                formField = $('<input>');
                formField.attr('type', 'checkbox');
                if (input.value) formField.prop('checked', true);
                this.setChangeEvent(formField, 'inputs', input.name);
                for (iAttr in attributes) formField.attr(iAttr, attributes[iAttr]);
            }
            if (attributes && attributes.hidden) newInput.hide();
            if (formField) newInput.find('.stx-data').append(formField);
        }
        let swatch;
        let outputs = dialog.find('cq-study-outputs');
        outputs.empty();
        for (i in this.helper.outputs) {
            let output = this.helper.outputs[i];
            let newOutput = CIQ.UI.makeFromTemplate(this.outputTemplate, outputs);
            newOutput[0].initialize({
                studyDialog: this,
                output: output.name,
                params,
            });
            newOutput.find('.ciq-heading').text(output.heading);
            newOutput.find('.ciq-heading')[0].fieldName = output.name;

            swatch = newOutput.find('cq-swatch');
            let color = output.color;
            if (typeof color === 'object') {
                color = color.color;
            }
            swatch[0].setColor(color, false); // don't percolate
        }

        let parameters = dialog.find('cq-study-parameters');
        parameters.empty();
        for (i in this.helper.parameters) {
            let parameter = this.helper.parameters[i];
            let newParam = CIQ.UI.makeFromTemplate(this.parameterTemplate, parameters);
            newParam.find('.ciq-heading').text(parameter.heading);
            swatch = newParam.find('cq-swatch');
            let paramInput = $('<input>');
            var pAttr;
            attributes = {};
            if (parameter.defaultValue.constructor === Boolean) {
                paramInput.attr('type', 'checkbox');
                if (parameter.value) paramInput.prop('checked', true);
                this.setChangeEvent(paramInput, 'parameters', `${parameter.name}Enabled`);
                swatch.remove();

                attributes = this.helper.attributes[`${parameter.name}Enabled`];
                for (pAttr in attributes) paramInput.attr(pAttr, attributes[pAttr]);
            } else if (parameter.defaultValue.constructor === Number) {
                paramInput.attr('type', 'number');
                paramInput.val(parameter.value);
                this.setChangeEvent(paramInput, 'parameters', `${parameter.name}Value`);
                newParam[0].initialize({
                    studyDialog: this,
                    parameter: `${parameter.name}Color`,
                    params,
                });
                swatch[0].setColor(parameter.color, false); // don't percolate

                attributes = this.helper.attributes[`${parameter.name}Value`];
                for (pAttr in attributes) paramInput.attr(pAttr, attributes[pAttr]);
            } else continue;

            if (attributes && attributes.hidden) newParam.hide();
            newParam.find('.stx-data').append(paramInput);
        }
    }
}

document.registerElement('cq-study-dialog', StudyDialog);
export default StudyDialog;
