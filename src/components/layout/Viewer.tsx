import { Button, Icon } from "components/Atomic";
import { useZakeke, ZakekeViewer } from "zakeke-configurator-react";
import { quitFullscreen, launchFullscreen } from "Helpers";
import { useRef } from "react";
import useStore from "Store";
import { Dialog, useDialogManager } from "../dialogs/Dialogs";
import styled from "styled-components";

import { ReactComponent as PlusSolid } from '../../assets/icons/plus-circle-solid.svg';
import { ReactComponent as MinusSolid } from '../../assets/icons/minus-circle-solid.svg';
import { ReactComponent as ExpandSolid } from '../../assets/icons/expand-solid.svg';

import arIcon from '../../assets/images/ar_icon.png';
import ArDeviceSelectionDialog from "components/dialogs/ArDeviceSelectionDialog";

export const ViewerContainer = styled.div`
  position:relative;
  min-height:0;
`;

export const ZoomInIcon = styled(Icon)`
  position: absolute;
  right: 20px;
  top: calc(50%);
  width: 32px;
  height: 32px;
  color: #fafafa;
`

export const ZoomOutIcon = styled(Icon)`
  position: absolute;
  right: 20px;
  top: calc(50% + 50px);
  width: 32px;
  height: 32px;
  color: #fafafa;
`

export const FullscreenIcon = styled(Icon)`
  position: absolute;
  left: 30px;
  bottom: 50px;
  width: 32px;
  height: 32px;
  color: #fafafa;
`

export const ArIcon = styled(Icon)`
  position: absolute;
  left: 30px;
  top: 20px;
  width: 48px;
  height:48px;
  object-fit: contain;
  background-color: #FAFAFA;
  border-radius: 48px;
  padding: 10px;
  box-shadow: 0px 0px 10px rgb(0 0 0 / 20%);

  img {
    width: 100%;
    height: 100%;
    object-fit: contains;
  }
`

export const TryOnIcon = styled(Icon)`
  position: absolute;
  height:80px;
  right: 0px;
  bottom: 90px;
  cursor:pointer;
`

const Viewer = () => {
    const ref = useRef<HTMLDivElement | null>(null);

    const { isSceneLoading, IS_IOS, IS_ANDROID, getMobileArUrl, openArMobile, isSceneArEnabled, zoomIn, zoomOut } = useZakeke();
    const { showDialog, closeDialog } = useDialogManager();
    const { setIsLoading } = useStore();

    const switchFullscreen = () => {
        if ((document as any).fullscreenElement ||
            (document as any).webkitFullscreenElement ||
            (document as any).mozFullScreenElement ||
            (document as any).msFullscreenElement) {
            quitFullscreen(ref.current!);
        } else {
            launchFullscreen(ref.current!);
        }
    }

    const handleArClick = async () => {

        if (IS_ANDROID || IS_IOS) {
            setIsLoading(true);
            const url = await getMobileArUrl();
            setIsLoading(false);

            if (url)
                if (IS_IOS) {
                    openArMobile(url);
                } else if (IS_ANDROID) {
                    showDialog('open-ar', <Dialog>
                        <Button
                            style={{ display: 'block', width: '100%' }}
                            onClick={() => {
                                closeDialog('open-ar');
                                openArMobile(url);
                            }}>VIEW PRODUCT IN AR</Button>
                    </Dialog>);
                }
        } else {
            showDialog('select-ar', <ArDeviceSelectionDialog />);
        }
    }

    return <ViewerContainer ref={ref}>
        {!isSceneLoading && <ZakekeViewer backgroundColor='#ffffff' />}

        <ZoomInIcon hoverable onClick={zoomIn} ><PlusSolid /></ZoomInIcon>
        <ZoomOutIcon hoverable onClick={zoomOut} ><MinusSolid /></ZoomOutIcon>

        {!IS_IOS && <FullscreenIcon hoverable onClick={switchFullscreen} ><ExpandSolid /></FullscreenIcon>}
        {isSceneArEnabled() && <ArIcon hoverable><img src={arIcon} alt='' onClick={handleArClick} /></ArIcon>}
    </ViewerContainer>
}

export default Viewer;