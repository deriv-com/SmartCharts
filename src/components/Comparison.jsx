import React from 'react';
import Menu_ from './Menu.jsx';
import { connect } from '../store/Connect';
import SymbolsCategoricalDisplay from './SymbolsCategoricalDisplay.jsx';

const Menu = Menu_.connectBy(stroes => stroes.comparison.menu);

const Comparison = ({
    activeSymbols,
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
                <SymbolsCategoricalDisplay
                    isShown={isMenuOpened}
                    activeSymbols={activeSymbols}
                    onSelectItem={onSelectItem}
                />
            </Menu.Body>
        </Menu>
    );
};

export default connect(
    ({ comparison: c }) => ({
        activeSymbols: c.activeSymbols,
        isMenuOpened: c.menu.open,
        onSelectItem: c.onSelectItem
    })
)(Comparison);
