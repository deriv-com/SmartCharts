// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'chartiq' or its corresponding ... Remove this comment to see the full error message
import CIQ from 'chartiq';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './ui/DialogContentTag' or its ... Remove this comment to see the full error message
import DialogContentTag from './ui/DialogContentTag';

/**
 * fibonacci settings dialog web component `<cq-fib-settings-dialog>`.
 *
 * @namespace WebComponents.cq-fib-settings-dialog
 * @example
  <cq-dialog>
      <cq-fib-settings-dialog>
          <h4 class="title">Settings</h4>
          <cq-scroll cq-no-maximize>
              <cq-fibonacci-settings>
                  <template cq-fibonacci-setting>
                      <cq-fibonacci-setting>
                          <div class="ciq-heading"></div>
                          <div class="stx-data"></div>
                      </cq-fibonacci-setting>
                  </template>
              </cq-fibonacci-settings>
          </cq-scroll>
          <div class="ciq-dialog-cntrls">
              <div class="ciq-btn" stxtap="close()">Done</div>
          </div>
      </cq-fib-settings-dialog>
  </cq-dialog>
 * @since 3.0.9
 */

class FibSettingsDialog extends DialogContentTag {
    context: any;
    node: any;
    /**
     * Sets up a handler to process changes to fields
     * @param {HTMLElement} node    The input field
     * @param {string} section The section that is being updated
     * @param {string} name    The name of the field being updated
     * @memberOf WebComponents.cq-fib-settings-dialog
     * @private
     */

    setChangeEvent(node: any, section: any, item: any) {
        let self = this;

        function closure() {
            // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'this'.
            return function(this: any, this: any) {
                let vectorParameters = self.context.stx.currentVectorParameters;
                let vectorType = vectorParameters.vectorType;

                // fibonacci type
                if (vectorParameters.fibonacci && vectorType !== 'fibtimezone') {
                    let defaultFibs = vectorParameters.fibonacci.fibs;
                    if (this.type === 'checkbox') {
                        for (let index in defaultFibs) {
                            let fib = defaultFibs[index];

                            if (fib.level === item) {
                                fib.display = !!this.checked;
                            }
                        }
                    }
                }
            };
        }
        node.change(closure());
    }

    /**
     * Opens the cq-fib-settings-dialog
     * @param  {Object} params Parameters
     * @memberOf WebComponents.cq-fib-settings-dialog
     */

    open(params: any) {
        super.open(arguments);
        let vectorParameters = this.context.stx.currentVectorParameters;
        let vectorType = vectorParameters.vectorType;
        // @ts-expect-error ts-migrate(2581) FIXME: Cannot find name '$'. Do you need to install type ... Remove this comment to see the full error message
        let dialog = $(this);

        // fibonacci type
        let parameters;
        if (vectorParameters.fibonacci && vectorType !== 'fibtimezone') {
            dialog.find('.title').text('Fibonacci Settings');
            let defaultFibs = vectorParameters.fibonacci.fibs || {};
            parameters = dialog.find('cq-fibonacci-settings');
            parameters.emptyExceptTemplate();

            for (let index in defaultFibs) {
                let fib = defaultFibs[index];

                // no negative values for fibonacci arc
                if (vectorType === 'fibarc' && fib.level < 0) continue;

                let newParam = CIQ.UI.makeFromTemplate(this.node.find('template'), parameters);
                let convertPercent = fib.level * 100;
                newParam.find('.ciq-heading').text(`${convertPercent.toFixed(1)}%`);
                let paramInput = newParam.find('input');

                if (fib.display) {
                    paramInput.prop('checked', true);
                }

                this.setChangeEvent(paramInput, 'fib', fib.level);
                newParam.find('.stx-data').append(paramInput);
            }
        }
        // settings dialog default
        else {
            dialog.find('.title').text('Settings');

            // clear the existing web components
            parameters = dialog.find('cq-fibonacci-settings');
            parameters.emptyExceptTemplate();
        }
    }
}

// @ts-expect-error ts-migrate(2551) FIXME: Property 'registerElement' does not exist on type ... Remove this comment to see the full error message
document.registerElement('cq-fib-settings-dialog', FibSettingsDialog);
export default FibSettingsDialog;
