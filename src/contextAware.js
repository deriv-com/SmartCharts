import React from 'react';
import PropTypes from 'prop-types';

export default function contextAware(WrappedComponent) {
    return class Aware extends React.Component {
        static contextTypes = { promise: PropTypes.object };
        componentDidMount() {
            this.context.promise.then((context) => {
                this._wrapped.onContextReady(context);
            });
        }
        render() {
            const props = Object.assign(
                {},
                this.props,
                { ref: (wrapped) => { this._wrapped = wrapped; } },
            );
            return React.createElement(WrappedComponent, props);
        }
    };
}
