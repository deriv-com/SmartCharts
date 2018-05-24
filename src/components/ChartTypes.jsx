import React from 'react';
import {connect} from '../store/Connect';
import Menu from './Menu.jsx';
import List from './List.jsx';
import {Switch} from './Form.jsx';
import '../../sass/components/_chart-types.scss';

const ChartTypes = ({
    Type,
    setType,
    types,
    Menu,
    menuOpen,
    TypeList,
    CloseMenu,
    isMobile
}) => (
    <Menu
        className="ciq-menu ciq-display collapse ciq-chart-types"
    >
        <Menu.Title>
            <Type.icon
                className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                tooltip-title={t.translate("Chart types")} />
        </Menu.Title>
        <Menu.Body>
            {isMobile ? <div className="cq-mobile-title">
                <div className="mobile-title">{t.translate("Chart types")}</div>
            </div> : '' }
            <TypeList height={260}>
                {T => (
                    <React.Fragment>
                        <T.icon  className={`margin ${T.active ? 'active' : ''}`} />
                        <span className='ciq-icon-text'>{T.text}</span>
                    </React.Fragment>
                )}
            </TypeList>
        </Menu.Body>
    </Menu>
);

export default connect(
    ({chartType, assetInformation: ai}) => ({
        Type: chartType.type,
        setType: chartType.setType,
        types: chartType.types,
        setOpen: chartType.setOpen,
        menuOpen: chartType.menu.open,
        Menu: chartType.menu.connect(Menu),
        TypeList: chartType.list.connect(List),
        CloseMenu: chartType.menu.onTitleClick,
        isMobile: chartType.mainStore.chart.isMobile,
    })
)(ChartTypes);
