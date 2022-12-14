import * as React from 'react';
import { IEditable, IHasRawProps } from '@epam/uui-core';
import { ButtonProps } from '@epam/uui-components';
import { ControlGroup } from '../layout';
import { Button, ButtonMods } from '../buttons';
import { SizeMod } from '../types';

interface MultiSwitchItem<TValue> extends ButtonProps, ButtonMods {
    id: TValue;
}

export type UuiMultiSwitchColor = 'primary' | 'secondary';

export interface MultiSwitchProps<TValue> extends IEditable<TValue>, SizeMod, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    items: MultiSwitchItem<TValue>[];
    color?: UuiMultiSwitchColor;
}

function MultiSwitchComponent<TValue>(props: MultiSwitchProps<TValue>, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <ControlGroup ref={ ref } rawProps={ { ...props.rawProps, role: 'tablist' } }>
            { props.items.map((item, index) => (
                <Button
                    {  ...item }
                    isDisabled={ props.isDisabled }
                    key={ index + '-' + item.id }
                    onClick={ () => props.onValueChange(item.id) }
                    fill={ props.value === item.id ? 'solid' : 'white' }
                    color={ props.color === 'secondary' && props.value === item.id ? 'primary' : props.color || 'primary' }
                    size={ props.size }
                    rawProps={ { 'aria-current': props.value === item.id, role: 'tab' } }
                />
            )) }
        </ControlGroup>
    );
}

export const UuiMultiSwitch = React.forwardRef(MultiSwitchComponent) as <TValue>(props: MultiSwitchProps<TValue>, ref: React.ForwardedRef<HTMLDivElement>) => JSX.Element;