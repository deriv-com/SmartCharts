import React from 'react';
import Menu_ from './Menu.jsx';
import { connect } from '../store/Connect';
import CategoricalDisplay_ from './CategoricalDisplay.jsx';

const Menu = Menu_.connectBy(stores => stores.comparison.menu);
const CategoricalDisplay = CategoricalDisplay_.connectBy(stores => stores.comparison.symbolsDisplay);

const Comparison = ({
    isMenuOpened,
    onSelectItem,
}) => {
    return (
        <Menu
            className="cq-comparison-new"
        >
            <Menu.Title>
                <span className="ciq-icon ciq-ic-comparison" />
            </Menu.Title>
            <Menu.Body>
                <CategoricalDisplay
                    isShown={isMenuOpened}
                    onSelectItem={onSelectItem}
                />
            </Menu.Body>
        </Menu>
    );
};

export default connect(
    ({ comparison: c }) => ({
        isMenuOpened: c.menu.open,
        onSelectItem: c.onSelectItem
    })
)(Comparison);
