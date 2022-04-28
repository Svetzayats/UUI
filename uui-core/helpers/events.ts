import * as React from 'react';
import { uuiMarkers } from '../constants';
import { closest } from "./closest";

export function isClickableChildClicked(e: React.SyntheticEvent<Element>): boolean {
    return isChildHasClass(e.target, e.currentTarget, [uuiMarkers.clickable]);
}

export function isChildFocusable(e: React.FocusEvent<HTMLElement>): boolean {
    return isChildHasClass(e.relatedTarget, e.target as unknown as Node, [uuiMarkers.lockFocus]);
}

export function isChildHasClass(target: EventTarget, currentTarget: Node, classNames: string[]): boolean {
    let el = target as HTMLElement;
    while (el && currentTarget != el) {
        if (el.classList && classNames.some(className => el.classList.contains(className))) {
            return true;
        }
        el = el.parentElement;
    }
    return false;
}

export function handleSpaceKey(e: any, cb: any): void {
    if (e.keyCode === 32) {
        e.preventDefault();
        cb(e);
    }
}


export function isInteractionOutsideRelated(e: Event, stopNodes: HTMLElement[]) {
    const [relatedNode] = stopNodes;
    const target = e.target as HTMLElement;

    if (stopNodes.some(node => node && closest(target, node))) {
        return false;
    }

    if (closest(target, '.uui-popper') && +closest(target, '.uui-popper').style.zIndex > (relatedNode !== null ? +relatedNode.style.zIndex : 0)) {
        return false;
    }
    return true;
}