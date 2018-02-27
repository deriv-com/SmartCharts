import { observable, action, reaction, computed, autorunAsync, when } from 'mobx';
import MenuStore from './MenuStore';
import ListStore from './ListStore';
export default class DrawToolsStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        this.menu = new MenuStore(mainStore);
        this.list = new ListStore({
            getIsOpen: () => this.menu.open,
            getContext: () => this.context,
            onItemSelected: item => this.selectTool(item.id),
            getItems: () => [
                {id: 'annotation', text: 'Annotation'},
                {id: 'average', text: 'Average Line'},
                {id: 'callout', text: 'Callout'},
                {id: 'channel', text: 'Channel'},
                {id: 'continuous', text: 'Continuous'},
                {id: 'crossline', text: 'Crossline'},
                {id: 'freeform', text: 'Doodle'},
                {id: 'ellipse', text: 'Ellipse'},
                {id: 'fibonacci', text: 'Fibonacci'},
                {id: 'fibarc', text: 'Fib Arc'},
                {id: 'fibfan', text: 'Fib Fan'},
                {id: 'fibtimezone', text: 'Fib Time Zone'},
                {id: 'gannfan', text: 'Gann Fan'},
                {id: 'gartley', text: 'Gartley'},
                {id: 'horizontal', text: 'Horizontal'},
                {id: 'line', text: 'Line'},
                {id: 'pitchfork', text: 'Pitchfork'},
                {id: 'quadrant', text: 'Quadrant Lines'},
                {id: 'ray', text: 'Ray'},
                {id: 'rectangle', text: 'Rectangle'},
                {id: 'regression', text: 'Regression Line'},
                {id: 'segment', text: 'Segment'},
                {id: 'arrow', text: 'Shape - Arrow'},
                {id: 'check', text: 'Shape - Check'},
                {id: 'xcross', text: 'Shape - Cross'},
                {id: 'focusarrow', text: 'Shape - Focus'},
                {id: 'heart', text: 'Shape - Heart'},
                {id: 'star', text: 'Shape - Star'},
                {id: 'speedarc', text: 'Speed Resistance Arc'},
                {id: 'speedline', text: 'Speed Resistance Line'},
                {id: 'timecycle', text: 'Time Cycle'},
                {id: 'tirone', text: 'Tirone Levels'},
                {id: 'vertical', text: 'Vertical'},
            ],
        });

        when(() => this.context, this.onContextReady);
        reaction(() => this.menu.open, this.clearDrawTool);
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
        this.stx.addEventListener('drawing',this.clearDrawTool);
        document.addEventListener('keydown',this.closeOnEscape, false);
    };

    clearDrawTool = () => {
        if(this.menu.open && this.context) {
            this.stx.changeVectorType('');
        }
    };

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
