import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../store/Connect';
import '../../sass/components/_bottom-widget-container.scss';

const BottomWidgetsContainer = ({ bottom, children, isReadyToShow, top, updateChartMargin }) => {
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

BottomWidgetsContainer.propTypes = {
    bottom: PropTypes.number,
    isReadyToShow: PropTypes.bool,
    top: PropTypes.number,
    updateChartMargin: PropTypes.func.isRequired,
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
