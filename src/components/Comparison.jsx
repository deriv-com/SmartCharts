import $ from 'jquery';
import CIQ from 'chartiq';
import React, { Component } from 'react';
import contextAware from '../contextAware';

class Comparison extends Component {
    constructor() {
        super();
    }

    onContextReady(context) {
        this._context = context;
    }

    render() {
        return (
            <cq-menu class="ciq-menu ciq-views collapse">
                <span className="ciq-icon ciq-ic-comparison" />
            </cq-menu>
        );
    }
}

export default contextAware(Comparison);
