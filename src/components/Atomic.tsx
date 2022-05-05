import styled from 'styled-components';
import Carousel from 'nuka-carousel';

export const CarouselContainer = styled(Carousel)`
  border: 2px solid #f5f6f7;
`;

export const Icon = styled.div<{ hoverable?: boolean }>`
  display: inline-block;
  width: 24px;
  height: 24px;
  cursor: pointer;

  ${props => props.hoverable && `
    @media(hover) {
      &:hover {
        opacity: 0.5
      }
    }
  `}
  svg {
    fill: currentColor;
    width: 100%;
    height: 100%;
  }
`

export const TextArea = styled.textarea`
  background-color: transparent;
  padding: 5px;
  color: #f4f4f4;
  font-size: 14px;
  border: 1px #f4f4f4 solid;
  width: 100%;
  min-height: 20px;
  font-family: "Montserrat", sans-serif;
  outline: none;
  resize: none;

  &:hover {
    border: 1px #dc9e5d solid;
  }

  &:focus {
    border: 1px #dc9e5d solid;
    outline: none;
  }
`;

export const Row = styled.div`
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ItemLabel = styled.label`
  font-size: 14px;
  display: block;
  margin-bottom: 5px;

  span {
    float: right;
    color: black;
    cursor: pointer;

    &:hover {
      opacity: 0.6;
    }
  }
`;

export const Button = styled.button<{ primary?: boolean, outline?: boolean, selected?: boolean, disabled?: boolean, isFullWidth?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${props => props.isFullWidth ? '100%' : (props.outline ? '60px' : (props.primary ? '200px' : '60px'))};
  background-color: ${props => props.primary ? '#313c46' : 'white'};
  color: ${props => props.outline ? 'black' : (props.primary ? 'white' : '#313c46')};
  min-height: 38px;
  padding: ${props => props.outline ? '' : '5px 10px 5px 10px'};
  text-align: center;
  border: ${props => props.outline ? '1px solid lightgray' : '1px solid #313c46'};
  cursor: pointer;

  ${props => props.selected && `
    border: 1px solid black;
  `}
  ${props => props.disabled && `
    border: 1px solid black;
    background-color: lightgray;
  `}
  &:hover {
    background-color: ${props => props.outline ? 'white' : (props.primary ? '#4b6074' : '#313c46')};
    border: ${props => props.outline ? '1px solid black' : '1px solid #4b6074'};
    color: ${props => props.outline ? 'black' : 'white'};
  }

  ${Icon} + span {
    margin-left: 10px;
  }

  span {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
  }
`;

export const Columns = styled.div<{ columns: number }>`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
`;

export const Rows = styled.div<{ rows: number }>`
  width: 100%;
  display: grid;
  grid-template-rows: repeat(${props => props.rows}, 1fr);
`;