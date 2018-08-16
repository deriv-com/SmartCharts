import React, { Component } from 'react';
import { connect } from '../store/Connect';
import MarkerStore from '../store/MarkerStore';
import '../../sass/components/_markers.scss';

class Marker extends Component {
    constructor(props) {
        super(props);
        this.updateProps = props.updateProps;
    }

    componentWillReceiveProps(nextProps) {
        this.updateProps(nextProps);
    }

    componentWillUnmount() {
        this.props.destructor();
    }

    render() {
        const {
            display,
            left,
            bottom,
            children,
            className,
        } = this.props;

        return (
            <div
                className={`stx-marker ${className || ''}`}
                style={{
                    display,
                    left,
                    bottom,
                }}
            >
                {children}
            </div>
        );
    }
}

export default connect(
    store => ({
        left: store.left,
        bottom: store.bottom,
        children: store.children,
        className: store.className,
        display: store.display,
        updateProps: store.updateProps,
        destructor: store.destructor,
    }),
    MarkerStore,
)(Marker);
