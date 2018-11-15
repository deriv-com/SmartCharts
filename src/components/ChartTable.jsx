import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from '../store/Connect';
import '../../sass/components/_ciq-chart-table.scss';

const ChartTable = ({
    isMobile,
    tableData,
    ChartTableDialog,
    open,
    isTick,
}) => (
    <div className={`cq-dialog-overlay ${open ? 'cq-dialog-active' : ''}`}>
        <ChartTableDialog className="cq-dialog ciq-chart-dialog">
            <>
                <PerfectScrollbar className="ciq-list">
                    {isMobile ?
                        <table className="ciq-chart-table">
                            <tbody>
                                {tableData.map((item, idx) => (
                                    <tr className="ciq-table-row" 
                                    key={`chartTable-${idx}`} // eslint-disable-line react/no-array-index-key
                                    >
                                        <div className="ciq-table-cell">
                                            <div className='ciq-table-date'>{item.Date}</div>
                                            <div className={`${item.Status ? item.Status : 'up'}`}>{item.Change}</div>
                                            <div className={`cq-change ${item.Status}`}></div>
                                        </div>
                                        <div className="ciq-table-cell">
                                            {isTick && <div><span>{t.translate('Close')}</span>{item.Close}</div>}
                                            {!isTick
                                                && [
                                                    <div><span>{t.translate('Open')}</span>{item.Open}</div>,
                                                    <div><span>{t.translate('High')}</span>{item.High}</div>,
                                                    <div><span>{t.translate('Low')}</span>{item.Low}</div>,
                                                    <div><span>{t.translate('Close')}</span>{item.Close}</div>,
                                                ]}
                                        </div>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    :
                        <table className="ciq-chart-table">
                        <tbody>
                            <tr className="ciq-table-head">
                                <th className="ciq-table-cell">{t.translate('Date')}</th>
                                {isTick
                                    ? <th className="ciq-table-cell">{t.translate('Tick')}</th>
                                    :                                [
                                        <th className="ciq-table-cell">{t.translate('Open')}</th>,
                                        <th className="ciq-table-cell">{t.translate('High')}</th>,
                                        <th className="ciq-table-cell">{t.translate('Low')}</th>,
                                        <th className="ciq-table-cell">{t.translate('Close')}</th>,
                                    ]}
                                <th className="ciq-table-cell">{t.translate('Change')}</th>
                                <th className="ciq-table-cell" />
                            </tr>

                            {tableData.map((item, idx) => (
                                <tr
                                    key={`chartTable-${idx}`} // eslint-disable-line react/no-array-index-key
                                    className="ciq-table-row"
                                >
                                    <td className="ciq-table-cell">{item.Date}</td>
                                    {isTick && <td className="ciq-table-cell">{item.Close}</td>}
                                    {!isTick
                                        && [
                                            <td className="ciq-table-cell">{item.Open}</td>,
                                            <td className="ciq-table-cell">{item.High}</td>,
                                            <td className="ciq-table-cell">{item.Low}</td>,
                                            <td className="ciq-table-cell">{item.Close}</td>,
                                        ]}
                                    <td className={`ciq-table-cell ${item.Status ? item.Status : 'up'}`}>{item.Change}</td>
                                    <td className="ciq-table-cell"><span className={`cq-change ${item.Status}`} /></td>
                                </tr>
                            ))
                            }

                        </tbody>
                    </table>
                    }
                </PerfectScrollbar>
            </>
        </ChartTableDialog>
    </div>
);

export default connect(({  chart, chartTable }) => ({
    isMobile: chart.isMobile,
    tableData: chartTable.tableData,
    ChartTableDialog: chartTable.ChartTableDialog,
    open: chartTable.open,
    isTick: chartTable.isTick,
}))(ChartTable);
