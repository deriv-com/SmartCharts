import { observable, action, computed, when, reaction } from 'mobx';
import MenuStore from './MenuStore';
import ListStore from './ListStore';

export default class DrawToolsStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        this.menu = new MenuStore(mainStore);
        this.list = new ListStore(mainStore);
        when(() => this.context, this.onContextReady);
        reaction(() => this.menu.open, this.onMenuOpen.bind(this));
        window.dts = this;
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    closeOnEscape = (e) => {
        const ESCAPE = 27;
        if(e.keyCode === ESCAPE) {
            this.stx.changeVectorType('');
        }
    };

    onContextReady = () => {
        this.stx.addEventListener('drawing',() => this.stx.changeVectorType(''));
        document.addEventListener('keydown',this.closeOnEscape.bind(this), false);
    }
    onMenuOpen() {
        if(this.menu.open && this.context) {
            this.stx.changeVectorType('');
        }
    }

    @action.bound clearAll() {
    }

    @action.bound noTool() {
    }

    @action.bound selectTool(id) {
        let stx = this.context.stx;
        stx.clearMeasure(); // TODO remove this line
        stx.changeVectorType(id);
        this.menu.setOpen(false);

        // this.node.find('*[cq-section]').removeClass('ciq-active');

        let drawingParameters = CIQ.Drawing.getDrawingParameters(stx, id);
        if (drawingParameters) {
            // fibtimezone has no values to display in the settings dialog
            if (id === 'fibtimezone') {
                delete drawingParameters.parameters;
            }

            console.warn(drawingParameters);

            // let elements = this.defaultElements(drawingParameters);
            // for (let i = 0; i < elements.length; i++) {
            //     $(this.node).find(elements[i]).addClass('ciq-active');
            // }
        }
    }
}
