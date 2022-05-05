import React, {FC, useEffect, useState} from "react";
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
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import ItemTextView from "../widgets/ItemTextView";
import Loader from "react-loader-spinner";
import Select  from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';



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


const CategoriesList = styled.ul`
    max-height:300px;
    padding: 0;
    margin: 0;
    overflow:auto;
`;

const CategoryItem = styled.li`
    height: 70px;
    min-width:200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #eee;
    cursor: pointer;
    margin-bottom: 10px;
    color: #313c46;
    &:hover{
        background-color: #313c46;
        color: white;
    }
`;

const ImagesList = styled.ul`
    list-style: none;
    display: inline-block;
    padding-top: 50px;
`

const ImageItemView = styled.li`
    display: inline-block;
    border: 1px #000 solid;
    padding: 5px;
    margin-right: 15px;
    cursor: pointer;
    border-radius: 50%;
    background-color: white;

    &:hover {
        border: 1px #f98a1c solid;
    }

    img {
        width: 30px;
        height: 30px;
        display: block;
        object-fit: contain;
        //background-color: #fff;
    }

    span {
        font-size: 12px;
    }
`;

const CenteredLoader = styled(Loader)`
    margin: auto;
    display: block;
    width: 48px;
    height: 48px;
`;

const BackTitle = styled.div`
    text-align: center;
    padding: 10px;
    font-size: 14px;
    cursor: pointer;

    @media(hover) {
        &:hover {
            opacity: 0.8;
        }
    }
`;

interface ImageMacroCategory {
    macroCategoryID: number | null;
    name: string;
    isSystemwide: boolean;
    hasImages: boolean;
    categories: ImageCategory[];
}

interface ImageCategory {
    categoryID: number | null;
    name: string;
    isSystemwide: boolean;
    hasImages: boolean;
}

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

    const handleTextItemPropChange: PropChangeHandler = (item, prop, value) => {

        let weightData: string[] = [];

        let newItem = { ...item } as EditTextItem;

        switch (prop) {
            case 'text':
                newItem.text = value as string;
                break;
            case 'font-italic':
                weightData = newItem.fontWeight.split(' ');
                let isBold = weightData.length > 1 ? weightData[1] === 'bold' : weightData[0] === 'bold';
                newItem.fontWeight = (value ? "italic" : "normal") + " " + (isBold ? "bold" : "normal");
                break;
            case 'font-bold':
                weightData = newItem.fontWeight.split(' ');
                let isItalic = weightData.length > 1 ? weightData[0] === 'italic' : false;
                newItem.fontWeight = (isItalic ? "italic" : "normal") + " " + (value ? "bold" : "normal");
                break;
            case 'font-color':
                newItem.fillColor = value as string;
                break;
            case 'font-family':
                newItem.fontFamily = value as string;
                break;
            case 'text-path':
                newItem.isTextOnPath = value as boolean;
                break;
        }

        setItem(newItem);
    }

    const [value, setValue] = React.useState(0);

    const { fonts, defaultColor } = useZakeke();

    const [item, setItem] = useState<EditTextItem>({
        guid: '',
        name: '',
        text: 'Text',
        fillColor: defaultColor,
        fontFamily: fonts[0].name,
        fontSize: 48,
        fontWeight: 'normal normal',
        isTextOnPath: false,
        constraints: null,
    })

    const { getMacroCategories, getImages } = useZakeke();
    const [isLoading, setIsloading] = useState(false);
    const [macroCategories, setMacroCategories] = useState<ImageMacroCategory[]>([]);
    const [selectedMacroCategory, setSelectedMacroCategory] = useState<ImageMacroCategory | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<ImageCategory | null>();
    const [images, setImages] = useState<Image[]>();

    useEffect(() => {
        updateCategories();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateCategories = async () => {
        try {
            setIsloading(true);
            let macroCategories = await getMacroCategories();
            setIsloading(false);
            setMacroCategories(macroCategories);

            if (macroCategories.length === 1)
                handleMacroCategoryClick(macroCategories[0]);
        } catch (ex) {
            console.error(ex);
        }
    }

    const handleMacroCategoryClick = async (macroCategory: ImageMacroCategory) => {
        setSelectedMacroCategory(macroCategory);

        if (macroCategory.categories.length === 1)
            handleCategoryClick(macroCategory.categories[0]);
    }

    const handleCategoryClick = async (category: ImageCategory) => {
        try {
            setIsloading(true);
            setSelectedCategory(category);

            const images: Image[] = await getImages(category.categoryID!);
            setIsloading(false);
            setImages(images);
        } catch (ex) {
            console.error(ex);
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

        {/*{itemsFiltered.map(item => {*/}
        {/*    if (item.type === 0)*/}
        {/*        return <ItemText key={item.guid} handleItemPropChange={handleItemPropChange} item={item as TextItem} />*/}
        {/*    else if (item.type === 1)*/}
        {/*        return <ItemImage key={item.guid} handleItemPropChange={handleItemPropChange} item={item as ImageItem} currentTemplateArea={currentTemplateArea!} />*/}
        
        {/*    return null;*/}
        {/*})}*/}

        {/*{(showAddTextButton || showUploadButton || showGalleryButton) && <UploadButtons>*/}
        {/*    {showAddTextButton && <Button*/}
        {/*        isFullWidth*/}
        {/*        onClick={handleAddTextClick}>*/}
        {/*        <Icon><Add /></Icon>*/}
        {/*        <span>{T._("ADD TEXT", "Composer")}</span>*/}
        {/*    </Button>}*/}
        
        {/*    {showGalleryButton && <Button*/}
        {/*        isFullWidth*/}
        {/*        onClick={handleAddImageFromGalleryClick} >*/}
        {/*        <Icon><Add /></Icon>*/}
        {/*        <span>{T._("ADD CLIPART", "Composer")}</span>*/}
        {/*    </Button>}*/}
        
        {/*    {showUploadButton && <>*/}
        {/*        <Button*/}
        {/*            isFullWidth*/}
        {/*            onClick={() => handleUploadImageClick(addItemImage, createImage)}>*/}
        {/*            <Icon><Add /></Icon>*/}
        {/*            <span>*/}
        {/*                <span>{itemsFiltered.some(item => item.type === 1) ?*/}
        {/*                    T._("UPLOAD ANOTHER IMAGE", "Composer") : T._("UPLOAD IMAGE", "Composer")} </span>*/}
        {/*            </span>*/}
        {/*        </Button>*/}
        {/*    </>}*/}
        {/*    <SupportedFormatsList>{T._("Supported file formats:", "Composer") + " " + supportedFileFormats}</SupportedFormatsList>*/}
        {/*</UploadButtons>}*/}

        <Tabs
          style={{ color: "white", marginBottom: 15 }}
          value={value}
          textColor="primary"
          indicatorColor="primary"
          onChange={(event, newValue) => {
              setValue(newValue);
          }}
          TabIndicatorProps={{style: {background:'white'}}}
        >
            <Tab style={{ color: "white" }} label="Text" />
            <Tab style={{ color: "white" }} label="Clipart" />
            <Tab style={{ color: "white" }} label="Image" />
        </Tabs>
        {value === 0 && <>
            <ItemText
              item={item}
              handleItemPropChange={handleTextItemPropChange}
              hideRemoveButton={true} />
            <Button
              style={{ marginBottom: 50, width: "100%", backgroundColor: "#f98a1c", color: "white", borderRadius: 20 }}
              onClick={() => addItemText(item, actualAreaId)}
            >
                Add your text
            </Button>
        </>}
        {value === 1 &&

           <>
               <div style={{position: "relative"}}>
                   <span style={{color: "white", top: 5, position: "absolute"}}>Chose your image:</span>
                   <span style={{right: 0, position: "absolute"}}>
                   <span style={{color: "white"}}>{selectedCategory?.name}</span>
                   <Select style={{color: "white", backgroundColor: "transparent", border: "none", outline: "none"}}>
                       {selectedMacroCategory?.categories.map(category => {
                           return <MenuItem style={{backgroundColor: "transparent"}} onClick={() => handleCategoryClick(category)}>{category.name}</MenuItem>
                       })}
                   </Select>
               </span>
               </div>




        {/*{!selectedMacroCategory && <CategoriesList>{macroCategories.map(macroCategory => {*/}
        {/*    return <CategoryItem*/}
        {/*    key={macroCategory.macroCategoryID!.toString()}*/}
        {/*    onClick={() => handleMacroCategoryClick(macroCategory)}>*/}
        {/*{macroCategory.name}</CategoryItem>*/}
        {/*})}*/}
        {/*    </CategoriesList>}*/}

        {/*{selectedMacroCategory && !selectedCategory && <>*/}
        {/*    <BackTitle onClick={() => setSelectedMacroCategory(null)}>{T._("Return to macro categories", "Composer")}</BackTitle>*/}

        {/*    <CategoriesList>*/}
        {/*{selectedMacroCategory.categories.map(category => {*/}
        {/*    return <CategoryItem key={category.categoryID!.toString()} onClick={() => handleCategoryClick(category)}>{category.name}</CategoryItem>*/}
        {/*})}*/}
        {/*    </CategoriesList>*/}
        {/*    </>}*/}

        {selectedMacroCategory && selectedCategory && images && <>
            {/*<BackTitle onClick={() => setSelectedCategory(null)}>{T._("Return to categories", "Composer")}</BackTitle>*/}

            <ImagesList>
        {images.map(image => {
            return <ImageItemView key={image.imageID!.toString()}
                  onClick={() => addItemImage(image.imageID, actualAreaId)}>
            <img src={image.choiceUrl} alt={image.name} />
            </ImageItemView>
        })}
            </ImagesList>

            </>}
            </>

        }
        {value === 2 && <Button
          style={{ marginBottom: 50, width: "100%", backgroundColor: "#f98a1c", color: "white", borderRadius: 20 }}
          isFullWidth
          onClick={() => handleUploadImageClick(addItemImage, createImage)}>
            <span>
                <span>{itemsFiltered.some(item => item.type === 1) ?
                  T._("UPLOAD ANOTHER IMAGE", "Composer") : T._("UPLOAD IMAGE", "Composer")} </span>
            </span>
        </Button>}
        {itemsFiltered.map(item => {
            if (value === 0 && item.type === 0)
                return <ItemTextView key={item.guid} handleItemPropChange={handleItemPropChange} item={item as TextItem} />
            else if (value === 1 && item.type === 1)
                return <ItemImage key={item.guid} handleItemPropChange={handleItemPropChange} item={item as ImageItem} currentTemplateArea={currentTemplateArea!} />
            else return
        })}
    </DesignerContainer>
}

export default Designer;