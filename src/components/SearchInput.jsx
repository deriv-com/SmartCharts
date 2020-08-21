import React, { Component } from 'react';
import classNames   from 'classnames';
import { CloseCircleIcon, SearchIcon } from './Icons.jsx';
import { connect } from '../store/Connect';

class SearchInput extends Component {
    clearFilterText = () => this.props.onChange('');

    onChange = e => this.props.onChange(e.target.value);

    render() {
        const { placeholder, value, searchInput, searchInputClassName } = this.props;

        return (
            <div className={classNames('sc-lookup-input', { active: (value.trim() !== '') })}>
                <input
                    className={searchInputClassName}
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

export default connect(({ chart: c }) => ({
    isMobile: c.isMobile,
}))(SearchInput);
