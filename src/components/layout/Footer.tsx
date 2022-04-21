import { T } from "Helpers";
import useStore from "Store";
import styled from "styled-components";
import { useZakeke } from "zakeke-configurator-react";
import { useDialogManager } from "../dialogs/Dialogs";
import ErrorDialog from "../dialogs/ErrorDialog";
import PdfDialog from "../dialogs/PdfDialog";
import ShareDialog from "../dialogs/ShareDialog";
import { Button, Icon } from "components/Atomic";

import { ReactComponent as PdfSolid } from '../../assets/icons/file-pdf-solid.svg';
import { ReactComponent as ShareSolid } from '../../assets/icons/share-alt-square-solid.svg';

export const FooterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 70px;
  min-height: 70px;
  background-color: #fff;
  flex-direction: row;
  grid-gap: 10px;
  align-items: center;
  padding: 0px 15px;
  font-size: 14px;
  margin-top:10px;

  @media (max-width: 768px) {
    min-height:70px;
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

const Footer = () => {

    const { setCameraByName, getPDF, addToCart, isAddToCartLoading, sellerSettings, price } = useZakeke();
    const { setIsLoading } = useStore();
    const { showDialog, closeDialog } = useDialogManager();

    const handleAddToCart = () => {
        addToCart([]);
    }

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
        <Button onClick={() => handlePdfClick()}>
            <Icon><PdfSolid /></Icon>
        </Button>

        {/* Share */}
        <Button onClick={() => handleShareClick()}>
            <Icon><ShareSolid /></Icon>
        </Button>

        {/* Add to cart */}
        <Button
            primary
            onClick={() => handleAddToCart()}>
            {isAddToCartLoading && <span></span>}
            {!isAddToCartLoading && <span>{T._("ADD TO CART", "Composer")}</span>}
        </Button>
    </FooterContainer>;
}

export default Footer;