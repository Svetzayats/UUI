import { withMods } from '@epam/uui-core';
import { allEpamPrimaryColors, EpamPrimaryColor } from '../../types';
import { IconButton as UuiIconButton, UuiIconButtonProps } from "@epam/uui";
import { IconColor } from "../../../build";
import { IconButtonBaseProps } from "@epam/uui-components";
import './IconButton.colorvars.scss';

export type ThemeIconColor = EpamPrimaryColor | 'gray30' | 'gray50' | 'gray60';
export const allIconColors: IconColor[] = [...allEpamPrimaryColors, 'gray30', 'gray50', 'gray60'];

export interface IconButtonMods {
    color?: ThemeIconColor;
}

export const applyIconButtonMods = (mods: IconButtonMods) => [
    'uui-theme-promo',
    `icon-button-color-${mods.color}` || "gray60",
];

export interface IconButtonProps extends IconButtonBaseProps, IconButtonMods { }

export const IconButton = withMods<Omit<UuiIconButtonProps, 'color'>, IconButtonMods>(
    UuiIconButton, applyIconButtonMods,
);