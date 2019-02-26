import React       from 'react';
import PropTypes   from 'prop-types';
import { connect } from '../store/Connect';

import '../../sass/components/_bottom-widget-container.scss';


class BottomWidgetsContainer extends React.Component {
    componentDidUpdate() {
        if (React.Children.count(this.props.children)) {
            this.props.updateChartMargin(200);
        } else {
            this.props.updateChartMargin(50);
        }
    }
    render() {
        const {
            bottom,
            isReadyToShow,
            children,
            top,
        } =  this.props;

        if (!isReadyToShow) {
            return null;
        }

        const styles = {
            top,
            bottom,
        };

        return (
            <div
                className="cq-bottom-ui-widgets"
                style={styles}
            >
                { children }
            </div>
        );
    }
}

BottomWidgetsContainer.propTypes = {
    bottom           : PropTypes.number,
    isReadyToShow    : PropTypes.bool,
    top              : PropTypes.number,
    updateChartMargin: PropTypes.func.isRequired,
};

BottomWidgetsContainer.defaultProps = {
    bottom       : 0,
    isReadyToShow: false,
    top          : 0,
};


export default connect(({ bottomWidgetsContainerStore: store }) => ({
    bottom           : store.bottom,
    isReadyToShow    : store.isReadyToShow,
    top              : store.top,
    updateChartMargin: store.updateChartMargin,
}))(BottomWidgetsContainer);
