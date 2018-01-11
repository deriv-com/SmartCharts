import ContextTag from './ui/ContextTag';
import html from './ChartControls.html';
import './ChartControls.scss';

class ChartControls extends ContextTag {
    createdCallback() {
        super.createdCallback();
        this.id = 'chartControls';
        this.innerHTML = html;
    }
};


document.registerElement('cq-chart-controls', ChartControls);
export default ChartControls;
