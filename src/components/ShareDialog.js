import { CIQ } from '../../js/chartiq';
import DialogContentTag from './ui/DialogContentTag';

/**
 * Share Dialog web component `<cq-share-dialog>`.
 *
 * @namespace WebComponents.cq-share-dialog
 * @example
 <cq-dialog>
     <cq-share-dialog>
         <div>
             <h4 class="title">Share Your Chart</h4>
             <cq-separator></cq-separator>
             <p>Press this button to generate a shareable image:</p>
                 <div class="ciq-btn" stxtap="share()">
                         Create Image
                 </div>

             <div class="share-link-div"></div>

             <cq-separator></cq-separator>
             <div class="ciq-dialog-cntrls">
                 <div stxtap="close()" class="ciq-btn">Done</div>
             </div>

         </div>
     </cq-share-dialog>
 </cq-dialog>
 */
class ShareDialog extends DialogContentTag {
    setState(state) {
        this.node.find('cq-share-create').css({
            display: 'none',
        });
        this.node.find('cq-share-generating').css({
            display: 'none',
        });
        this.node.find('cq-share-uploading').css({
            display: 'none',
        });
        this.node.find(`cq-share-${state}`).css({
            display: 'inline-block',
        });
    }
    
    close() {
        // Clear out the link and then close
        $('cq-share-dialog .share-link-div').html('');
        super.close();
    }
    
    /**
     * Shares a chart with default parameters
     * @alias share
     * @memberof WebComponents.cq-share-dialog
     */
    share() {
        let stx = this.context.stx;
        let self = this;
        this.setState('generating');
        $('cq-share-dialog .share-link-div').html('');
        // "hide" is a selector list, of DOM elements to be hidden while an image of the chart is created.  "cq-comparison-add-label" and "#chartSize" are hidden by default.
        CIQ.UI.bypassBindings = true;
        CIQ.Share.createImage(stx, {
            hide: ['.stx_chart_controls'],
        }, (data) => {
            CIQ.UI.bypassBindings = false;
            let id = CIQ.uniqueID();
            let host = 'https://share.chartiq.com';
            let startOffset = stx.getStartDateOffset();
            let metaData = {
                layout: stx.exportLayout(),
                drawings: stx.exportDrawings(),
                xOffset: startOffset,
                startDate: stx.chart.dataSegment[startOffset].Date,
                endDate: stx.chart.dataSegment[stx.chart.dataSegment.length - 1].Date,
                id,
                symbol: stx.chart.symbol,
            };
            let url = `${host}/upload/${id}`;
            let payload = {
                id,
                image: data,
                config: metaData,
            };

            self.setState('uploading');
            CIQ.Share.uploadImage(data, url, payload, (err, response) => {
                self.setState('create');
                if (err !== null) {
                    CIQ.alert(`error: ${err}`);
                } else {
                    $('cq-share-dialog .share-link-div').html(host + response);
                }
            });
        });
    }
}

document.registerElement('cq-share-dialog', ShareDialog);
export default ShareDialog;
