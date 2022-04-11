import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { CloseCircleIcon, SearchIcon } from './Icons';
import '../../sass/components/_search.scss';

export type TSearchInputProps = {
    placeholder: string;
    value: string;
    searchInput: React.RefObject<HTMLInputElement>;
    searchInputClassName?: string;
    onChange: (value: string) => void;
};

const SearchInput = ({ placeholder, value, searchInput, searchInputClassName, onChange }: TSearchInputProps) => (
    <div className={classNames('sc-search-input', { active: value.trim() !== '' })}>
        <input
            className={searchInputClassName}
            value={value}
            ref={searchInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            type='text'
            spellCheck='false'
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            placeholder={placeholder}
        />
        <SearchIcon />
        <CloseCircleIcon className='icon-reset' onClick={() => onChange('')} />
    </div>
);

export default observer(SearchInput);
