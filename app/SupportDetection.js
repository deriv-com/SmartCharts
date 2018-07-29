import React from 'react';
import Modernizr from 'modernizr';

class SupportDetection extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentWillMount() {
        console.log('cssborderimage', Modernizr.borderimage);
        console.log('csstransforms3d', Modernizr.csstransforms3d);
        console.log('preserve3d', Modernizr.preserve3d);

        console.log('es6array', Modernizr.es6array);
        console.log('es6object', Modernizr.es6object);

        console.log('csstransforms', Modernizr.csstransforms);
        console.log('cssflexbox', Modernizr.flexbox);


        console.log('history', Modernizr.history);
        console.log('localstorage', Modernizr.localstorage);

        if (
            /**
            * style
            */
            !Modernizr.csstransforms
            || !Modernizr.flexbox
            /**
            * React Mobx
            */
            || !Modernizr.csstransforms
            || !Modernizr.es6array
            /**
            * Tech
            */
            || !Modernizr.localstorage
            || !Modernizr.history
        ) {
            this.setState({ hasError: true });
        }
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
        console.error(error, info);
    }

    render() {
        if (this.state.hasError) {
            return <h1> Not Supported. </h1>;
        }
        return this.props.children;
    }
}


export default SupportDetection;
