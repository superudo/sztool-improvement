import './TimeControlWrapper.css';
import { TimeSelector } from './TimeSelector';

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
        console.log("Setting time check callbacks.");
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
            this.hourControl.classList.add('invalid');
            this.minuteControl.classList.add('invalid');
        }
        else {
            this.hourControl.classList.remove('invalid');
            this.minuteControl.classList.remove('invalid');
        }
    }

    selectOption(selectElement: HTMLSelectElement, newSelection: string) {
        for (var index = 0; index < selectElement.options.length; ++index) {
            var option = selectElement.options[index] as HTMLOptionElement;
            if (option.text === newSelection) {
                selectElement.selectedIndex = index;
                break;
            }
        }
    }

    fireEvent(element: HTMLElement, event: string) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true ); // event type,bubbling,cancelable
        return !element.dispatchEvent(evt);
    }
}