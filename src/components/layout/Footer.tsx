import { T } from "Helpers";
import useStore from "Store";
import styled from "styled-components";
import { useZakeke } from "zakeke-configurator-react";
import { useDialogManager } from "../dialogs/Dialogs";
import ErrorDialog from "../dialogs/ErrorDialog";
import PdfDialog from "../dialogs/PdfDialog";
import ShareDialog from "../dialogs/ShareDialog";
import { Icon } from "components/Atomic";

import { ReactComponent as PdfSolid } from '../../assets/icons/file-pdf-solid.svg';
import { ReactComponent as ShareSolid } from '../../assets/icons/share-alt-square-solid.svg';

export const FooterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 50px;
  min-height: 50px;
  background-color: #42545e;
  flex-direction: row;
  grid-gap: 10px;
  align-items: center;
  padding: 0px 15px;
  font-size: 14px;
  margin-top:20px;
  border-radius: 5px;

  @media (max-width: 768px) {
    min-height:50px;
  }
`;

export const PriceContainer = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #313c46;
  margin-right:20px;
`;

export const PriceInfoTextContainer = styled.span`
  font-size: 14px;
`;

export const IconBtn = styled(Icon)`
  color: #fafafa;
    
  &:hover {
    opacity: 0.5;
  }
`

const Footer = () => {

    const { setCameraByName, getPDF, sellerSettings, price } = useZakeke();
    const { setIsLoading } = useStore();
    const { showDialog, closeDialog } = useDialogManager();

    const showError = (error: string) => {
        showDialog('error', <ErrorDialog error={error} onCloseClick={() => closeDialog('error')} />);
    }

    const handleShareClick = async () => {
        setCameraByName("buy_screenshot_camera", false, false);
        showDialog("share", <ShareDialog />);
    }

    const handlePdfClick = async () => {
        try {
            setIsLoading(true);
            const url = await getPDF();
            showDialog("pdf", <PdfDialog url={url} onCloseClick={() => closeDialog('pdf')} />);

        } catch (ex) {
            console.log(ex);
            showError(T._("Failed PDF generation", "Composer"));
        } finally {
            setIsLoading(false);
        }
    }

    return <FooterContainer>
        {/* Price */}
        {(price !== null && price > 0 && (!sellerSettings || !sellerSettings.hidePrice)) && <PriceContainer>
            {price}

            {sellerSettings && sellerSettings.priceInfoText && <PriceInfoTextContainer>
                {sellerSettings.priceInfoText}
            </PriceInfoTextContainer>}
        </PriceContainer>}

        {/* PDF preview */}
        <IconBtn onClick={() => handlePdfClick()}>
            <Icon><PdfSolid /></Icon>
        </IconBtn>

        {/* Share */}
        <IconBtn onClick={() => handleShareClick()}>
            <Icon><ShareSolid /></Icon>
        </IconBtn>
    </FooterContainer>;
}

export default Footer;