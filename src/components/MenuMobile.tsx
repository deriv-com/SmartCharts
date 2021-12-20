import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';
import '../../sass/components/_menu-dropdown.scss';

type TMenuMobileProps = {
    className?: string;
    open: boolean;
    portalNodeId?: string;
    onClick: React.MouseEventHandler<HTMLDivElement>;
    menu_element: React.ReactElement | null;
};

const MenuMobile = ({ className, menu_element, portalNodeId, open, onClick }: TMenuMobileProps) => {
    const { chartSetting } = useStores();
    const { theme } = chartSetting;
    // fix to remove body background scrolling when scrolling on absolute element
    const disableBodyScroll = () => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    disableBodyScroll();
    if (!portalNodeId) return menu_element;
    const portalElement = document.getElementById(portalNodeId);

    if (!portalElement) return null;

    return ReactDOM.createPortal(
        <div className={`smartcharts-portal ${open ? 'smartcharts-portal--open' : ''}`}>
            <div className={`smartcharts smartcharts-${theme}`}>
                <div className='smartcharts-mobile'>
                    <div className={`cq-modal-dropdown ${className || ''} ${open ? 'stxMenuActive' : ''}`}>
                        <div className='cq-modal__overlay' onClick={onClick}>
                            {menu_element}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        portalElement
    );
};

export default observer(MenuMobile);
