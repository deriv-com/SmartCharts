import CIQ from 'chartiq';
import React, { Component } from 'react';
import Menu from './Menu.jsx';
import {connect} from '../store/Connect';

class StudyLegend extends Component {
    componentWillUnmount() {
        this.props.cleanUp();
    }

    render() {
        const {isOpened, setOpen, clearStudies, studies, Menu} = this.props;

        return (
            <Menu
                className="ciq-menu ciq-studies collapse"
                isOpened={isOpened}
                setOpen={setOpen}
            >
                <Menu.Title>
                    <span className="ciq-icon ciq-ic-indicator-normal" />
                </Menu.Title>
                <Menu.Body>
                    <cq-study-legend cq-no-close>
                        {studies.length > 0 &&
                            <cq-section-dynamic>
                                <cq-heading>Current Indicators</cq-heading>
                                <cq-study-legend-content>
                                    {studies.map((s, i) =>
                                        <cq-item key={i}>
                                            <cq-label
                                                onClick={s.editFunc}
                                                className="click-to-edit"
                                            >
                                                {s.display}
                                            </cq-label>
                                            <div
                                                onClick={s.closeFunc}
                                                className="ciq-icon ciq-close"
                                            />
                                        </cq-item>
                                    )}
                                </cq-study-legend-content>
                                <cq-placeholder>
                                    <div onClick={clearStudies} className="ciq-btn sm">Clear All</div>
                                </cq-placeholder>
                            </cq-section-dynamic>
                        }
                    </cq-study-legend>
                    <cq-scroll cq-studies>
                        <cq-item class="stxTemplate"></cq-item>
                    </cq-scroll>
                </Menu.Body>
            </Menu>
        );
    }
}

export default connect(
    ({studies}) => ({
        isOpened: studies.open,
        setOpen: studies.setOpen,
        studies: studies.studies,
        clearStudies: studies.clearStudies,
        cleanUp: studies.cleanUp,
        Menu: studies.menu.connect(Menu),
    })
)(StudyLegend);
