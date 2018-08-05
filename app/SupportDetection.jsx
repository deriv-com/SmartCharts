import React from 'react';

import './styles/support-detection.scss';

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
    'Windows 10': {
        edge: 15150630,
        ie: 1100,
        firefox: 3200,
        chrome: 3702062,
        opera: 230522,
        yandexbrowser: 14122125,
    },
    'Windows 8': {
        ie: 1000,
        firefox: 2700,
        chrome: 3601985,
        opera: 2601656,
        yandexbrowser: 14122125,
    },
    'Windows 7': {
        ie: 1100,
        firefox: 2700,
        chrome: 3601985,
        opera: 2601656,
        yandexbrowser: 14122125,
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
        const NotGuaranteed = (
            <div className="cq-not-guaranteed">
                <h1>We are  NOT guaranteed</h1>
                <p>Binary.com does not guaranteed your browser. Please update your browser.</p>
                <a href="https://www.binary.com/">Update Browser</a>
            </div>
        );

        if (this.state.hasError) {
            return (
                <div className="cq-not-supported">
                    <div className="cq-logo" />
                    <div className="cq-icon-not-supported" />
                    <h1>YOUR BROWSER IS NOT SUPPORTED</h1>
                    <p>Binary.com does not support your browser. Please update your browser.</p>
                    <a href="https://www.binary.com/">Update Browser</a>
                </div>
            );
        }
        return (
            <div>
                {this.state.unknown ? NotGuaranteed : null }

                {this.props.children}
            </div>
        );
    }
}


export default SupportDetection;
