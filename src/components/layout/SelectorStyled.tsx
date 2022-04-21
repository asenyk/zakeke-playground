import { Icon } from "components/Atomic";
import styled from "styled-components";

export const SelectorContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content:flex-end;
  min-height:0;

  @media (max-width: 768px) {
    width: 100%;
    height: 50%;
    flex-direction:column;
    position: relative;
  }
`;

export const GroupsContainer = styled.div`
  display:flex;
  flex-direction: column;
  min-width: 130px;
  width:130px;
  overflow:auto;
  min-height:0;

  @media (max-width: 1025px) {   
    min-width: 100px;
    width: 100px;
  }

  @media (max-width: 768px) {
    width: 100%;
    height:90px;
    flex-direction:row;
  }
`;

export const GroupItem = styled.div`
  display:flex;
  flex-flow:column;
  justify-content:center;
  align-items: center;
  height:100px;
  width:100px;
  margin-bottom: 20px;
  text-align:center;
  cursor: pointer;
  padding:20px !important;
  
  &:hover{
    background-color: white;
  }

  &.selected{
    background-color: white;
  }

  span{
    font-size:12px;
  }

  @media (max-width: 1025px) {   
    min-width:90px;
    padding-right: 5px;
  }

  @media (max-width: 768px) {
    min-width:110px;
    margin-bottom: 0;
    margin-right: 10px;
  }
  @media (max-width: 42px) {
    min-width:100px;
  }
`;

export const GroupIcon = styled.img`
  min-height:40px;
  min-width:40px;
  object-fit: scale-down;
  margin-bottom: 10px;
`;

export const GroupStar = styled(Icon)`
  min-width: 40px;
  min-height: 40px;
`;

export const AttributesContainer = styled.div`
  background-color: white;
  flex:1;
  padding: 40px;
  min-height:0;
  overflow:auto;

  @media (max-width: 768px) {
    padding: 5px;
  }
`;

export const AttributeItem = styled.div`
  display:flex;
  flex-direction: column;
  justify-content: space-around;
  align-items:left;
  min-height:60px;
  border-bottom:5px solid transparent;
  cursor:pointer;

  &.selected{
    border-bottom: 5px solid #f5f6f7;;
  }
  &:hover{
    border-bottom: 5px solid #f5f6f7;;
  }
`;

export const AttributeName = styled.span`
  font-size:14px;
  font-weight: 600;
`;

export const OptionSelectedName = styled.span`
  font-size:14px;

  @media (max-width: 1400px) {
    font-size:12px;
    display: block;
    position: static;
  }
`;

export const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
  list-style: none;
  overflow: hidden;
  user-select: none;
  align-items:baseline;
  padding: 30px 0px;
  margin-bottom:50px;

  @media (max-width: 1400px){
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

export const TemplatesContainer = styled.div`
    display:flex;
    flex-direction:row;
    grid-gap:5px;
    align-items:flex-start;
    margin-bottom: 40px;
    overflow: hidden;
    min-height: 0;
    
`;

export const Template = styled.div<{ selected?: boolean }>`
  padding:10px;
  cursor:pointer;

    &:hover{
        background-color: #f4f4f4;
        }
    
    ${props => props.selected && `
       background-color: #f4f4f4;
    `}
`;