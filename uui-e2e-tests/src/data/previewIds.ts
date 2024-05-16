/**
 *
 * Preview IDs are used for screenshot tests
 *
 * These files MUST be kept in sync:
 * app/src/docs/_types/previewIds.ts --> uui-e2e-tests/src/data/previewIds.ts
 */
export enum TBadgePreview {
    'Colors' = 'Colors',
    'Sizes with icon' = 'Sizes with icon',
    'Sizes without icon' = 'Sizes without icon'
}
export enum TButtonPreview {
    'One-line caption' = 'One-line caption',
    'Two-line caption' = 'Two-line caption',
    'No caption' = 'No caption',
    Colors = 'Colors'
}
export enum TLinkButtonPreview {
    'One-line caption' = 'One-line caption',
    'Two-line caption' = 'Two-line caption',
    'No caption' = 'No caption',
    Colors = 'Colors'
}
export enum TAvatarStackPreview {
    'Smaller size' = 'Smaller size',
    'Bigger size' = 'Bigger size'
}
export enum TTagPreview {
    'One-line caption' = 'One-line caption',
    'Two-line caption' = 'Two-line caption',
    'No caption' = 'No caption',
    Colors = 'Colors'
}
export enum TSwitchPreview {
    Basic = 'Basic'
}
export enum TCheckboxPreview {
    Basic = 'Basic'
}
export enum TTextInputPreview {
    'Form'= 'Form',
    'Form Invalid'= 'Form Invalid',
    'Form Disabled'= 'Form Disabled',
    'Form ReadOnly'= 'Form ReadOnly',
    'Inline'= 'Inline',
    'Inline Disabled'= 'Inline Disabled',
    'Inline ReadOnly'= 'Inline ReadOnly'
}
export enum TCountIndicatorPreview {
    Colors = 'Colors',
    Sizes = 'Sizes'
}
export enum TAccordionPreview {
    Expanded = 'Expanded',
    Collapsed = 'Collapsed'
}
export enum TAlertPreview {
    Colors = 'Colors',
    'Layout with icon' = 'Layout with icon',
    'Layout without icon' = 'Layout without icon'
}
export enum TIconButtonPreview {
    Colors = 'Colors',
    Layout = 'Layout'
}
export enum TTabButtonPreview {
    'Active' = 'Active',
    'Active Disabled' = 'Active Disabled',
    'Active Dropdown' = 'Active Dropdown',
    'Active Dropdown Disabled' = 'Active Dropdown Disabled',
    'Inactive' = 'Inactive',
    'Inactive Disabled' = 'Inactive Disabled',
    'Inactive Dropdown' = 'Inactive Dropdown',
    'Inactive Dropdown Disabled' = 'Inactive Dropdown Disabled'
}
export enum TVerticalTabButtonPreview {
    'Active' = 'Active',
    'Active Disabled' = 'Active Disabled',
    'Active Dropdown' = 'Active Dropdown',
    'Active Dropdown Disabled' = 'Active Dropdown Disabled',
    'Inactive' = 'Inactive',
    'Inactive Disabled' = 'Inactive Disabled',
    'Inactive Dropdown' = 'Inactive Dropdown',
    'Inactive Dropdown Disabled' = 'Inactive Dropdown Disabled'
}

export enum TPickerInputPreview {
    /* FORM */
    'Form SingleSelect'= 'Form SingleSelect',
    'Form SingleSelect States'= 'Form SingleSelect States',
    'Form MultiSelect'= 'Form MultiSelect',
    'Form MultiSelect States'= 'Form MultiSelect States',
    'Form MultiSelect Multiline'= 'Form MultiSelect Multiline',
    'Form MultiSelect Multiline States'= 'Form MultiSelect Multiline States',
    /* FORM OPENED */
    'Form Opened SingleSelect' = 'Form Opened SingleSelect',
    'Form Opened MultiSelect' = 'Form Opened MultiSelect',
    'Form Opened SingleSelect Tree' = 'Form Opened SingleSelect Tree',
    'Form Opened MultiSelect Tree' = 'Form Opened MultiSelect Tree',

    /* INLINE */
    'Inline SingleSelect'= 'Inline SingleSelect',
    'Inline SingleSelect States'= 'Inline SingleSelect States',
    'Inline MultiSelect'= 'Inline MultiSelect',
    'Inline MultiSelect States'= 'Inline MultiSelect States',
    'Inline MultiSelect Multiline'= 'Inline MultiSelect Multiline',
    'Inline MultiSelect Multiline States'= 'Inline MultiSelect Multiline States',

    /* CELL */
    'Cell SingleSelect'= 'Cell SingleSelect',
    'Cell SingleSelect States'= 'Cell SingleSelect States',
    'Cell MultiSelect'= 'Cell MultiSelect',
    'Cell MultiSelect States'= 'Cell MultiSelect States',
    'Cell MultiSelect Multiline'= 'Cell MultiSelect Multiline',
    'Cell MultiSelect Multiline States'= 'Cell MultiSelect Multiline States'

}

export enum TDatePickerPreview {
    Form = 'Form',
    'Form Open' = 'Form Open',
    'Form Disabled' = 'Form Disabled',
    'Form ReadOnly' = 'Form ReadOnly',
    Cell = 'Cell',
    'Cell Disabled' = 'Cell Disabled',
    'Cell ReadOnly' = 'Cell ReadOnly',
    Inline = 'Inline',
    'Inline Disabled' = 'Inline Disabled',
    'Inline ReadOnly' = 'Inline ReadOnly'
}

export enum TRangeDatePickerPreview {
    'Basic' = 'Basic',
    'Opened' = 'Opened',
    'Opened With Presets' = 'Opened With Presets',
    'ReadOnly' = 'ReadOnly',
    'Disabled' = 'Disabled'
}
