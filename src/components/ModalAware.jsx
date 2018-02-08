import $ from 'jquery';
import React, { Component } from 'react';
import contextAware from '../contextAware';
import UIManager from './ui/UIManager';

/**
 * A component that is modally aware of the chart
 *
 * Inherits {@link CIQ.UI.ContextTag}
 * @namespace CIQ.UI.ModalTag
 * @memberof CIQ.UI
 */
class ModalAware extends Component {
    onContextReady(context) {
        this._uiManager = UIManager.instance;
        this._context = context;
    }

    /**
     *
     * @kind function
     * @memberof CIQ.UI.ModalTag
     */
    modalBegin = () => {
        if (!this._context) return;
        this._context.stx.modalBegin();
    }

    /**
     *
     * @kind function
     * @memberof CIQ.UI.ModalTag
     */
    modalEnd = () => {
        if (!this._context) return;
        if (this._uiManager.activeMenuStack.length) return; // If an active menu then don't turn off the modal. Let _uiManager handle it.
        this._context.stx.modalEnd();
    }

    render() {
        return (
            <div className="modal-aware"
                onMouseOver={this.modalBegin}
                onMouseOut={this.modalEnd}
            >
                {this.props.children}
            </div>
        );
    }
}

export default contextAware(ModalAware);
