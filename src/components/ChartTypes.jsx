// TODO: add spline & line-dot.
import React, { Component } from 'react';
import contextAware from '../contextAware';
import './ChartTypes.scss';

const types = [
    {id: 'mountain', name: 'Line'},
    {id: 'line', name: 'Dot'},
    {id: 'candle', name: 'Candle'},
    {id: 'colored_bar', name: 'OHLC'},
    {id: 'hollow_candle', name: 'Hollow Candle'},
];
types.forEach(type => {
    type.icon = `ciq-icon ciq-${type.id.replace('_', '-')}`;
});

class ChartTypes extends Component {
    state = { type: types[0] };
    onContextReady(context) {
        const type = types.find(t => t.id === context.stx.layout.chartType);
        this.setState({type});

        this._context = context;
    }
    setType(type) {
        this._context.stx.setChartType(type.id);
        this.setState({type});
    }

    render() {
        return (
            <cq-menu class="ciq-menu ciq-display collapse ciq-chart-types">
                <div className='ciq-title'>
                    <span className={this.state.type.icon}></span>
                    <span>{this.state.type.name}</span>
                </div>
                <cq-menu-dropdown>
                    {types.map((type, idx) => (
                        <div
                            onClick={() => this.setType(type)}
                            className="ciq-row"
                            key={idx}
                        >
                            <span className={type.icon}></span>
                            <span>{type.name}</span>
                        </div>
                    ))}
                </cq-menu-dropdown>
            </cq-menu>
        );
    }
}

export default  contextAware(ChartTypes);

