import {FC} from "react";
import styled from "styled-components";
import {Option, useZakeke} from "zakeke-configurator-react";
import noImage from '../../assets/images/no_image.png';

const OptionContainer = styled.div<{ optionShape: number, selected: boolean }>`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  align-self: center;
  justify-self: center;
  position: relative;
  padding: 10px 0px;
  user-select: none;
  width: 100%;

  &:hover img {
    border: 1px solid #dc9e5d;
  }

  ${props => props.selected && `
        img {
            border: 1px solid #dc9e5d;
        }
    `}
`;

const OptionIconContainerStyled = styled.div<{ optionShape?: number }>`
  overflow: hidden;
  width: 100%;
  max-width: 100px;
  max-height: 100px;
  //height: 140px;
  padding: 10px;
`;

const OptionIconContainer: FC<{}> = ({children}) => {
  return <OptionIconContainerStyled>{children}</OptionIconContainerStyled>;
}

const OptionIcon = styled.img<{ optionShape?: number }>`
  object-fit: contain;
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

const OptionName = styled.span`
  font-size: 12px;
  margin-top: 10px;
  color: white;

  @media (max-width: 1025px) {
    font-size: 10px;
    margin-top: 2px;
    text-align: center;
  }

  @media (max-width: 768px) {
    font-size: 10px;
    text-align: center;
  }
`;

const OptionItem: FC<{ option: Option }> = ({option}) => {
  const {selectOption, setCamera} = useZakeke();

  const handleOptionSelection = (option: Option) => {
    setCamera(option.attribute.cameraLocationId!);
    selectOption(option.id);
  }

  let contentRadio =
    <OptionContainer

      selected={option.selected}
      optionShape={option.attribute.optionShapeType}
      onClick={() => handleOptionSelection(option)}>

        <OptionIconContainer>
          <input id={option.name} type="radio" checked={option.selected} />
          <label htmlFor={option.name}>{option.name}</label>
          {/*{!option.attribute.hideOptionsLabel && <OptionName>{option.name}</OptionName>}*/}
        </OptionIconContainer>

    </OptionContainer>;

  let content =
    <OptionContainer

      selected={option.selected}
      optionShape={option.attribute.optionShapeType}
      onClick={() => handleOptionSelection(option)}>

        <OptionIconContainer>
          {option.imageUrl !== ""
            ? <OptionIcon src={option.imageUrl!} optionShape={option.attribute.optionShapeType}/>
            : <OptionIcon src={noImage} optionShape={option.attribute.optionShapeType}/>
          }
        </OptionIconContainer>

        {!option.attribute.hideOptionsLabel && <OptionName>{option.name}</OptionName>}

    </OptionContainer>;

  return option.name === "Yes" || option.name === "No" ? contentRadio : content;
}

export default OptionItem;