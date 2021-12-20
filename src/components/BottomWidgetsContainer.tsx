import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';
import '../../sass/components/_bottom-widget-container.scss';

const BottomWidgetsContainer = ({ children }: { children?: React.ReactNode }) => {
    const { bottomWidgetsContainer } = useStores();
    const { bottom, isReadyToShow, top, updateChartMargin } = bottomWidgetsContainer;
    React.useEffect(() => {
        const component = React.Children.only(children) as React.ReactElement;

        updateChartMargin(!!(component && component.props.bottomWidgets));
    }, [children, updateChartMargin]);

    if (!isReadyToShow) {
        return null;
    }

    const styles = {
        top,
        bottom,
    };

    return (
        <div className='cq-bottom-ui-widgets' style={styles}>
            {children}
        </div>
    );
};

BottomWidgetsContainer.defaultProps = {
    bottom: 0,
    isReadyToShow: false,
    top: 0,
};

export default observer(BottomWidgetsContainer);
