import React, { Component } from 'react';
import { CloseIcon, SearchIcon } from './Icons.jsx';
import { connect } from '../store/Connect';

class SearchInput extends Component {
    constructor(props) {
        super(props);
        this.searchInput = React.createRef();
    }

    componentDidMount() {
        if (!this.props.isMobile) {
            setTimeout(() => this.searchInput.current.focus(), 0);
        }
    }

    clearFilterText = () => {
        this.props.onChange('');
    };

    onChange = (e) => {
        this.props.onChange(e.target.value);
    };

    render() {
        const { placeholder, value } = this.props;

        return (
            <div className={`cq-lookup-input ${value.trim() !== '' ? 'active' : ''}`}>
                <input
                    value={value}
                    ref={this.searchInput}
                    onChange={this.onChange}
                    type="text"
                    spellCheck="off"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    placeholder={placeholder}
                />
                <SearchIcon />
                <CloseIcon className="icon-reset" onClick={this.clearFilterText} />
            </div>
        );
    }
}

export default connect(({ chart: c }) => ({
    isMobile: c.isMobile,
}))(SearchInput);
