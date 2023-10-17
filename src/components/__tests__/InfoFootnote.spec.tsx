import React from 'react';
import { expect } from 'chai';
import { render, screen } from '@testing-library/react';
import InfoFootnote from '../InfoFootnote';

describe('InfoFootnote', () => {
    it('should render text correctly and have a correct className', () => {
        const className = 'test-class';
        const text = 'This is a test';
        render(<InfoFootnote className={className} text={text} />);
        const footnote = screen.getByText(text);
        expect(footnote).to.have.tagName('div');
        expect(footnote).to.have.class(/test-class/);
    });
});
