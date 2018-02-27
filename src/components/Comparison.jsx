import React from 'react';
import Menu from './Menu.jsx';
import { connect } from '../store/Connect';
import CategoricalDisplay from './CategoricalDisplay.jsx';

const Comparison = ({
    CategoricalDisplay,
    Menu,
}) => {
    return (
        <Menu
            className="cq-comparison-new"
        >
            <Menu.Title>
                <span className="ciq-icon ciq-ic-comparison" />
            </Menu.Title>
            <Menu.Body>
                <CategoricalDisplay />
            </Menu.Body>
        </Menu>
    );
};

export default connect(
    ({ comparison: c }) => ({
        CategoricalDisplay: c.categoricalDisplay.connect(CategoricalDisplay),
        Menu: c.menu.connect(Menu),
    })
)(Comparison);
