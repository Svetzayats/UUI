import React, { useRef } from 'react';
import { Popper } from 'react-popper';
import { usePlateEditorState, isEditorFocused, usePlatePlugins } from '@udecode/plate';
import { Portal } from '@epam/uui-components';
import { isImageSelected } from '../../../helpers';
import * as css from '../../../implementation/Toolbar.scss';

interface ToolbarProps {
    editor: any;
    plugins: any;
    children: any;
}

export function CustomBalloonToolbar(props: ToolbarProps): any {
    const ref = useRef<HTMLElement | null>();
    const editor = usePlateEditorState();
    const inFocus = isEditorFocused(editor);

    const virtualReferenceElement = () => {
        return {
            clientWidth: ref?.current?.getBoundingClientRect().width,
            clientHeight: ref?.current?.getBoundingClientRect().height,
            getBoundingClientRect() {
                const native = window.getSelection();
                const range = native?.getRangeAt(0);
                return range?.getBoundingClientRect();
            },
        };
    };

    return (
        <Portal>
            { isImageSelected(editor) && (
                <Popper
                    referenceElement={ virtualReferenceElement() }
                    placement='top-start'
                    modifiers={ [{ name: 'offset', options: { offset: [0, 12] } }] }
                >
                    { popperProps => (
                        <div
                            onMouseDown={ e => e.preventDefault() }
                            className={ css.container }
                            style={ { ...popperProps.style } }
                            ref={ node => {
                                ref.current = node;
                                (popperProps.ref as React.RefCallback<HTMLDivElement>)(node);
                            } }
                        >
                            { props.children }
                        </div>
                    ) }
                </Popper>
            ) }
        </Portal>
    );
}