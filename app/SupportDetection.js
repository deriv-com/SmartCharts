import React from 'react';

const { detect } = require('detect-browser');

const browser = detect();

const SupportedBrowser = {
    'Mac OS': {
        safari: 808,
        firefox: 2600,
        chrome: 2901547,
        opera: 1601190,
        yandexbrowser: 14122120,
    },
    'Windows 8':{
        ie: 1000,
        firefox: 6100,
    },
};


class SupportDetection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            unknown: false,
            hasError: false,
        };
    }

    componentWillMount() {
        if (browser) {
            const version = browser.version.split('.').join('');
            /**
                safari, chrome, firefox, opera, yandexbrowser, ie, edge
            */
            const name = browser.name;
            /**
                Mac OS, IOS, Android OS, Windows 7, Windows 8, Windows 10,
            */
            const os = browser.os;

            console.log(name);
            console.log(version);
            console.log(os);

            if (SupportedBrowser[os] && SupportedBrowser[os][name]) {
                this.setState({
                    hasError: (version < SupportedBrowser[os][name]),
                });
            } else {
                this.setState({ unknown: true });
            }
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
        return (
            <div>
                {this.state.unknown ? '' : ''}

                {this.props.children}
            </div>
        );
    }
}


export default SupportDetection;
