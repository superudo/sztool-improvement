import { style } from "typestyle";
import { css } from "./ComponentStyles";

const INPUT_BUTTON_TEXT: string = 'Eintragen!';
const CANCEL_BUTTON_TEXT: string = 'cancel edit!';

export interface ITimeControls {
    fromHours: HTMLSelectElement;
    toHours: HTMLSelectElement;
    fromMinutes: HTMLSelectElement;
    toMinutes: HTMLSelectElement;
}

export class TimesParagraphWrapper {
    paragraph: HTMLParagraphElement;

    constructor(p: HTMLParagraphElement) {
        this.paragraph = p;
    }

    hideParagraph() {
        this.paragraph.classList.add(css.hiddenTime);
    }

    getParagraphElement(): HTMLParagraphElement {
        return this.paragraph;
    }

    getSelectControls(): ITimeControls {
        return {
            fromHours: document.getElementsByName('from_hh')[0] as HTMLSelectElement, 
            fromMinutes: document.getElementsByName('from_mm')[0] as HTMLSelectElement,
            toHours: document.getElementsByName('to_hh')[0] as HTMLSelectElement,
            toMinutes: document.getElementsByName('to_mm')[0] as HTMLSelectElement
        };
    }

    getInputButton(): HTMLInputElement {
        return this.getButton(INPUT_BUTTON_TEXT);
    }

    getCancelButton(): HTMLInputElement {
        return this.getButton(CANCEL_BUTTON_TEXT);
    }

    private getButton(withValue: string) {
        let inputChildren = this.paragraph.getElementsByTagName('input');
        for (let i = 0; i < inputChildren.length; ++i) {
            if (inputChildren[i].type.toLowerCase() === 'button'
             && inputChildren[i].value.toLowerCase() === withValue.toLowerCase()) {
                return inputChildren[i];
            }
        }
        return null;
    }
}