import React from 'react'
import { shallow } from 'enzyme'
import SearchInput from '../../../src/components/SearchInput'

describe('SearchInput', function() {
    it('render correctly', () => {
        const wrapper = shallow(<SearchInput placeholder="sample-placeholder" value="sample" searchInputClassName="sample-class" />)
        expect(wrapper.find('.sc-search-input').length).toBe(1);
        expect(wrapper.find('.sc-search-input').hasClass('active')).toBe(true);
        expect(wrapper.find('.sc-search-input > input').hasClass('sample-class')).toBe(true);
        expect(wrapper.find('.sc-search-input > input').at(0).props().placeholder).toEqual('sample-placeholder')

    })
    
    it('should interact correctly', () => {
        const mockFunc = jest.fn();
        const props = {
            onChange: mockFunc
        };
        const wrapper = shallow(<SearchInput {...props} />)
        wrapper.find('input').simulate('change', { target: { value: 'a' } });
        expect(mockFunc.mock.calls.length).toBe(1);

        wrapper.find('input').simulate('change', { target: { value: 'ab' } });
        expect(mockFunc.mock.calls.length).toBe(2);

        wrapper.find('input').simulate('change', { target: { value: 'abc' } });
        expect(mockFunc.mock.calls.length).toBe(3);
    })
});