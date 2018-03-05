import { TimeSelector } from './TimeSelector';
import { style } from 'typestyle';
import * as csx from 'csx';

const cssInvalid = style({
    color: csx.important(csx.red.toString())
})

export class TimeControlWrapper {
    hourControl: HTMLSelectElement;
    minuteControl: HTMLSelectElement;

    constructor(hour: HTMLElement, minute: HTMLElement) {
        if (hour instanceof HTMLSelectElement) {
            this.hourControl = hour as HTMLSelectElement;
        }
        if (minute instanceof HTMLSelectElement) {
            this.minuteControl = minute as HTMLSelectElement;
        }
    }

    setTimeCheckCallback(callback: (observer: TimeSelector) => void, observer: TimeSelector) {
        this.hourControl.addEventListener('change', (e: Event) => {
            callback(observer);
        });
        this.minuteControl.addEventListener('change', (e: Event) => {
            callback(observer);
        })
    }

    setHours(h: string) {
        this.selectOption(this.hourControl, h);
        this.fireEvent(this.hourControl, 'change');
    }

    setMinutes(m: string) {
        this.selectOption(this.minuteControl, m);
        this.fireEvent(this.minuteControl, 'change');
    }

    getTimeInMinutes(): number {
        return this.getHours() * 60 + this.getMinutes();
    }

    getHours(): number {
        return Number(this.hourControl.value);
    }

    getMinutes(): number {
        return Number(this.minuteControl.value);
    }

    indicateError(isError: boolean) {
        if (isError) {
            this.hourControl.classList.add(cssInvalid);
            this.minuteControl.classList.add(cssInvalid);
        }
        else {
            this.hourControl.classList.remove(cssInvalid);
            this.minuteControl.classList.remove(cssInvalid);
        }
    }

    private selectOption(selectElement: HTMLSelectElement, newSelection: string) {
        for (let index = 0; index < selectElement.options.length; ++index) {
            let option = selectElement.options[index] as HTMLOptionElement;
            if (option.text === newSelection) {
                selectElement.selectedIndex = index;
                break;
            }
        }
    }

    private fireEvent(element: HTMLElement, event: string) {
        let evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true ); // event type,bubbling,cancelable
        return !element.dispatchEvent(evt);
    }
}