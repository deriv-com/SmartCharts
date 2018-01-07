import { CIQ } from '../../js/chartiq';
import DialogContentTag from './ui/DialogContentTag';

/**
 * Study Context Dialog web component `<cq-study-context>`.
 *
 *
 * @namespace WebComponents.cq-study-context
 * @since  4.1.0 cq-study-context is now required (cq-dialog[cq-study-context] no longer works)
 */
class StudyContext extends DialogContentTag {}

document.registerElement('cq-study-context', StudyContext);
export default StudyContext;
