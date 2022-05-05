import { FC, useCallback } from "react";
import styled from "styled-components";
import { FontFamily, useZakeke } from "zakeke-configurator-react";
import { Button, Columns, Icon, TextArea } from '../Atomic';
import { T } from '../../Helpers';
import Select, { components, GroupBase, OptionProps, SingleValueProps } from 'react-select';
import { ColorPicker } from "./ColorPicker";
import { useState } from "react";
import { debounce } from 'lodash';

import type { PropChangeHandler } from "../layout/Designer";

import { ReactComponent as CloseIcon } from '../../assets/icons/times-solid.svg'
import { ReactComponent as BoldIcon } from '../../assets/icons/bold-solid.svg'
import { ReactComponent as ItalicSolid } from '../../assets/icons/italic-solid.svg'
import { ReactComponent as CurveIcon } from '../../assets/icons/bezier-curve-solid.svg'
import { FormControl } from "./FormControl";
import {TextField} from "@material-ui/core";

export interface EditTextItem {
    guid: string,
    name: string,
    text: string,
    fillColor: string,
    fontFamily: string,
    fontWeight: string,
    fontSize: number,
    isTextOnPath: boolean;
    constraints: { [key: string]: any } | null,
}

const defaultColorsPalette = ['#000000', '#FFFFFF'];

enum ItemType {
    Text = 0,
    Image = 1
}

export interface TextItem {
    type: ItemType;
    areaId: number;
    guid: string;
    name: string;
    text: string;
    strokeColor: string;
    strokeWidth: number;
    fillColor: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    fontStyle: string | undefined;
    fontStretch: string;
    justification: string;
    isTextOnPath: boolean;
    constraints: ({
        [key: string]: any;
    }) | null;
}

const ItemTextContainer = styled.div`
`;

const TextToolsContainer = styled.div`
  display:flex;
  flex-direction:row;
  grid-gap:10px;  
`;

const TextButtonsContainer = styled.div`
    width:50%;
    display: grid;
    grid-template-columns:1fr 1fr;
    grid-gap:5px;
`;

const ColorPickerContainer = styled.div`
  margin-right:5px;
`;

const ColorsContainer = styled.div`
  display:flex;
  flex-direction:row;
  padding-bottom: 20px;
  border-bottom: 1px #ccc dotted;  
`;

const SinglePaletteItem = styled.div<{ color: string, selected: boolean }>`
    width: 20px;
    height: 20px;
    background-color: ${props => props.color};
    border: 1px lightgray solid;
    cursor:pointer;
    padding: 5px;
    border-radius: 50%;
    
    ${props => props.selected && `border: 2px #dc9e5d solid;`}

    &:hover {
        opacity: 0.6;
        border: 2px #dc9e5d solid;
    }
`;

const TextColorsContainer = styled.div`
    display: grid;
    grid-template-rows: 30px 30px;
    grid-auto-flow: column;
    grid-auto-columns: 30px;
`;

const OptionContainer = styled(components.Option)`
    background-color: white !important;
    
    &:hover {
        background-color: #DDD !important;
    }

    img {
        max-width: 100%;
        height: 24px;
        object-fit: contain;
    }
`;

const SingleValueContainer = styled(components.SingleValue)`
    img {
        //background-color: #42545E;
        padding: 5px;
        max-width: 100%;
        height: 24px;
        object-fit: contain;
    }
`;

const FontOption = (props: JSX.IntrinsicAttributes & OptionProps<any, boolean, GroupBase<any>>) => {
    return (
        <OptionContainer {...props}>
            {<img src={props.data.imageUrl} alt={props.data.name} />}
        </OptionContainer>
    );
}

const FontSingleValue = (props: JSX.IntrinsicAttributes & SingleValueProps<any, boolean, GroupBase<any>>) => {
    return (
        <SingleValueContainer {...props}>
            {<img src={props.data.imageUrl} alt={props.data.name} />}
        </SingleValueContainer>
    );
}

const ItemText: FC<{ item: EditTextItem, handleItemPropChange: PropChangeHandler, fonts?: FontFamily[], hideRemoveButton?: boolean }> = ({ item, handleItemPropChange, hideRemoveButton }) => {
    const { removeItem, fonts, disableTextColors, textColors } = useZakeke();

    const constraints = item.constraints;
    const canEdit = constraints?.canEdit ?? true;
    const hasCurvedText = item.isTextOnPath;

    // Used for performance cache
    const [fillColor, setFillColor] = useState(item.fillColor);

    const weightData = typeof item.fontWeight === 'number' ? ['normal', 'normal'] : item.fontWeight.split(' ');
    const isBold = weightData.length > 1 ? weightData[1] === 'bold' : weightData[0] === 'bold';
    const isItalic = weightData.length > 1 ? weightData[0] === 'italic' : false;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (handleItemPropChange)
            handleItemPropChange((item as TextItem), 'text', e.currentTarget.value);
    }

    //eslint-disable-next-line
    const handleFillColorChange = useCallback(debounce((color: string) => {
        handleItemPropChange(item, 'font-color', color);     
    }, 500), []);

    if (item)
        return <ItemTextContainer>
            <FormControl
                label={item.name || T._("", "Composer")}
                rightComponent={!hideRemoveButton && <Icon onClick={() => removeItem(item.guid)}><CloseIcon /></Icon>}>

                <TextArea
                    style={{
                        borderTop: "none",
                        borderLeft: "none",
                        borderRight: "none",
                    }}
                    defaultValue={item.text}
                    onChange={handleChange}
                    placeholder={"Write your text here (max 20 characters)"}
                    maxLength={!item.constraints ? null : (item.constraints.maxNrChars || null)}
                    disabled={!canEdit} />
            </FormControl>

            <TextToolsContainer>
                {(!constraints || constraints.canChangeFontFamily) && <FormControl label={T._("", "Composer")}>
                    <Select
                        styles={{
                            container: base => ({
                                ...base,
                                minWidth: 200,
                            }),
                        }}
                        isSearchable={false}
                        options={fonts}
                        menuPosition="fixed"
                        components={{
                            Option: FontOption,
                            SingleValue: FontSingleValue
                        }}
                        value={[fonts!.find(x => x.name === item.fontFamily)]}
                        onChange={(font: any) => handleItemPropChange(item, 'font-family', font.name)}
                    />
                </FormControl>}
                <TextButtonsContainer>
                    {(!constraints || constraints.canChangeFontWeight) && <FormControl label={T._("", "Composer")}>
                        <Columns columns={2}>
                            <Button
                                style={{
                                    borderRadius: 20,
                                    backgroundColor: "transparent",
                                    color: "white",
                                    marginLeft: "40px",
                                    marginRight: "40px",
                                }}
                                outline
                                selected={isBold}
                                onClick={() => handleItemPropChange(item, 'font-bold', !isBold)}>
                                <Icon><BoldIcon /></Icon>
                            </Button>
                            <Button
                                style={{
                                    borderRadius: 20,
                                    backgroundColor: "transparent",
                                    color: "white"
                                }}
                                outline
                                selected={isItalic}
                                onClick={() => handleItemPropChange(item, 'font-italic', !isItalic)}>
                                <Icon><ItalicSolid /></Icon>
                            </Button>
                        </Columns>
                    </FormControl>}
                    {/*{(!constraints || constraints.canChangeTextPathMode) && <FormControl label={T._("Curved", "Composer")}>*/}
                    {/*    <Button*/}
                    {/*        outline*/}
                    {/*        selected={hasCurvedText}*/}
                    {/*        onClick={() => handleItemPropChange(item, 'text-path', !hasCurvedText)}>*/}
                    {/*        <Icon><CurveIcon /></Icon>*/}
                    {/*    </Button>*/}
                    {/*</FormControl>}*/}
                </TextButtonsContainer>
            </TextToolsContainer>

            <FormControl label={T._("Color", "Composer")}>
                <ColorsContainer>

                    {!disableTextColors && <ColorPickerContainer>
                        <ColorPicker
                            color={fillColor}
                            onChange={color => {
                                setFillColor(color.hex);
                                handleFillColorChange(color.hex);
                            }} />
                    </ColorPickerContainer>}

                    {!disableTextColors && <TextColorsContainer>
                        {(defaultColorsPalette).map(hex => <SinglePaletteItem
                            key={hex}
                            onClick={() => handleItemPropChange(item, 'font-color', hex)}
                            selected={hex === fillColor}
                            color={hex}
                        />)}
                    </TextColorsContainer>}

                    {disableTextColors && <TextColorsContainer>
                        {(textColors).map(textColor => <SinglePaletteItem
                            key={textColor.colorCode}
                            onClick={() => handleItemPropChange(item, 'font-color', textColor.colorCode)}
                            selected={textColor.colorCode === fillColor}
                            color={textColor.colorCode}
                        />)}
                    </TextColorsContainer>}
                </ColorsContainer>
            </FormControl>
        </ItemTextContainer >
    else
        return null;
}

export default ItemText;