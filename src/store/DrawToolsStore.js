import { observable, action, reaction, computed, autorunAsync, when } from 'mobx';
import MenuStore from './MenuStore';
import ListStore from './ListStore';
import SettingsDialogStore from './SettingsDialogStore';

// camelCase to spaces separated capitalized string.
const formatCamelCase = s => {
    const capitalized = s.charAt(0).toUpperCase() + s.slice(1);
    return capitalized.replace(/([a-z](?=[A-Z]))/g, '$1 ');
};

export default class DrawToolsStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        this.menu = new MenuStore({getContext: () => this.mainStore.chart.context});
        this.settingsDialog = new SettingsDialogStore({
            getContext: () => this.mainStore.chart.context,
            onDeleted: this.onDeleted,
            onStared: this.onStared,
            onChanged: this.onChanged,
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
        reaction(() => this.menu.open, this.noTool);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }
    activeDrawing = null;

    onContextReady = () => {
        document.addEventListener('keydown', this.closeOnEscape, false);
        this.stx.addEventListener('drawing', this.noTool);
        this.stx.prepend("rightClickHighlighted", this.onRightClick);
    };

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
                this.activeDrawing = drawing;
                this.activeDrawing.highlighted = false;
                this.settingsDialog.title = formatCamelCase(drawing.name);
                this.settingsDialog.setOpen(true);
                console.warn(parameters, drawing, dontDeleteMe);
                return true;
            }
        }
        return false;
    };

    noTool = () => {
        const count = this.stx.drawingObjects.length;
        if((this.menu.open && this.context) || this._pervDrawingObjectCount !== count) {
            this.stx.changeVectorType('');
        }
        this._pervDrawingObjectCount = count;
    };

    @action.bound clearAll() {
        this.stx.clearDrawings();
    }

    @action.bound selectTool(id) {
        let stx = this.context.stx;
        stx.clearMeasure(); // TODO remove this line
        stx.changeVectorType(id);
        this.menu.setOpen(false);
        // let drawingParameters = CIQ.Drawing.getDrawingParameters(stx, id);
    }

    @action.bound onChanged(items) {
        for(const item of items) {
            this.activeDrawing[item.id] = item.value;
        }
        this.activeDrawing.highlighted = false;
        this.activeDrawing.adjust();
    }

    @action.bound onStared(value) {
        console.warn('onStared not implemented yet.');
        // TODO: implement favorites.
    }

    @action.bound onDeleted() {
        this.stx.removeDrawing(this.activeDrawing);
        this.activeDrawing = null;
    }
}
