import React, { Component } from 'react';
import { connect } from '../store/Connect';


const ChartTableGroupContent = ({ item, isTick }) => (
    <table className={`ciq-chart-table ${isTick ? 'ciq-chart-table--tick' : ''}`}>
        <tbody>
            {item.datas.map((data, idy) => (
                <tr
                    key={`chartTable-${item.key}-${idy}`} // eslint-disable-line react/no-array-index-key
                >
                    <td>{data.Date}</td>
                    {isTick && <td>{data.Close}</td>}
                    {!isTick && [
                        <td key="td-open">{data.Open}</td>,
                        <td key="td-high">{data.High}</td>,
                        <td key="td-low">{data.Low}</td>,
                        <td key="td-close">{data.Close}</td>,
                    ]}
                    <td className="before-last-child">
                        <div className="cq-change-cell">
                            <div className={`${data.Status ? data.Status : 'up'}`}>{data.Change}</div>
                        </div>
                    </td>
                    <td>
                        <div className="cq-change-cell">
                            <div className={`cq-change ${data.Status}`} />
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);


class ChartTableGroup extends Component {
    componentWillReceiveProps(nextProps) {
        const { updateProps, ...props } = nextProps;
        updateProps(props);
    }

    render() {
        const { item, isTick, setDateElement, classname } = this.props;

        return (
            <div
                key={`chartTable-group-${item.key}`}
                className="ciq-chart-table__panel__group"
                ref={el => setDateElement(item.key, el)}
            >
                <div className={`ciq-chart-table__panel__group--title ${classname}`}>
                    {item.date}
                </div>
                <div className="ciq-chart-table__panel__group--content">
                    <ChartTableGroupContent
                        item={item}
                        isTick={isTick}
                    />
                </div>
            </div>
        );
    }
}

export default connect(({ chartTable, chartTableGroup }) => ({
    isTick: chartTableGroup.isTick,
    setDateElement: chartTable.setDateElement,
    classname: chartTableGroup.classname,
    updateProps: chartTableGroup.updateProps,
}))(ChartTableGroup);
