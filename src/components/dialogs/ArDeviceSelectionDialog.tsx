import useStore from "Store";
import styled from "styled-components";
import { useZakeke } from "zakeke-configurator-react";
import { Dialog, useDialogManager } from "./Dialogs";
import QRCode from 'qrcode.react';

import deviceAndroid from '../../assets/images/device_android.png';
import deviceIOS from '../../assets/images/device_ios.png';

export const DeviceSelectionDialog = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 40px;

    img {
      width: 100%;
      height: 300px;
      object-fit: contain;
      padding: 50px;
      cursor: pointer;

      &:hover {
        opacity: 0.7;
      }
    }
`;


export const QRCodeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;


const ArDeviceSelectionDialog = () => {
    const { setIsLoading } = useStore();
    const { showDialog, closeDialog } = useDialogManager();
    const { getQrCodeArUrl } = useZakeke();

    const showQrCode = async (type: 'iOS' | 'Android') => {
        setIsLoading(true);
        const url = await getQrCodeArUrl(type);
        setIsLoading(false);

        showDialog('qr', <Dialog>
            <QRCodeContainer>
                <h3>Scan the QR code with your phone</h3>
                <QRCode value={url} size={256} />
            </QRCodeContainer>
        </Dialog>)
    }

    return <Dialog>
        <DeviceSelectionDialog>
            <img src={deviceAndroid} alt='android' onClick={() => {
                closeDialog('select-ar');
                showQrCode('Android');
            }} />
            <img src={deviceIOS} alt='ios' onClick={() => {
                closeDialog('select-ar');
                showQrCode('iOS');
            }} />
        </DeviceSelectionDialog>
    </Dialog>
}

export default ArDeviceSelectionDialog;