import { CIQ } from '../../js/chartiq';
import { DialogContentTag } from './componentUI';

/**
 * Aggregation Dialog web component `<cq-aggregation-dialog>`.
 *
 * @namespace WebComponents.cq-aggregation-dialog
 */
class AggregationDialog extends DialogContentTag {
    /**
     * Opens the nearest {@link WebComponents.cq-dialog} to display your dialog.
     * @alias open
     * @memberof WebComponents.cq-aggregation-dialog
     */
    open(params) {
        super.open(arguments);
        let stx = this.context.stx;
        let aggregationType = params.aggregationType;
        let map = {
            kagi: {
                title: 'Set Reversal Percentage',
            },
            renko: {
                title: 'Set Range',
            },
            linebreak: {
                title: 'Set Price Lines',
            },
            rangebars: {
                title: 'Set Range',
            },
            pandf: {
                title: 'Set Point & Figure Parameters',
            },
        };
        if (stx.layout.aggregationType !== aggregationType) {
            stx.setAggregationType(aggregationType);
        }

        let entry = map[aggregationType];
        let node = this.node;
        node.find('.title').text(stx.translateIf(entry.title));

        for (let type in map) {
            node.find(`.ciq${type}`).css(aggregationType === type ? {
                display: '',
            } : {
                display: 'none',
            });
        }
        node.find(`.ciq${aggregationType} input`).each(function () {
            let name = this.name;
            if (name === 'box' || name === 'reversal') name = `pandf.${name}`;
            let tuple = CIQ.deriveFromObjectChain(stx.layout, name);
            if (tuple && !tuple.obj[tuple.member] && stx.chart.defaultChartStyleConfig[this.name]) {
                $(this).val(stx.chart.defaultChartStyleConfig[this.name]);
            }
        });
    }
}


document.registerElement('cq-aggregation-dialog', AggregationDialog);
export default AggregationDialog;
