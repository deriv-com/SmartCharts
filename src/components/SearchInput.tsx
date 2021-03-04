// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons.jsx' was resolved to '/Users/balak... Remove this comment to see the full error message
import { CloseCircleIcon, SearchIcon } from './Icons.jsx';
import '../../sass/components/_search.scss';

const SearchInput = ({
    placeholder,
    value,
    searchInput,
    searchInputClassName,
    onChange,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className={classNames('sc-search-input', { active: value.trim() !== '' })}>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
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
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <SearchIcon />
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <CloseCircleIcon className='icon-reset' onClick={() => onChange('')} />
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);

export default SearchInput;
