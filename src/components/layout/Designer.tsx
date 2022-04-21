import React, { FC, useState } from "react";
import styled from "styled-components";
import { ImageItem, TextItem, useZakeke } from "zakeke-configurator-react";
import { Button, CarouselContainer, Icon } from '../Atomic';
import { T } from '../../Helpers';
import ItemText, { EditTextItem } from "../widgets/ItemText";
import ItemImage, { EditImageItem } from "../widgets/ItemImage";
import AddTextDialog from "../dialogs/AddTextDialog";
import ErrorDialog from "../dialogs/ErrorDialog";
import ImagesGalleryDialog from "../dialogs/ImagesGalleryDialog";
import { ReactComponent as Add } from '../../assets/icons/plus-circle-solid.svg';
import { useDialogManager } from "../dialogs/Dialogs";
import useStore from "Store";

export type PropChangeHandler = (item: EditTextItem | EditImageItem, prop: string, value: string | boolean | File) => void;

const DesignerContainer = styled.div`
    display:flex;
    flex-flow:column;
    user-select: none;
    width:100%;
`;

const UploadButtons = styled.div`
  display:flex;
  flex-direction: column;
  grid-gap: 5px;  
  margin:20px 0px;
`;

const Area = styled.div<{ selected?: boolean }>`
  display:flex;
  flex-direction: column;
  justify-content: space-around;
  align-items:left;
  min-height:40px;
  border-bottom:5px solid transparent;
  cursor:pointer;
  
  &:hover{
    border-bottom: 5px solid #f5f6f7;
  }
  
  ${props => props.selected && `
       border-bottom: 5px solid #f5f6f7;
    `}
`;

const Center = styled.div`
    text-align:center;
    font-size:18px;
    padding:30px;
`;

const SupportedFormatsList = styled.span`
    font-size: 16px;
    font-style: italic;
    text-align: center;
    color: #313c46;
    padding-top:5px;
 
`;

interface Image {
    imageID: number;
    name: string;
    choiceUrl: string;
    preferredWidth: number | null;
    preferredHeight: number | null;
}

const Designer: FC<{}> = () => {

    const { showDialog, closeDialog } = useDialogManager();
    const [forceUpdate, setForceUpdate] = useState(false);
    const { setIsLoading } = useStore();

    const { currentTemplate, items, isAreaVisible, product,
        removeItem, setItemImageFromFile, setItemImage, setItemText, setItemItalic, setItemBold, setItemColor,
        setItemFontFamily, setItemTextOnPath, addItemText, addItemImage, createImage, getTemplateUploadRestrictictions } = useZakeke();

    const [selectedCarouselSlide, setSelectedCarouselSlide] = useState<number>(0);

    const filteredAreas = product?.areas.filter(area => isAreaVisible(area.id)) ?? [];
    const [actualAreaId, setActualAreaId] = useState<number>(filteredAreas && filteredAreas.length > 0 ? filteredAreas[0].id : 0);

    const itemsFiltered = items.filter(item => item.areaId === actualAreaId);
    const currentTemplateArea = currentTemplate!.areas.find(x => x.id === actualAreaId);

    const showAddTextButton = !currentTemplateArea || currentTemplateArea.canAddText;
    const showUploadButton = !currentTemplateArea || (currentTemplateArea.canAddImage && currentTemplateArea.uploadRestrictions.isUserImageAllowed);
    const showGalleryButton = !currentTemplateArea || (currentTemplateArea.canAddImage && !currentTemplateArea.disableSellerImages);

    const supportedFileFormats = getSupportedUploadFileFormats(currentTemplate!.id, actualAreaId).join(', ');

    function getSupportedUploadFileFormats(templateId: number, areaId: number) {
        const restrictions = getTemplateUploadRestrictictions(templateId, areaId);
        const fileFormats: string[] = [];

        if (restrictions.isJpgAllowed)
            fileFormats.push(".jpg", ".jpeg");

        if (restrictions.isPngAllowed)
            fileFormats.push(".png");

        if (restrictions.isSvgAllowed)
            fileFormats.push(".svg");

        if (restrictions.isEpsAllowed)
            fileFormats.push(".eps");

        if (restrictions.isPdfAllowed)
            fileFormats.push(".pdf");

        return fileFormats;
    }

    const handleAddTextClick = () => {
        showDialog('add-text', <AddTextDialog
            onClose={() => closeDialog('add-text')}
            onConfirm={item => {
                addItemText(item, actualAreaId);
                closeDialog("add-text");
            }} />);
    }

    const handleAddImageFromGalleryClick = async () => {
        showDialog('add-image', <ImagesGalleryDialog
            onClose={() => closeDialog("add-image")}
            onImageSelected={(image: { imageID: number; }) => {
                addItemImage(image.imageID, actualAreaId);
                closeDialog("add-image");
            }} />)
    }

    const handleUploadImageClick = async (addItemImage: (guid: any, imageId: number) => Promise<void>, createImage: (file: File, progress?: (percentage: number) => void) => Promise<Image>) => {
        if (currentTemplate && actualAreaId) {
            const fileFormats = getSupportedUploadFileFormats(currentTemplate.id, actualAreaId);
            let input = document.createElement("input");
            input.setAttribute("accept", fileFormats.join(","));
            input.setAttribute("type", "file");
            input.addEventListener("change", async (e) => {
                const files = (e.currentTarget as HTMLInputElement).files;
                if (files && files.length > 0 && actualAreaId) {
                    setIsLoading(true);
                    try {
                        const image = await createImage(files[0], (progress: number) => console.log(progress));
                        addItemImage(image.imageID, actualAreaId);
                        input.remove();
                    } catch (ex) {
                        console.error(ex);
                        showDialog('error', <ErrorDialog error={T._("Failed uploading image.", "Composer")} onCloseClick={() => closeDialog('error')} />);
                    } finally {
                        setIsLoading(false);
                    }
                }
            });
            document.body.appendChild(input);
            input.click();
        }
    }

    const handleItemRemoved = (guid: string) => {
        removeItem(guid);
    }

    const handleItemImageChange = async (item: EditImageItem, file: File) => {
        try {
            setIsLoading(true);
            await setItemImageFromFile(item.guid, file);
        } catch (ex) {
            console.error(ex);
        } finally {
            setIsLoading(false);
        }
    }

    const handleItemImageGallery = async (item: EditImageItem) => {

        showDialog('add-image', <ImagesGalleryDialog
            onClose={() => closeDialog('add-image')}
            onImageSelected={async (image) => {
                closeDialog('add-image');
                try {
                    setIsLoading(true);
                    await setItemImage(item.guid, image.imageID);

                } catch (ex) {
                    console.error(ex);
                } finally {
                    setIsLoading(false);
                }
            }} />);
    }

    const handleItemPropChange = (item: EditTextItem | EditImageItem, prop: string, value: string | boolean | File) => {

        switch (prop) {
            case 'remove':
                handleItemRemoved(item.guid);
                break;
            case 'image-upload':
                handleItemImageChange(item as EditImageItem, value as File);
                break;
            case 'image-gallery':
                handleItemImageGallery(item as EditImageItem);
                break;
            case 'text':
                setItemText(item.guid, value as string);
                break;
            case 'font-italic':
                setItemItalic(item.guid, value as boolean);
                break;
            case 'font-bold':
                setItemBold(item.guid, value as boolean);
                break;
            case 'font-color':
                setItemColor(item.guid, value as string);
                break;
            case 'font-family':
                setItemFontFamily(item.guid, value as string);
                break;
            case 'text-path':
                setItemTextOnPath(item.guid, actualAreaId, value as boolean);
                setTimeout(() => setForceUpdate(!forceUpdate), 100);
                break;
        }
    }

    return <DesignerContainer>

        {/* Areas */}
        {filteredAreas.length > 1 && <CarouselContainer slidesToScroll={1} speed={50}
            slidesToShow={window.innerWidth <= 1600 ? 3 : 4}
            slideIndex={selectedCarouselSlide}
            afterSlide={setSelectedCarouselSlide}
            renderBottomCenterControls={() => <span />}
            renderCenterRightControls={() => <span />}
            renderCenterLeftControls={() => <span />}>

            {filteredAreas.map(area => <Area
                key={area.id}
                selected={actualAreaId === area.id}
                onClick={() => setActualAreaId(area.id)}>
                {area.name}
            </Area>)}
        </CarouselContainer>}

        {(itemsFiltered.length === 0 && !(showAddTextButton || showUploadButton || showGalleryButton)) && <Center>{T._("No customizable items", "Composer")}</Center>}

        {itemsFiltered.map(item => {
            if (item.type === 0)
                return <ItemText key={item.guid} handleItemPropChange={handleItemPropChange} item={item as TextItem} />
            else if (item.type === 1)
                return <ItemImage key={item.guid} handleItemPropChange={handleItemPropChange} item={item as ImageItem} currentTemplateArea={currentTemplateArea!} />

            return null;
        })}

        {(showAddTextButton || showUploadButton || showGalleryButton) && <UploadButtons>
            {showAddTextButton && <Button
                isFullWidth
                onClick={handleAddTextClick}>
                <Icon><Add /></Icon>
                <span>{T._("ADD TEXT", "Composer")}</span>
            </Button>}

            {showGalleryButton && <Button
                isFullWidth
                onClick={handleAddImageFromGalleryClick} >
                <Icon><Add /></Icon>
                <span>{T._("ADD CLIPART", "Composer")}</span>
            </Button>}

            {showUploadButton && <>
                <Button
                    isFullWidth
                    onClick={() => handleUploadImageClick(addItemImage, createImage)}>
                    <Icon><Add /></Icon>
                    <span>
                        <span>{itemsFiltered.some(item => item.type === 1) ?
                            T._("UPLOAD ANOTHER IMAGE", "Composer") : T._("UPLOAD IMAGE", "Composer")} </span>
                    </span>
                </Button>
            </>}
            <SupportedFormatsList>{T._("Supported file formats:", "Composer") + " " + supportedFileFormats}</SupportedFormatsList>
        </UploadButtons>}
    </DesignerContainer>
}

export default Designer;