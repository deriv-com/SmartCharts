import PropTypes            from 'prop-types';
import React, { Component } from 'react';
import {
    CloseCircleIcon,
    SearchIcon   }          from './Icons.jsx';
import { connect }          from '../store/Connect';

class SearchInput extends Component {
    clearFilterText = () => {
        this.props.onChange('');
    };

    onChange = (e) => {
        this.props.onChange(e.target.value);
    };

    render() {
        const { placeholder, value, searchInput } = this.props;

        return (
            <div className={`cq-lookup-input ${value.trim() !== '' ? 'active' : ''}`}>
                <input
                    value={value}
                    ref={searchInput}
                    onChange={this.onChange}
                    type="text"
                    spellCheck="off"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    placeholder={placeholder}
                />
                <SearchIcon />
                <CloseCircleIcon className="icon-reset" onClick={this.clearFilterText} />
            </div>
        );
    }
}

SearchInput.propTypes = {
    placeholder : PropTypes.string,
    value       : PropTypes.string,
    searchInput : PropTypes.object,
};

SearchInput.defaultProps = {
    placeholder : '',
    value       : '',
    searchInput : null,
};

export default connect(({ chart: c }) => ({
    isMobile: c.isMobile,
}))(SearchInput);
