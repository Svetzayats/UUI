import * as React from 'react';
import { DataRowProps, DataSourceListProps, DataSourceState, DropdownBodyProps, isMobile, PickerFilterConfig } from '@epam/uui-core';
import { PickerBodyBaseProps, PickerInputBaseProps, usePickerInput } from '@epam/uui-components';
import { DataPickerRow, PickerItem, DataPickerBody, DataPickerFooter, PickerInputProps } from '../pickers';

const pickerHeight = 300;

type FilterPickerBodyProps<TItem, TId> = DropdownBodyProps & PickerInputBaseProps<TItem, TId> & PickerFilterConfig<any> & {
    showSearch?: boolean;
};

export function FilterPickerBody<TItem, TId>({ 
    highlightSearchMatches = true,
    ...restProps
}: FilterPickerBodyProps<TItem, TId>) {
    const props = { ...restProps, highlightSearchMatches };

    const shouldShowBody = () => props.isOpen;

    const {
        view,
        getName,
        isSingleSelect,
        getRows,
        dataSourceState,
        getFooterProps,
        getPickerBodyProps,
        getListProps,
        handleDataSourceValueChange,
    } = usePickerInput<TItem, TId, PickerInputProps<TItem, TId>>({ ...props, shouldShowBody });

    const getSubtitle = ({ path }: DataRowProps<TItem, TId>, { search }: DataSourceState) => {
        if (!search) return;

        return path
            .map(({ value }) => getName(value))
            .filter(Boolean)
            .join(' / ');
    };

    const renderItem = (item: TItem, rowProps: DataRowProps<TItem, TId>, dsState: DataSourceState) => {
        const { flattenSearchResults } = view.getConfig();

        return (
            <PickerItem
                title={ getName(item) }
                highlightSearchMatches={ highlightSearchMatches }
                { ...(flattenSearchResults ? { subtitle: getSubtitle(rowProps, dsState) } : {}) }
                dataSourceState={ dsState }
                size="36" 
                { ...rowProps }
            />
        );
    };

    const onSelect = (row: DataRowProps<TItem, TId>) => {
        props.onClose();
        handleDataSourceValueChange({ ...dataSourceState, search: '', selectedId: row.id });
    };

    const renderRow = (rowProps: DataRowProps<TItem, TId>, dsState: DataSourceState) => {
        if (rowProps.isSelectable && isSingleSelect() && props.editMode !== 'modal') {
            rowProps.onSelect = onSelect;
        }
        return props.renderRow ? (
            props.renderRow(rowProps, dataSourceState)
        ) : (
            <DataPickerRow
                { ...rowProps }
                key={ rowProps.rowKey }
                size="36"
                padding="12"
                renderItem={ (item, itemProps) => renderItem(item, itemProps, dsState) }
            />
        );
    };

    const renderFooter = () => {
        return <DataPickerFooter { ...getFooterProps() } size="36" />;
    };

    const renderBody = (bodyProps: DataSourceListProps & Omit<PickerBodyBaseProps, 'rows'>, rows: DataRowProps<TItem, TId>[]) => {
        const renderedDataRows = rows.map((props) => renderRow(props, dataSourceState));
        const maxHeight = isMobile() ? document.documentElement.clientHeight : props.maxBodyHeight || pickerHeight;
        const maxWidth = isMobile() ? undefined : 360;

        return (
            <>
                <DataPickerBody
                    { ...bodyProps }
                    selectionMode={ props.selectionMode }
                    rows={ renderedDataRows }
                    maxHeight={ maxHeight }
                    maxWidth={ maxWidth }
                    searchSize="36"
                    editMode="dropdown"
                />
                {renderFooter()}
            </>
        );
    };

    const rows = getRows();

    return renderBody({ ...getPickerBodyProps(rows), ...getListProps(), showSearch: props.showSearch ?? true }, rows);
}
