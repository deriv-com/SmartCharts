import React, { Component } from 'react';

class TranslationText extends Component {
    constructor(props) {
        super(props);
        const { value } = this.props;
        this.state = {
            translation: t.translate(value),
        };
    }

    componentDidMount() {
        t.onTranslationChanged(this.onTranslationChanged);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.translation !== nextState.translation;
    }

    componentWillUnmount() {
        t.offTranslationChanged(this.onTranslationChanged);
    }

    onTranslationChanged = () => {
        this.setState({ translation: t.translate(this.props.value) });
    };

    render() {
        const { translation } = this.state;
        return (
            <span {...this.props}>{translation}</span>
        );
    }
}

export default TranslationText;
