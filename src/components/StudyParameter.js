import { BaseComponent } from './componentUI';

/**
 * Study parameters web component `<cq-study-parameter>`.
 *
 * See example in {@link CIQ.WebComponents.cq-study-dialog}.
 * @name CIQ.WebComponents.cq-study-parameter
 */
class StudyParameter extends BaseComponent {
    initialize(params) {
        this.params = params;
    }

    setColor(color) {
        if (!this.params) return;
        let updates = {
            parameters: {},
        };
        updates.parameters[this.params.parameter] = color;
        this.params.studyDialog.updateStudy(updates);
    }
}

document.registerElement('cq-study-parameter', StudyParameter);
export default StudyParameter;
