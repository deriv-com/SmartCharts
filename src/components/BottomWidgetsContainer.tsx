import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_bottom-widget-container.scss';

type OwnProps = {
    bottom?: number;
    isReadyToShow?: boolean;
    top?: number;
    updateChartMargin: (...args: any[]) => any;
};

// @ts-expect-error ts-migrate(2456) FIXME: Type alias 'Props' circularly references itself.
type Props = OwnProps & typeof BottomWidgetsContainer.defaultProps;

// @ts-expect-error ts-migrate(7022) FIXME: 'BottomWidgetsContainer' implicitly has type 'any'... Remove this comment to see the full error message
const BottomWidgetsContainer = ({ bottom, children, isReadyToShow, top, updateChartMargin }: Props) => {
    React.useEffect(() => {
        const component = React.Children.only(children);

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

export default connect(({ bottomWidgetsContainer: store }) => ({
    bottom: store.bottom,
    isReadyToShow: store.isReadyToShow,
    top: store.top,
    updateChartMargin: store.updateChartMargin,
}))(BottomWidgetsContainer);
