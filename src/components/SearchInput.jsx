import React from 'react';
import classNames from 'classnames';
import { CloseCircleIcon, SearchIcon } from './Icons.jsx';
import '../../sass/components/_search.scss';

const SearchInput = ({ placeholder, value, searchInput, searchInputClassName, onChange }) => (
    <div className={classNames('sc-search-input', { active: value.trim() !== '' })}>
        <input
            className={searchInputClassName}
            value={value}
            ref={searchInput}
            onChange={e => onChange(e.target.value)}
            type='text'
            spellCheck='off'
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            placeholder={placeholder}
        />
        <SearchIcon />
        <CloseCircleIcon className='icon-reset' onClick={() => onChange('')} />
    </div>
);

export default SearchInput;
