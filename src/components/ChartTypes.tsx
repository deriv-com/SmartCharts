/* eslint-disable jsx-a11y/no-static-element-interactions */
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons.jsx' was resolved to '/Users/balak... Remove this comment to see the full error message
import { SettingIcon } from './Icons.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Tooltip.jsx' was resolved to '/Users/bal... Remove this comment to see the full error message
import Tooltip from './Tooltip.jsx';
import '../../sass/components/_chart-types.scss';

const TypeIcon = ({
    Icon,
    props,
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
}: any) => <Icon {...props} />;

const ChartTypes = ({
    chartId,
    ChartTypeList,
    ChartTypeMenu,
    enabled,
    menuOpen,
    onChange,
    setOpen,
    showAggregateDialog,
    Type,
    updateProps,
    newDesign,
    types,
    isMobile,
}: any) => {
    if (Type === undefined) return null;

    const onItemClick = (idx: any, chartType: any) => {
        if (Type.id !== chartType.id) {
            onChange(chartType.id, chartType.candleOnly, chartId);
        }
        setOpen(false);
    };

    updateProps(onChange);

    if (newDesign) {
        return (
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div className='sc-chart-type'>
                {types.map((chartType: any) => {
                    const Icon = chartType.icon;
                    let className = 'sc-chart-type__item';
                    className += chartType.active ? ' sc-chart-type__item--active' : '';
                    className += chartType.disabled ? ' sc-chart-type__item--disabled' : '';

                    const onClick = () => (chartType.disabled ? null : onItemClick(0, chartType));
                    return (
                        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <Tooltip
                            key={chartType.id}
                            enabled={chartType.disabled && !isMobile}
                            className={className}
                            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                            content={t.translate('Available only for non-tick time intervals.')}
                            onClick={onClick}
                        >
                            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                            <Icon />
                            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                            <span className='text'>{t.translate(chartType.text)}</span>
                        </Tooltip>
                    );
                })}
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        );
    }

    return (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <ChartTypeMenu className='ciq-display ciq-chart-types' enabled={enabled} title={t.translate('Chart types')}>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <ChartTypeMenu.Title>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <TypeIcon
                    Icon={Type.icon}
                    className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                    tooltip-title={t.translate(Type.text)}
                />
            </ChartTypeMenu.Title>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <ChartTypeMenu.Body>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className='body'>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <ChartTypeList height={260} onItemClick={onItemClick}>
                        {(T: any) => (
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
<>
                            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                            <span className='left'>
                                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                                <TypeIcon Icon={Type.icon} className={`margin ${T.active ? 'active' : ''}`} />
                                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                <span className='ciq-icon-text'>{T.text}</span>
                            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                            </span>
                            {T.settingsOnClick && (
                                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                                <span className='ciq-aggregate-setting' onClick={() => showAggregateDialog(T.id)}>
                                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                                    <SettingIcon />
                                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                </span>
                            )}
</>
)}
                    </ChartTypeList>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            </ChartTypeMenu.Body>
        </ChartTypeMenu>
    );
};

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default connect(({
    chartType,
    chart,
}: any) => ({
    chartId: chart.chartId,
    ChartTypeMenu: chartType.ChartTypeMenu,
    ChartTypeList: chartType.ChartTypeList,
    menuOpen: chartType.menu.open,
    onChange: chartType.setTypeFromUI,
    setOpen: chartType.menu.setOpen,
    showAggregateDialog: chartType.showAggregateDialog,
    Type: chartType.type,
    updateProps: chartType.updateProps,
    types: chartType.types,
    isMobile: chart.isMobile,
}))(ChartTypes);
