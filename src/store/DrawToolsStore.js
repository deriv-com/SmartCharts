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
            onChanged: this.onChanged,
        });

        this.list = new ListStore({
            getIsOpen: () => this.menu.open,
            getContext: () => this.context,
            onItemSelected: item => this.selectTool(item.id),
            getItems: () => [
                {id: 'annotation', text: t.translate('Annotation') },
                {id: 'average', text: t.translate('Average Line') },
                {id: 'callout', text: t.translate('Callout') },
                {id: 'channel', text: t.translate('Channel') },
                {id: 'continuous', text: t.translate('Continuous') },
                {id: 'crossline', text: t.translate('Crossline') },
                {id: 'freeform', text: t.translate('Doodle') },
                {id: 'ellipse', text: t.translate('Ellipse') },
                {id: 'fibonacci', text: 'Fibonacci'},
                {id: 'fibarc', text: t.translate('Fib Arc') },
                {id: 'fibfan', text: t.translate('Fib Fan') },
                {id: 'fibtimezone', text: t.translate('Fib Time Zone') },
                {id: 'gannfan', text: t.translate('Gann Fan') },
                {id: 'gartley', text: t.translate('Gartley') },
                {id: 'horizontal', text: t.translate('Horizontal') },
                {id: 'line', text: t.translate('Line') },
                {id: 'pitchfork', text: t.translate('Pitchfork') },
                {id: 'quadrant', text: t.translate('Quadrant Lines') },
                {id: 'ray', text: t.translate('Ray') },
                {id: 'rectangle', text: t.translate('Rectangle') },
                {id: 'regression', text: t.translate('Regression Line') },
                {id: 'segment', text: t.translate('Segment') },
                {id: 'arrow', text: t.translate('Shape - Arrow') },
                {id: 'check', text: t.translate('Shape - Check') },
                {id: 'xcross', text: t.translate('Shape - Cross') },
                {id: 'focusarrow', text: t.translate('Shape - Focus') },
                {id: 'heart', text: t.translate('Shape - Heart') },
                {id: 'star', text: t.translate('Shape - Star') },
                {id: 'speedarc', text: t.translate('Speed Resistance Arc') },
                {id: 'speedline', text: t.translate('Speed Resistance Line') },
                {id: 'timecycle', text: t.translate('Time Cycle') },
                {id: 'tirone', text: t.translate('Tirone Levels') },
                {id: 'vertical', text: t.translate('Vertical') },
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

                const typeMap = {
                    color: 'colorpicker',
                    fillColor: 'colorpicker',
                    pattern: 'pattern',
                    axisLabel: 'switch',
                    font: 'font',
                    lineWidth: 'none',
                };
                this.settingsDialog.items = Object.keys(parameters)
                    .map(key => ({
                        id: key,
                        title: formatCamelCase(key),
                        value: drawing[key],
                        defaultValue: parameters[key],
                        type: typeMap[key],
                    }));
                this.activeDrawing = drawing;
                this.activeDrawing.highlighted = false;
                this.settingsDialog.title = formatCamelCase(drawing.name);
                this.settingsDialog.setOpen(true);

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

    @action.bound onDeleted() {
        this.stx.removeDrawing(this.activeDrawing);
        this.activeDrawing = null;
    }
}
