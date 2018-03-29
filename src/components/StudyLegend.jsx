import CIQ from 'chartiq';
import React, { Component } from 'react';
import Menu from './Menu.jsx';
import CategoricalDisplay from './CategoricalDisplay.jsx';
import {connect} from '../store/Connect';
import {IndicatorIcon} from './Icons.jsx';

class StudyLegend extends Component {
    componentWillUnmount() {
        this.props.cleanUp();
    }

    render() {
        const {isOpened, setOpen, clearStudies, activeStudies, Menu, menuOpen, StudyCategoricalDisplay} = this.props;

        return (
            <Menu
                className="ciq-menu ciq-studies collapse"
                isOpened={isOpened}
                setOpen={setOpen}
            >
                <Menu.Title>
                    <IndicatorIcon
                        className={`${menuOpen ? 'active' : ''}`}
                        tooltip-title={t.translate("Studies")} />
                </Menu.Title>
                <Menu.Body>
                    <StudyCategoricalDisplay />
                </Menu.Body>
            </Menu>
        );
    }
}

export default connect(
    ({studies}) => ({
        isOpened: studies.open,
        setOpen: studies.setOpen,
        activeStudies: studies.activeStudies,
        clearStudies: studies.clearStudies,
        cleanUp: studies.cleanUp,
        Menu: studies.menu.connect(Menu),
        menuOpen: studies.menu.open,
        StudyCategoricalDisplay: studies.categoricalDisplay.connect(CategoricalDisplay),
    })
)(StudyLegend);
