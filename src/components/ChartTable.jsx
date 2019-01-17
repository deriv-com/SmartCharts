import React from 'react';
import { Scrollbars } from 'tt-react-custom-scrollbars';
import { CloseIcon, ItemIconMap, SymbolPlaceholderIcon } from './Icons.jsx';
import { connect } from '../store/Connect';
import '../../sass/components/_ciq-chart-table.scss';

const ChartTable = ({
    isMobile,
    tableData,
    Dialog,
    open,
    isTick,
    symbol,
    setOpen,
}) => {
    const SymbolIcon = ItemIconMap[symbol.symbol] || SymbolPlaceholderIcon;
    const width = isTick ? '320px' : '565px';

    return (
        <div className={`cq-dialog-overlay ${open ? 'cq-dialog-active' : ''}`} style={{ '--table-width': width }}>
            <Dialog className="cq-dialog ciq-chart-dialog">
            <>
                {isMobile && (
                    <div className="cq-titlebar">
                        {SymbolIcon && <SymbolIcon className={`ic-${symbol.symbol}`} />}
                        <div className="cq-title">{`${symbol.name} ${t.translate('Chart Table')}`}</div>
                        <CloseIcon className="icon-close-menu" onClick={() => setOpen(false)} />
                    </div>
                )
                }
                <Scrollbars
                    autoHeight
                    autoHeightMax="80vh"
                    className="ciq-list"
                >
                    {isMobile
                        ? (
                            <table className="ciq-chart-table">
                                <tbody>
                                    {tableData.map((item, idx) => (
                                        <tr
                                            className="ciq-table-row"
                                            key={`chartTable-${idx}`} // eslint-disable-line react/no-array-index-key
                                        >
                                            <td>
                                                <div className="ciq-table-cell">
                                                    <div className="ciq-table-date">{item.Date}</div>
                                                    <div className={`${item.Status ? item.Status : 'up'}`}>{item.Change}</div>
                                                    <div className={`cq-change ${item.Status}`} />
                                                </div>
                                                <div className="ciq-table-cell">
                                                    {isTick && <div><span>{t.translate('Close')}</span>{item.Close}</div>}
                                                    {!isTick
                                                    && [
                                                        <div key="item-open"><span>{t.translate('O')}</span>{item.Open}</div>,
                                                        <div key="item-high"><span>{t.translate('H')}</span>{item.High}</div>,
                                                        <div key="item-low"><span>{t.translate('L')}</span>{item.Low}</div>,
                                                        <div key="item-close"><span>{t.translate('C')}</span>{item.Close}</div>,
                                                    ]}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                        :                        (
                            <table className="ciq-chart-table">
                                <thead>
                                    <tr className="ciq-table-head">
                                        <th className="ciq-table-cell">{t.translate('Date')}</th>
                                        {isTick
                                            ? <th className="ciq-table-cell">{t.translate('Tick')}</th>
                                            :                                                (
                                                <React.Fragment>
                                                    <th className="ciq-table-cell">{t.translate('Open')}</th>
                                                    <th className="ciq-table-cell">{t.translate('High')}</th>
                                                    <th className="ciq-table-cell">{t.translate('Low')}</th>
                                                    <th className="ciq-table-cell">{t.translate('Close')}</th>
                                                </React.Fragment>
                                            )
                                        }
                                        <th className="ciq-table-cell">
                                            <div className="cq-change-cell">
                                                {t.translate('Change')}
                                                <CloseIcon className="icon-close-menu" onClick={() => setOpen(false)} />
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((item, idx) => (
                                        <tr
                                            key={`chartTable-${idx}`} // eslint-disable-line react/no-array-index-key
                                            className="ciq-table-row"
                                        >
                                            <td className="ciq-table-cell">{item.Date}</td>
                                            {isTick && <td className="ciq-table-cell">{item.Close}</td>}
                                            {!isTick
                                        && [
                                            <td key="td-open" className="ciq-table-cell">{item.Open}</td>,
                                            <td key="td-high" className="ciq-table-cell">{item.High}</td>,
                                            <td key="td-low" className="ciq-table-cell">{item.Low}</td>,
                                            <td key="td-close" className="ciq-table-cell">{item.Close}</td>,
                                        ]}
                                            <td className="ciq-table-cell">
                                                <div className="cq-change-cell">
                                                    <div className={`${item.Status ? item.Status : 'up'}`}>{item.Change}</div>
                                                    <div className={`cq-change ${item.Status}`} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                    }

                                </tbody>
                            </table>
                        )
                    }
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
}))(ChartTable);
