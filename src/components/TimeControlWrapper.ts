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
}