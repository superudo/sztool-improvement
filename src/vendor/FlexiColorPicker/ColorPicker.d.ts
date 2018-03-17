export interface HSV {
    h: number;
    s: number;
    v: number;
}

export interface RGB {
    r: number;
    g: number;
    b: number;
    hex: string;
}

declare class ColorPicker {
    constructor(
        containerElement: Element,
        callback: (hex: string, hsv: HSV, rgb: RGB) => void
    );
    
    constructor(
        slideElement: Element,
        colorPickerElement: Element, 
        callback: (hex: string, hsv: HSV, rgb: RGB) => void
    );

    setHsv(hsv: HSV): void;
    setRgb(rgb: RGB): void;
    setHex(hex: string): void;
}