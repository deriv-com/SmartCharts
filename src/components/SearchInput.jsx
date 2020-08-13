import React from 'react';
import { CloseCircleIcon, SearchIcon } from './Icons.jsx';
import '../../sass/components/_search.scss';

const SearchInput = ({ placeholder, value, searchInput, searchInputClassName, onChange }) => (
    <div className={`sc-search-input ${value.trim() !== '' ? 'active' : ''}`}>
        <input
            className={searchInputClassName}
            value={value}
            ref={searchInput}
            onChange={e => onChange(e.target.value)}
            type="text"
            spellCheck="off"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder={placeholder}
        />
        <SearchIcon />
        <CloseCircleIcon
            className="icon-reset"
            onClick={() => onChange('')}
        />
    </div>
);

export default SearchInput;
