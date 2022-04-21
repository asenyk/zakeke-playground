import React from 'react';
import { CustomPicker } from 'react-color';
import { Saturation, Hue, Alpha, EditableInput } from 'react-color/lib/components/common'
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Button } from '../Atomic';

export function hex2rgb(c: string) {
    c = c.substring(1);      // strip #
    const rgb = parseInt(c, 16);   // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff;  // extract red
    const g = (rgb >> 8) & 0xff;  // extract green
    const b = (rgb >> 0) & 0xff;  // extract blue

    return { r, g, b };
}

type originalType = React.ComponentProps<typeof EditableInput>;
type expandedType = { hideLabel: boolean };

const EditableInputExpanded = EditableInput as unknown as React.FC<originalType & expandedType>;

const ColorPickerBox = styled.div<{ color: string }>`
    height: 40px;
    width: 100px;
    border: 1px #DDD solid;
    background-color: ${props => props.color};
    cursor: pointer;

    @media(hover) {
        &:hover {
            opacity: 0.7;
        }
    }
`;

const ZakekeColorPickerContainer = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    z-index: 13;
    background-color: white;
    border: 1px #DDD solid;
    width: 250px;
    padding: 10px;

    .saturation-row {
        height: 150px;
        position: relative;
    }

    .hue-row, .alpha-row {
        margin-top: 10px;
        position: relative;
        height: 10px;
    }

    .fields-row {
        display: flex;
        margin-top: 10px;

        > div {
            flex: 1;
            display: flex;
            align-items: center;

            &:not(:last-child) {
                margin-right: 5px;
            }

            &:first-child {
                flex: 2;
            }

            > label {
                font-size: 12px;
                margin-right: 3px;
            }

            input {
                width: 100%;
                border: none;
                border-bottom: 1px #555555 solid;
                background: transparent;
                padding: 5px;
                font-size: 10px;
                font-family: Roboto, sans-serif;
                width: 100%;
                resize: none;
            }
        }
    }

    .button-row {
        margin-top: 10px;
    }
`;

export interface ColorPickerProps {
    defaultColor?: string;
    color?: string;
    onChange: (color: any) => void;
}

export class ColorPicker extends React.Component<ColorPickerProps, any> {
    private pickerPortal!: HTMLDivElement;
    private box!: HTMLDivElement;

    constructor(props: ColorPickerProps) {
        super(props);
        this.state = {
            color: props.defaultColor,
            isOpened: false,
            colorPickerPosition: [0, 0]
        };

        this.pickerPortal = document.getElementById("color-picker-portal") as HTMLDivElement;
    }


    onChange = (color: any) => {
        this.setState({ color: color.hex });

        if (this.props.onChange)
            this.props.onChange(color);
    }

    render() {
        const color = this.props.color || this.state.color;
        let picker: JSX.Element | null = null;
        //const rgb = hex2rgb(color);
        //let luma = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;

        if (this.state.isOpened) {

            let top = this.box.getBoundingClientRect().top + this.box.getBoundingClientRect().height;
            if (top + 280 > window.innerHeight)
                top -= 280 + this.box.getBoundingClientRect().height;

            let left = this.box.getBoundingClientRect().left;
            if (left + 250 > window.innerWidth - 20)
                left -= 250 - this.box.getBoundingClientRect().width;

            let style = {
                left: left,
                top: top
            };

            picker = <ZakekeColorPicker color={color} onChange={this.onChange} onClose={() => this.setState({ isOpened: false })} style={style} />;
        }

        return <>
            <ColorPickerBox
                ref={div => this.box = div!}
                color={color}
                onClick={(e) => this.setState({ isOpened: !this.state.isOpened, colorPickerPosition: [e.clientX, e.clientY] })}>
            </ColorPickerBox>

            {this.state.isOpened && ReactDOM.createPortal(picker, this.pickerPortal)}
        </>
    }
}

export class _ColorPicker extends React.Component<any, any>{

    componentDidMount() {
        document.addEventListener("mousedown", this.close);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.close);
    }

    close = () => {
        console.log("close");
        if (this.props.onClose)
            this.props.onClose(false);
    }

    private handleCloseClick = () => {
        if (this.props.onClose)
            this.props.onClose(true);
    }

    fieldsChange = (data: any, e: any) => {
        if (data.hex) {
            this.props.onChange({
                hex: data.hex,
                source: 'hex',
            }, e)
        } else if (data.r || data.g || data.b) {
            this.props.onChange({
                r: data.r || this.props.rgb.r,
                g: data.g || this.props.rgb.g,
                b: data.b || this.props.rgb.b,
                a: this.props.rgb.a,
                source: 'rgb',
            }, e)
        } else if (data.a) {
            if (data.a < 0) {
                data.a = 0
            } else if (data.a > 100) {
                data.a = 100
            }

            data.a /= 100
            this.props.onChange({
                h: this.props.hsl.h,
                s: this.props.hsl.s,
                l: this.props.hsl.l,
                a: data.a,
                source: 'rgb',
            }, e)
        }
    }

    render() {
        return (
            <ZakekeColorPickerContainer onMouseDown={(e) => e.nativeEvent.stopPropagation()} style={this.props.style} >
                <div className="saturation-row">
                    <Saturation
                        {...this.props}
                        onChange={this.props.onChange}
                    />
                </div>
                <div className="hue-row">
                    <Hue
                        {...this.props}
                        onChange={this.props.onChange}
                    />
                </div>
                {this.props.showAlpha && (
                    <div className="alpha-row">
                        <Alpha
                            {...this.props}
                            onChange={this.props.onChange}
                        />
                    </div>
                )}
                <div className="fields-row">
                    <div>
                        <label>Hex</label>
                        <EditableInputExpanded hideLabel label="hex" value={this.props.hex.toUpperCase()} onChange={this.fieldsChange} />
                    </div>
                    <div>
                        <label>R</label>
                        <EditableInputExpanded hideLabel label="r" value={this.props.rgb.r} onChange={this.fieldsChange} />
                    </div>
                    <div>
                        <label>G</label>
                        <EditableInputExpanded hideLabel label="g" value={this.props.rgb.g} onChange={this.fieldsChange} />
                    </div>
                    <div>
                        <label>B</label>
                        <EditableInputExpanded hideLabel label="b" value={this.props.rgb.b} onChange={this.fieldsChange} />
                    </div>
                </div>

                <div className="button-row">
                    <Button primary isFullWidth onClick={this.handleCloseClick}>OK</Button>
                </div>
            </ZakekeColorPickerContainer>
        );
    }

}

export let ZakekeColorPicker = CustomPicker(_ColorPicker);