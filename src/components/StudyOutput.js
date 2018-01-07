import { BaseComponent } from './componentUI';

/**
 * Study output web component `<cq-study-output>`.
 *
 * Set the color of study outputs in the {@link CIQ.WebComponents.cq-study-dialog}.
 *
 * See example in {@link CIQ.WebComponents.cq-study-dialog}.
 * @name CIQ.WebComponents.cq-study-output
 */
class StudyOutput extends BaseComponent {
    initialize(params) {
        this.params = params;
    }

    setColor(color) {
        if (!this.params) return;
        let updates = {
            outputs: {},
        };
        updates.outputs[this.params.output] = {};
        updates.outputs[this.params.output].color = color;
        this.params.studyDialog.updateStudy(updates);
    }
}

document.registerElement('cq-study-output', StudyOutput);
export default StudyOutput;
