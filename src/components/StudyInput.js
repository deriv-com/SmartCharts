import { CIQ } from '../../js/chartiq';
import BaseComponent from './ui/BaseComponent';
/**
 * Study input web component `<cq-study-input>`.
 *
 * See example in {@link CIQ.WebComponents.cq-study-dialog}.
 * @name CIQ.WebComponents.cq-study-input
 */
class StudyInput extends BaseComponent {}

export default StudyInput;
CIQ.UI.StudyInput = document.registerElement('cq-study-input', StudyInput);

