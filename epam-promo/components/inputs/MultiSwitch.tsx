import * as React from 'react';
import { withMods } from '@epam/uui-core';
import { UuiMultiSwitch, UuiMultiSwitchColor, MultiSwitchProps as UuiMultiSwitchProps } from "@epam/uui";


export type MultiSwitchColor = 'blue' | 'gray50';

export interface MultiSwitchMods {
    color?: MultiSwitchColor;
}

const mapColorToMod: Record<UuiMultiSwitchColor, MultiSwitchColor> = {
    primary: 'blue',
    secondary: 'gray50',
};

export const applyMultiSwitchMods = () => ['uui-theme-promo'];

export const MultiSwitch = withMods(
    UuiMultiSwitch,
    applyMultiSwitchMods,
    (props) => ({
        color: mapColorToMod[props.color] || mapColorToMod.primary,
    }),
) as <TValue>(props: (Omit<UuiMultiSwitchProps<TValue>, 'color'> & MultiSwitchMods)) => JSX.Element;


// Previous variant without theme UUI:
// export const Button = withMods<ButtonProps, ButtonMods>(
//     uuiButton,
//     applyButtonMods,
//     (props) => ({
//         dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
//         clearIcon: systemIcons[props.size || defaultSize].clear,
//     }),
// );


// import * as React from 'react';
// import { IEditable, IHasRawProps } from '@epam/uui-core';
// import { ButtonProps } from '@epam/uui-components';
// import { ControlGroup } from '../layout';
// import { Button, ButtonMods } from '../buttons';
// import { SizeMod } from '../types';
//
// interface MultiSwitchItem<TValue> extends ButtonProps, ButtonMods {
//     id: TValue;
// }
//
// export interface MultiSwitchProps<TValue> extends IEditable<TValue>, SizeMod, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
//     items: MultiSwitchItem<TValue>[];
//     color?: 'blue' | 'gray50';
// }
//
// function MultiSwitchComponent<TValue>(props: MultiSwitchProps<TValue>, ref: React.ForwardedRef<HTMLDivElement>) {
//     return (
//         <ControlGroup ref={ ref } rawProps={ { ...props.rawProps, role: 'tablist' } }>
//             { props.items.map((item, index) => (
//                 <Button
//                     {  ...item }
//                     isDisabled={ props.isDisabled }
//                     key={ index + '-' + item.id }
//                     onClick={ () => props.onValueChange(item.id) }
//                     fill={ props.value === item.id ? 'solid' : 'white' }
//                     color={ props.color === 'gray50' && props.value === item.id ? 'blue' : props.color || 'blue' }
//                     size={ props.size }
//                     rawProps={ { 'aria-current': props.value === item.id, role: 'tab' } }
//                 />
//             )) }
//         </ControlGroup>
//     );
// }
//
// export const MultiSwitch = React.forwardRef(MultiSwitchComponent) as <TValue>(props: MultiSwitchProps<TValue>, ref: React.ForwardedRef<HTMLDivElement>) => JSX.Element;