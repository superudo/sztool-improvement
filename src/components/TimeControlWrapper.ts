import { important, red } from "csx";
import { style } from "typestyle";
import { IStylesheetProvider } from "../interfaces/IStylesheetProvider";
import { addStyles, removeStyles } from "../tools/StyleUtils";
import { TimeSelector } from "./TimeSelector";


export class TimeControlWrapper implements IStylesheetProvider {
    public hourControl: HTMLSelectElement;
    public minuteControl: HTMLSelectElement;

    constructor(hour: HTMLElement, minute: HTMLElement) {
        if (hour instanceof HTMLSelectElement) {
            this.hourControl = hour as HTMLSelectElement;
        }
        if (minute instanceof HTMLSelectElement) {
            this.minuteControl = minute as HTMLSelectElement;
        }
    }

    public getProviderName() {
        return "timecontrolwrapper";
    }

    public getDefaultStylesheet() {
        return {
            invalid: style({
                color: important(red.toString())
            })
        };
    }
    public setTimeCheckCallback(
        callback: (observer: TimeSelector) => void, observer: TimeSelector) {
        this.hourControl.addEventListener("change", (e: Event) => {
            callback(observer);
        });
        this.minuteControl.addEventListener("change", (e: Event) => {
            callback(observer);
        });
    }

    public setHours(h: string) {
        this.selectOption(this.hourControl, h);
        this.fireEvent(this.hourControl, "change");
    }

    public setMinutes(m: string) {
        this.selectOption(this.minuteControl, m);
        this.fireEvent(this.minuteControl, "change");
    }

    public getTimeInMinutes(): number {
        return this.getHours() * 60 + this.getMinutes();
    }

    public getHours(): number {
        return Number(this.hourControl.value);
    }

    public getMinutes(): number {
        return Number(this.minuteControl.value);
    }

    public indicateError(isError: boolean) {
        if (isError) {
            addStyles(this.hourControl, this, "invalid");
            addStyles(this.minuteControl, this, "invalid");
        } else {
            removeStyles(this.hourControl, this, "invalid");
            removeStyles(this.minuteControl, this, "invalid");
        }
    }

    private selectOption(
        selectElement: HTMLSelectElement, newSelection: string) {
        for (let index = 0; index < selectElement.options.length; ++index) {
            const option = selectElement.options[index] as HTMLOptionElement;
            if (option.text === newSelection) {
                selectElement.selectedIndex = index;
                break;
            }
        }
    }

    private fireEvent(element: HTMLElement, event: string) {
        const evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true ); // event type,bubbling,cancelable
        return !element.dispatchEvent(evt);
    }
}
