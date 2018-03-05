import './TimesParagraphWrapper.css';

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
        this.paragraph.classList.add('hidden-time');
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
        let inputChildren = this.paragraph.getElementsByTagName('input');
        for (let i = 0; i < inputChildren.length; ++i) {
            if (inputChildren[i].type.toLowerCase() === 'button') {
                return inputChildren[i];
            }
        }
        throw "Button element not found!";
    }
}