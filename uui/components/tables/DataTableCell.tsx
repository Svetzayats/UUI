import * as React from 'react';
import { DataTableCellProps } from '@epam/uui-core';
import { DataTableCell as UuiDataTableCell } from '@epam/uui-components';
import { DataRowAddons } from '../widgets';
import { DataTableCellMods } from './types';
import { TextPlaceholder, Text, TextProps } from '../typography';
import { Tooltip } from '../overlays';
import { settings } from '../../settings';

import './variables.scss';
import css from './DataTableCell.module.scss';

export function DataTableCell<TItem, TId, TCellValue>(initialProps : DataTableCellProps<TItem, TId, TCellValue> & DataTableCellMods) {
    const props = { ...initialProps };

    if (props.isFirstColumn) {
        props.addons = <DataRowAddons size={ props.size } { ...props } />;
    }

    props.renderPlaceholder = props.renderPlaceholder
        || (() => (
            <Text key="t" size={ settings.sizes.dataTableCell.text[props.size] as TextProps['size'] }>
                <TextPlaceholder isNotAnimated />
            </Text>
        ));

    props.renderUnknown = props.renderUnknown
        || (() => (
            <Text key="t" size={ settings.sizes.dataTableCell.text[props.size] as TextProps['size'] }>
                Unknown
            </Text>
        ));

    props.renderTooltip = (tooltipProps) => <Tooltip color="critical" { ...tooltipProps } />;

    const isEditable = !!props.onValueChange;

    const getLeftPadding = () => {
        const { rowProps: { isLoading }, columnsGap, isFirstColumn } = props;

        if (isFirstColumn && isEditable && !isLoading) return settings.sizes.dataTableCell.leftPadding.default;
        if (isEditable && !isLoading) return settings.sizes.dataTableCell.leftPadding.editable;
        if (columnsGap) return isFirstColumn ? columnsGap : +columnsGap / 2;
        return isFirstColumn ? settings.sizes.dataTableCell.leftPadding.utmost : settings.sizes.dataTableCell.leftPadding.default;
    };

    const getRightPadding = () => {
        const { rowProps: { isLoading }, columnsGap, isLastColumn } = props;

        if (isEditable && !isLoading) return settings.sizes.dataTableCell.rightPadding.editable;
        if (columnsGap) return isLastColumn ? columnsGap : +columnsGap / 2;
        return isLastColumn ? settings.sizes.dataTableCell.rightPadding.utmost : settings.sizes.dataTableCell.rightPadding.default;
    };

    props.cx = [
        'data-table-cell',
        css.root,
        props.cx,
        'uui-size-' + (props.size || settings.sizes.defaults.dataTableCell),
        props.isFirstColumn && 'uui-dt-first-column',
        props.isLastColumn && 'uui-dt-last-column',
        css[`align-widgets-${props.alignActions || 'top'}`],
        (props.border || isEditable) && 'uui-dt-vertical-cell-border',
    ];

    props.style = {
        '--uui-dt-cell-padding-start': `${getLeftPadding()}px`,
        '--uui-dt-cell-padding-end': `${getRightPadding()}px`,
    } as React.CSSProperties;

    return <UuiDataTableCell { ...props } />;
}
