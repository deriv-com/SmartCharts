import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from '../store/Connect';
import '../../sass/components/_menu-dropdown.scss';

const MenuMobile = ({
    className,
    menu_element,
    portalNode,
    open,
    onClick,
    theme,
}) => {
    // fix to remove body background scrolling when scrolling on absolute element
    const disableBodyScroll = () => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = null;
        }
    };

    disableBodyScroll();
    if (!portalNode) return null;
    return ReactDOM.createPortal(
        <div className={`smartcharts-portal ${open ? 'smartcharts-portal--open' : ''}`}>
            <div className={`smartcharts smartcharts-${theme}`}>
                <div className="smartcharts-mobile">
                    <div className={`cq-modal-dropdown ${className || ''} ${open ? 'stxMenuActive' : ''}`}>
                        <div
                            className="cq-menu-overlay"
                            onClick={onClick}
                        >
                            {menu_element}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.getElementById(portalNode),
    );
};

export default connect(({
    chartSetting,
}) => ({
    theme: chartSetting.theme,
}))(MenuMobile);
