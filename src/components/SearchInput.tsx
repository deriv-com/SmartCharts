import React from 'react';
import classNames from 'classnames';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons' was resolved to '/Users/balak... Remove this comment to see the full error message
import { CloseCircleIcon, SearchIcon } from './Icons';
import '../../sass/components/_search.scss';

const SearchInput = ({ placeholder, value, searchInput, searchInputClassName, onChange }: any) => (
    <div className={classNames('sc-search-input', { active: value.trim() !== '' })}>
        <input
            className={searchInputClassName}
            value={value}
            ref={searchInput}
            onChange={(e: any) => onChange(e.target.value)}
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
