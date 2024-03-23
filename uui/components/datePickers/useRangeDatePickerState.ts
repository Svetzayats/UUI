import { useState, useEffect } from 'react';
import { IControlled, useUuiContext } from '@epam/uui-core';
import { toCustomDateRangeFormat } from './helpers';
import {
    RangeDatePickerValue, RangeDatePickerProps, RangeDatePickerInputType, RangeDatePickerBodyValue,
} from './types';

export type UseRangeDatePickerState =
    IControlled<RangeDatePickerValue> &
    Pick<RangeDatePickerProps, 'format' | 'onOpenChange' | 'getValueChangeAnalyticsEvent'> & {
        inFocusInitial?: RangeDatePickerInputType | null;
    };

export const useRangeDatePickerState = (props: UseRangeDatePickerState) => {
    const {
        value, format, inFocusInitial = null,
    } = props;
    const context = useUuiContext();

    const [inputValue, setInputValue] = useState<RangeDatePickerValue>(
        toCustomDateRangeFormat(value, format),
    );
    const [inFocus, setInFocus] = useState<RangeDatePickerInputType>(inFocusInitial);

    /**
     * Remove sync when text input will be uncontrolled.
     * Currently it handles value comp prop updates and any value set.
     */
    useEffect(() => {
        setInputValue(toCustomDateRangeFormat(value, format));
    }, [format, value, setInputValue]);

    const onValueChange = (newValue: RangeDatePickerValue) => {
        const fromChanged = value.from !== newValue.from;
        const toChanged = value.to !== newValue.to;
        if (fromChanged || toChanged) {
            props.onValueChange(newValue);

            if (props.getValueChangeAnalyticsEvent) {
                const event = props.getValueChangeAnalyticsEvent(newValue, value);
                context.uuiAnalytics.sendEvent(event);
            }
        }
    };

    const onBodyValueChange = (newValue: RangeDatePickerBodyValue<RangeDatePickerValue>) => {
        setInputValue(toCustomDateRangeFormat(newValue.selectedDate, format));
        setInFocus(newValue.inFocus ?? inFocus);
        onValueChange(newValue.selectedDate);

        if (!!newValue.selectedDate.from && !!newValue.selectedDate.to) {
            props.onOpenChange?.(false);
        }
    };

    return {
        inputValue,
        inFocus,
        setInputValue,
        setInFocus,
        onValueChange,
        onBodyValueChange,
    };
};
