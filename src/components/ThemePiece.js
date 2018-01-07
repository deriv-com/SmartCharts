import { CIQ } from '../../js/chartiq';
import { BaseComponent } from './componentUI';

/**
 * Theme Piece web component `<cq-theme-piece>`.
 *
 * Manages themes in for chart layout.
 * @namespace WebComponents.cq-theme-piece
 * @example
     <cq-section>
         <cq-placeholder>Background
             <cq-theme-piece cq-piece="bg"><cq-swatch></cq-swatch></cq-theme-piece>
         </cq-placeholder>
         <cq-placeholder>Grid Lines
             <cq-theme-piece cq-piece="gl"><cq-swatch></cq-swatch></cq-theme-piece>
         </cq-placeholder>
         <cq-placeholder>Date Dividers
             <cq-theme-piece cq-piece="dd"><cq-swatch></cq-swatch></cq-theme-piece>
         </cq-placeholder>
         <cq-placeholder>Axis Text
             <cq-theme-piece cq-piece="at"><cq-swatch></cq-swatch></cq-theme-piece>
         </cq-placeholder>
     </cq-section>
 */
class ThemePiece extends BaseComponent {
    /**
     * @alias setColor
     * @memberof WebComponents.cq-theme-piece
     */
    setColor(color) {
        if (color === 'Hollow' || color === 'No Border') {
            color = 'transparent';
            this.node.find('cq-swatch')[0].setColor('transparent', false);
        }
        CIQ.UI.containerExecute(this, 'setValue', this.piece.obj, this.piece.field, color);
    }

    /**
     * @alias setBoolean
     * @memberof WebComponents.cq-theme-piece
     */
    setBoolean(result) {
        CIQ.UI.containerExecute(this, 'setValue', this.piece.obj, this.piece.field, result);
    }
}


document.registerElement('cq-theme-piece', ThemePiece);
export default ThemePiece;
