import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from '../store/Connect';
import '../../sass/components/_ciq-chart-table.scss';

const ChartTable = ({
    tableData,
    ChartTableDialog,
    open,
    isTick,
}) => (
    <div className={`cq-dialog-overlay ${open ? 'cq-dialog-active' : ''}`}>
        <ChartTableDialog className="cq-dialog ciq-chart-dialog">
            <>
                <PerfectScrollbar className="ciq-list">
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
                                    <td className="ciq-table-cell">{item.Change}</td>
                                    <td className="ciq-table-cell"><span className={`cq-change ${item.Status}`} /></td>
                                </tr>
                            ))
                            }

                        </tbody>
                    </table>
                </PerfectScrollbar>
            </>
        </ChartTableDialog>
    </div>
);

export default connect(({ chartTable }) => ({
    tableData: chartTable.tableData,
    ChartTableDialog: chartTable.ChartTableDialog,
    open: chartTable.open,
    isTick: chartTable.isTick,
}))(ChartTable);
