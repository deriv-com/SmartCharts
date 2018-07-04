import React, { Component } from 'react';
import Menu from './Menu.jsx';
import CategoricalDisplay from './CategoricalDisplay.jsx';
import { connect } from '../store/Connect';
import { IndicatorIcon } from './Icons.jsx';

class StudyLegend extends Component {
    componentWillUnmount() {
        this.props.cleanUp();
    }

    render() {
        const {
            isOpened,
            setOpen,
            Menu,
            menuOpen,
            StudyCategoricalDisplay,
            onCloseMenu,
        } = this.props;

        return (
            <Menu
                className="ciq-menu ciq-studies collapse"
                isOpened={isOpened}
                setOpen={setOpen}
            >
                <Menu.Title>
                    <IndicatorIcon
                        className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                        tooltip-title={t.translate('Indicators')}
                    />
                </Menu.Title>
                <Menu.Body>
                    <StudyCategoricalDisplay
                        dialogTitle={t.translate('Indicators')}
                        closeMenu={() => onCloseMenu()}
                    />
                </Menu.Body>
            </Menu>
        );
    }
}

export default connect(({ studies: st }) => ({
    isOpened: st.open,
    setOpen: st.setOpen,
    cleanUp: st.cleanUp,
    Menu: st.menu.connect(Menu),
    menuOpen: st.menu.open,
    StudyCategoricalDisplay: st.categoricalDisplay.connect(CategoricalDisplay),
    onCloseMenu: st.menu.onTitleClick,
}))(StudyLegend);
