import { T } from 'Helpers'
import React, {
    FunctionComponent, ReactElement,
    Suspense,
    useContext,
} from 'react'
import { createPortal } from 'react-dom'
import { Button } from 'components/Atomic'
import styled from 'styled-components'
import useStore from '../../Store';
import { ReactComponent as CloseIcon } from '../../assets/icons/times-solid.svg'

const dialogsPortal = document.getElementById('dialogs-portal')!;

export const dialogContext = React.createContext({ dialogId: '' });

export function useDialogManager() {
    const { addDialog, removeDialog } = useStore();
    const { dialogId } = useContext(dialogContext);

    const showDialog = (key: string, dialog: ReactElement) => addDialog(key, dialog);
    const closeDialog = (key: string) => removeDialog(key);

    return {
        currentDialogId: dialogId,
        showDialog,
        closeDialog,
    }
}

const DialogOverlay = styled.div`
    position: fixed;
    background-color: rgba(0, 0, 0, 0.7);
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 40px;
    overflow: auto;
    z-index: 12;
`

const DialogWindowContainer = styled.div`
    padding: 60px 20px 20px 20px;
    background-color: white;
    border-radius: 5px;
    flex-basis: 600px;
    display: flex;
    flex-direction: column;
    position: relative;
`

const DialogWindowClose = styled(CloseIcon)`
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    font-size:20px;
    z-index: 999;
    width: 24px;
    height: 24px;

    &:hover {
        opacity: 0.5;
    }
`

export const DialogWindow: FunctionComponent<{ className?: string, showCloseButton?: boolean, onClose: () => void }> = ({ children, className, showCloseButton = true, onClose }) => {
    return <DialogWindowContainer className={className}>
        {showCloseButton && <DialogWindowClose onClick={onClose} />}
        {children}
    </DialogWindowContainer>
}

// Side padding is for select outlines that must not be cropped
const DialogContent = styled.div`
    overflow-y: auto;
    padding: 4px;
    flex: 1;
    min-height: 0;
`

const DialogFooterButton = styled(Button)`
    min-width: 100px;
`

const DialogFooter = styled.div<{ alignButtons?: string}>`
    display: flex;
    align-items: center;
    ${props => props.alignButtons === 'left' && 'justify-content:flex-start'};
    ${props => props.alignButtons === 'center' && 'justify-content:center'};
    ${props => (props.alignButtons === 'right' || !props.alignButtons) && 'justify-content:flex-end'};
    padding-top: 20px;

    ${DialogFooterButton} {
       margin-left: 20px;
    }
`

const DialogTitle = styled.h1`
    font-size: 15px;
    text-align: left;
    margin:0;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    padding: 20px 20px;
    width: 100%;
`;

interface DialogButton {
    label: string;
    secondary?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

interface DialogProps {
    showCloseButton?: boolean;
    children?: React.ReactNode,
    onClose?: () => void;
    title?: string;
    windowDecorator?: React.FunctionComponent<any>;
    buttons?: DialogButton[];
    alignButtons?: string;
    marginButtons?: number;
}

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>((props, ref) => {
    const Window = props.windowDecorator || DialogWindow;
    const { removeDialog } = useStore();
    const { dialogId } = useContext(dialogContext);
    const onClose = props.onClose || (() => removeDialog(dialogId));

    return <DialogOverlay>
        {React.createElement(Window, { onClose, showCloseButton: props.showCloseButton },
            <React.Fragment>
                {props.title && <DialogTitle>{props.title}</DialogTitle>}

                <DialogContent ref={ref}>
                    <Suspense fallback={'Loading...'}>
                        {props.children}
                    </Suspense>
                </DialogContent>

                {props.buttons && props.buttons.length > 0 && <DialogFooter alignButtons={props.alignButtons}>
                    {props.buttons.map((button, index) => {
                        return <DialogFooterButton
                            key={button.label}
                            disabled={button.disabled}
                            primary={!button.secondary}
                            onClick={() => button.onClick?.()}>
                            {button.label}
                        </DialogFooterButton>;
                    })}
                </DialogFooter>}
            </React.Fragment>
        )}
    </DialogOverlay>
});

export const DialogsRenderer: FunctionComponent<{}> = props => {
    const { dialogs } = useStore();

    return <>{createPortal(
        dialogs.map((x) => <dialogContext.Provider key={x.id} value={{ dialogId: x.id }}>
            {x.dialog}
        </dialogContext.Provider>), dialogsPortal)}
    </>;
}

// #region Basic dialogs

export const BasicDialogWindow = styled(DialogWindow)`
    max-width: 600px;
`

export const MessageDialog: FunctionComponent<{ message: React.ReactNode } & DialogProps> = ({ message, ...props }) => {

    const { closeDialog } = useDialogManager();
    const { dialogId } = useContext(dialogContext);

    return <Dialog
        windowDecorator={BasicDialogWindow}
        buttons={[
            {
                label: 'OK',
                onClick: () => {
                    closeDialog(dialogId);
                    props.onClose?.();
                }
            }
        ]}
        {...props}  >
        <p>{message}</p>
    </Dialog >
}

export const QuestionDialog: FunctionComponent<{
    message: React.ReactNode,
    buttonYesLabel?: string,
    buttonNoLabel?: string,
    onYesClick?: () => void, onNoClick?: () => void
} & DialogProps> = ({ message, buttonYesLabel, buttonNoLabel, onYesClick, onNoClick, ...props }) => {

    const { closeDialog } = useDialogManager();
    const { dialogId } = useContext(dialogContext);

    return <Dialog
        windowDecorator={BasicDialogWindow}
        buttons={[
            { label: buttonYesLabel || T._('Yes', 'Admin'), onClick: onYesClick || (() => closeDialog(dialogId)) },
            { label: buttonNoLabel || T._('No', 'Admin'), secondary: true, onClick: onNoClick || (() => closeDialog(dialogId)) }
        ]}
        {...props}  >
        <p>{message}</p>
    </Dialog >
}
// #endregion