import ContextTag from './ui/ContextTag';
import html from './ChartControls.html';
import './ChartControls.scss';

class ChartControls extends ContextTag {
    createdCallback() {
        super.createdCallback();
        this.id = 'chartControls';
        this.innerHTML = html;
    }

    setContext(context) {
        let UIHeadsUpStatic = new CIQ.UI.HeadsUp($('cq-hu-static'), this.context, {
            autoStart: true,
        });
        $('.ciq-HU')[0].registerCallback(function (value) {
            if (value === 'static') {
                UIHeadsUpStatic.begin();
                this.node.addClass('active');
            } else if (value === 'dynamic') {
                /* do nothing */
            } else {
                UIHeadsUpStatic.end();
                this.node.removeClass('active');
            }
        });
    }
};


document.registerElement('cq-chart-controls', ChartControls);
export default ChartControls;
