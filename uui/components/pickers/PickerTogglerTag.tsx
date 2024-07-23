import * as React from 'react';
import { PickerTogglerRenderItemParams } from '@epam/uui-components';
import { Overwrite } from '@epam/uui-core';
import * as types from '../types';
import { Tag, TagProps } from '../widgets';
import { Tooltip } from '../overlays';
import { TextPlaceholder } from '../typography';
import { settings } from '../../settings';
import css from './PickerTogglerTag.module.scss';

export interface PickerTogglerTagModsOverride {}

interface PickerTogglerTagMods {
    /** Defines component size */
    size?: types.ControlSize;
}

export interface PickerTogglerTagProps<TItem, TId> extends Overwrite<PickerTogglerTagMods, PickerTogglerTagModsOverride>, PickerTogglerRenderItemParams<TItem, TId>, Omit<TagProps, 'size'> {
    getName: (item: TItem) => string;
}

export const PickerTogglerTag = React.forwardRef((props: PickerTogglerTagProps<any, any>, ref: React.Ref<HTMLElement>) => {
    const tagProps = {
        ...props,
        tabIndex: -1,
        size: settings.sizes.pickerToggler.tag[props.size] as TagProps['size'],
        caption: props.rowProps?.isLoading ? <TextPlaceholder /> : props.caption,
    };

    if (props.isCollapsed) {
        const collapsedRows = props.collapsedRows.map((row) => props.getName(row.value)).join(', ');
        return (
            <Tooltip
                key="selected"
                content={ collapsedRows }
                closeDelay={ 150 }
                closeOnMouseLeave="boundary"
                cx={ css.tooltip }
            >
                <Tag ref={ ref } { ...tagProps } />
            </Tooltip>
        );
    } else {
        return <Tag ref={ ref } { ...tagProps } />;
    }
});
