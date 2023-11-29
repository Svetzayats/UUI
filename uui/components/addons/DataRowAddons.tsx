import React from 'react';
import { uuiElement, uuiMarkers } from '@epam/uui-core';
import { DragHandle } from '@epam/uui-components';
import { DataRowAddonsProps } from './types';
import { Checkbox } from '../inputs';
import { ReactComponent as FoldingArrow } from '@epam/assets/icons/common/navigation-chevron-down-18.svg';
import { IconContainer } from '../layout';
import css from './DataRowAddons.module.scss';

export function DataRowAddons<TItem, TId>(props: DataRowAddonsProps<TItem, TId>) {
    const row = props.rowProps;
    const additionalItemSize = +props.size < 30 ? '12' : '18';

    return (
        <>
            {row.dnd?.srcData && <DragHandle key="dh" cx={ css.dragHandle } />}
            {row?.checkbox?.isVisible && (
                <Checkbox
                    key="cb"
                    cx={ css.checkbox }
                    tabIndex={ props.tabIndex }
                    size={ additionalItemSize }
                    value={ row.isChecked }
                    indeterminate={ !row.isChecked && row.isChildrenChecked }
                    onValueChange={ () => row.onCheck?.(row) }
                    isDisabled={ row.checkbox.isDisabled }
                    isInvalid={ row.checkbox.isInvalid }
                />
            )}
            {row.indent > 0 && (
                <div key="fold" className={ css.indent } style={ { marginLeft: (row.indent - 1) * 24 } }>
                    {row.isFoldable && (
                        <IconContainer
                            rawProps={ {
                                'aria-label': row.isFolded ? 'Unfold' : 'Fold',
                                role: 'button',
                            } }
                            key="icon"
                            icon={ FoldingArrow }
                            cx={ [
                                uuiElement.foldingArrow, css[`folding-arrow-${additionalItemSize}`], uuiMarkers.clickable, css.iconContainer,
                            ] }
                            rotate={ row.isFolded ? '90ccw' : '0' }
                            onClick={ () => row.onFold(row) }
                        />
                    )}
                </div>
            )}
        </>
    );
}
