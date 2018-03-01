import { observable, action, reaction, computed, autorunAsync, when } from 'mobx';
import MenuStore from './MenuStore';
import ListStore from './ListStore';
import DialogStore from './DialogStore';
import SettingsDialogStore from './SettingsDialogStore';

// camelcase to spaces separated capitalized string.
const formatCamelCase = s => {
    const capitalized = s.charAt(0).toUpperCase() + s.slice(1);
    return capitalized.replace(/([a-z](?=[A-Z]))/g, '$1 ');
};

export default class DrawToolsStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        this.menu = new MenuStore(mainStore);
        this.settingsDialog = new SettingsDialogStore({
            getContext: () => this.mainStore.chart.context,
            onDeleted: () => console.warn('onDeleted'),
            onStared: (value) => console.warn('onStared', value),
            onChanged: items => console.warn('onChanged', items),
        });

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

    onRightClick = () => {
        for (const drawing of this.stx.drawingObjects) {
            if (drawing.highlighted && !drawing.permanent) {
                var dontDeleteMe = drawing.abort();
                const parameters = CIQ.Drawing.getDrawingParameters(this.stx, drawing.name);

                this.settingsDialog.items = Object.keys(parameters)
                    .filter(key => key !== 'font')
                    .map(key => ({
                        id: key,
                        title: formatCamelCase(key),
                        value: parameters[key],
                    }));
                this.settingsDialog.title = formatCamelCase(drawing.name);
                this.settingsDialog.setOpen(true);
                this.settingsDialog.description = `
                The Double Exponential Moving Average (CKS) by Patrick Mulloy
                attempts to remove the inherent lag associated to Moving Averages by placing more weight on recent
                values.`;
                console.warn(parameters, drawing, dontDeleteMe);
                return true;
            }
        }
        return false;
    };

    onContextReady = () => {
        document.addEventListener('keydown', this.closeOnEscape, false);
        this.stx.addEventListener('drawing', this.clearDrawTool);
        this.stx.prepend("rightClickHighlighted", this.onRightClick);
    };

    clearDrawTool = () => {
        if(this.menu.open && this.context) {
            this.stx.changeVectorType('');
        }
    };

    @action.bound clearAll() {
        this.stx.clearDrawings();
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
