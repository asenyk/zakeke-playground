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
    border-bottom: 1px solid white;
    padding: 20px 0;
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
    display: inline-block;
    background-color: ${props => props.color};
    border: 1px lightgray solid;
    cursor:pointer;
    padding: 5px;
    border-radius: 50%;
    position: relative;
    
    ${props => props.selected && `border: 2px #dc9e5d solid;`}
    
    &:hover {
        opacity: 0.6;
        border: 2px #dc9e5d solid;
    }
`;

const TextColorsContainer = styled.span`
    display: inline;
    padding-left: 10px;
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

const ItemTextView: FC<{ item: EditTextItem, handleItemPropChange: PropChangeHandler, fonts?: FontFamily[], hideRemoveButton?: boolean }> = ({ item, handleItemPropChange, hideRemoveButton }) => {
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
            <div style={{color: "white"}}>{item.text}</div>
            <div style={{position: "relative"}}>
                <span style={{color: "white", paddingRight: 25, paddingBottom: 20}}>
                    Font: {item.fontFamily}
                </span>
                {(isBold || isItalic) && <span style={{color: "white", paddingRight: 25}}>
                    Style: {isBold ? "Bold" : ""} {isItalic ? "Italic" : ""}
                </span>}
                <span style={{color: "white", paddingRight: 25}}>
                    Color:
                    {disableTextColors && <TextColorsContainer>
                        {(textColors).map(textColor => {
                            if (textColor.colorCode === fillColor)
                                return <>
                                    <SinglePaletteItem
                                      key={textColor.colorCode}
                                      onClick={() => handleItemPropChange(item, 'font-color', textColor.colorCode)}
                                      selected={textColor.colorCode === fillColor}
                                      color={textColor.colorCode}
                                    />
                                </>
                            else return
                        })}
                    </TextColorsContainer>}
                </span>
                <Button style=
                    {{
                        display: "inline-block",
                        backgroundColor: "transparent",
                        color: "white",
                        border: "1px solid white",
                        borderRadius: 20,
                        width: 100,
                        right: 0,
                        top: -10,
                        height: 10,
                        position: "absolute"
                    }}
                    onClick={() => removeItem(item.guid)}
                >Remove</Button>
            </div>

        </ItemTextContainer >
    else
        return null;
}

export default ItemTextView;