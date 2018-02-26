import React, { Component } from 'react';
import {connect} from '../store/Connect';

export default class List extends React.Component {
    componentDidMount() {
        this.root.addEventListener(CIQ.wheelEvent, (e) => {
            e.stopPropagation();
        });
    }

    render() { 
        const {height, children} = this.props;
        return (
            <div
                className='rows'
                style={{height: `${height}px`}}
                ref={root => this.root = root}
            >
                {children}
            </div>
        );
    }
};
