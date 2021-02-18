import React from 'react'
import { shallow } from 'enzyme'
import SearchInput from '../../../src/components/SearchInput'

describe('SearchInput', function() {
    it('render correctly', () => {
        const wrapper = shallow(<SearchInput />)

        expect(wrapper.find('.sc-search-input').length).toBe(1)
    })
});