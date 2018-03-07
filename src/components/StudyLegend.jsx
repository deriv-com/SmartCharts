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
        const {isOpened, setOpen, Menu, StudyCategoricalDisplay} = this.props;

        return (
            <Menu
                className="ciq-menu ciq-studies collapse"
            >
                <Menu.Title>
                    <IndicatorIcon
                        className={`tooltip ${isOpened ? 'active' : ''}`}
                        tooltip-title="Studies" />
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
        isOpened: studies.menu.open,
        setOpen: studies.setOpen,
        studies: studies.studies,
        clearStudies: studies.clearStudies,
        cleanUp: studies.cleanUp,
        Menu: studies.menu.connect(Menu),
        StudyCategoricalDisplay: studies.categoricalDisplay.connect(CategoricalDisplay),
    })
)(StudyLegend);
