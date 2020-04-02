import React, { Component } from 'react';
import { Scrollbars } from 'tt-react-custom-scrollbars';
import { CloseBoldIcon, ItemIconMap, SymbolPlaceholderIcon } from './Icons.jsx';
import { connect } from '../store/Connect';
import '../../sass/components/_ciq-chart-table.scss';

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
    componentDidUpdate() {
        const { scrollPanel } = this.props;
        if (scrollPanel && scrollPanel.container && !this.scrollPanelTop) this.scrollPanelTop = scrollPanel.container.getBoundingClientRect().top;
    }

    render() {
        const { item, isTick, setDateElement, ele } = this.props;

        let classname = '';

        if (ele) {
            const bound = ele.getBoundingClientRect();
            const groupTitleHeight = 44; // height of fixed header

            const fromTop = bound.top - this.scrollPanelTop;
            const fromBottom = bound.height + fromTop - groupTitleHeight;

            if (fromTop <= 0 && fromBottom >= 0) {
                classname = 'sticky-top';
            } else if (fromTop <= 0 && fromBottom <= 0  && fromBottom > (-1 * groupTitleHeight)) {
                classname = 'sticky-bottom';
            }
        }

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


const ChartTable = ({
    isMobile,
    tableData,
    Dialog,
    open,
    isTick,
    symbol,
    setOpen,
    scrollTop,
    updateScrollSpy,
    setScrollPanel,
    dateElements,
    scrollPanel,
    setDateElement,
}) => {
    const SymbolIcon = ItemIconMap[symbol.symbol] || SymbolPlaceholderIcon;
    const width = isTick ? '380px' : '704px';

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className={`cq-dialog-overlay ${open ? 'cq-dialog-active' : ''}`} style={{ '--table-width': width }}>
            <Dialog className="cq-dialog ciq-chart-dialog">
            <>
                {isMobile && (
                    <div className="cq-titlebar">
                        {SymbolIcon && <SymbolIcon className={`ic-${symbol.symbol}`} />}
                        <div className="cq-title">{`${symbol.name} ${t.translate('Chart Table')}`}</div>
                        <CloseBoldIcon className="icon-close-menu" onClick={handleClose} />
                    </div>
                )
                }
                {isMobile ? '' : (
                    <table className="ciq-chart-table">
                        <thead>
                            <tr>
                                <th>{t.translate('Date')}</th>
                                {isTick
                                    ? <th>{t.translate('Tick')}</th>
                                    : (
                                        <React.Fragment>
                                            <th>{t.translate('Open')}</th>
                                            <th>{t.translate('High')}</th>
                                            <th>{t.translate('Low')}</th>
                                            <th>{t.translate('Close')}</th>
                                        </React.Fragment>
                                    )
                                }
                                <th className="before-last-child">
                                    <div className="cq-change-cell">
                                        {t.translate('Change')}
                                    </div>
                                </th>
                                <th>
                                    <CloseBoldIcon className="icon-close-menu" onClick={handleClose} />
                                </th>
                            </tr>
                        </thead>
                    </table>
                )}
                <Scrollbars
                    className="ciq-chart-table__panel"
                    onScroll={updateScrollSpy}
                    ref={setScrollPanel}
                >
                    {tableData.map(item => (
                        <ChartTableGroup
                            key={item.key}
                            item={item}
                            isTick={isTick}
                            ele={dateElements[item.key]}
                            scrollTop={scrollTop}
                            scrollPanel={scrollPanel}
                            setDateElement={setDateElement}
                        />
                    ))}
                </Scrollbars>
            </>
            </Dialog>
        </div>
    );
};

export default connect(({  chart, chartTable }) => ({
    isMobile: chart.isMobile,
    tableData: chartTable.tableData,
    Dialog: chartTable.Dialog,
    open: chartTable.open,
    isTick: chartTable.isTick,
    symbol: chartTable.symbol,
    setOpen: chartTable.setOpen,
    scrollTop: chartTable.scrollTop,
    dateElements: chartTable.dateElements,
    updateScrollSpy: chartTable.updateScrollSpy,
    setScrollPanel: chartTable.setScrollPanel,
    setDateElement: chartTable.setDateElement,
    scrollPanel: chartTable.scrollPanel,
}))(ChartTable);
