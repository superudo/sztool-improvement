import './TimeTable.css';
import { TimeSelector } from './TimeSelector';

export class TimeControl {
    hours: HTMLSelectElement;
    minutes: HTMLSelectElement;

    constructor(hours: HTMLSelectElement, minutes: HTMLSelectElement) {
        this.hours = hours;
        this.minutes = minutes;
    }

    getTime(): number {
        return this.getHours() * 60 + this.getMinutes();
    }

    getHours(): number {
        return Number(this.hours.value);
    }

    getMinutes(): number {
        return Number(this.minutes.value);
    }
}

type TimeCallback = (n: string, e: TimeSelector) => boolean;

export class TimeTable {
    title: string;
    target: TimeControl;
    hourCallback: TimeCallback;
    minuteCallback: TimeCallback;
    parentControl: TimeSelector;

    constructor(selectorTitle: string, targetControl: TimeControl, 
        hourCallback: TimeCallback, minuteCallback: TimeCallback,
        parentControl: TimeSelector) {

        this.title = selectorTitle;
        this.target = targetControl;
        this.hourCallback = hourCallback;
        this.minuteCallback = minuteCallback;
        this.parentControl = parentControl;
    }

    getView(): HTMLElement { 
        var outerDiv = document.createElement('div');
        outerDiv.classList.add('outer');

        var titleLine = document.createElement('div');
        titleLine.classList.add('clockline', 'clocktitle');
        titleLine.innerText = this.title;
        outerDiv.appendChild(titleLine);

        var hoursContainer = document.createElement('div');
        for (var i = 0; i < 4; ++i) {
            var hourLine = this.getHourLine(i);
            hoursContainer.appendChild(hourLine);
        }
        hoursContainer.classList.add('hours');
        outerDiv.appendChild(hoursContainer);

        var minutesContainer = document.createElement('div');
        for (var i = 0; i < 4; ++i) {
            var minuteLine = this.getMinuteLine(i);
            minutesContainer.appendChild(minuteLine);
        }
        minutesContainer.classList.add('minutes');
        outerDiv.appendChild(minutesContainer);

        return outerDiv;
    }

    getMinuteLine(index: number): HTMLElement {
        var minuteLine = document.createElement('div');
        minuteLine.classList.add('clockline');
        var minuteButton = document.createElement('button');
        minuteButton.classList.add('clocknum');
        minuteButton.innerText = this.formatNumber(index * 15);
        minuteButton.addEventListener('click', (e: Event) => {
            this.changeMinutes(e);
        });
        minuteLine.appendChild(minuteButton);
        return minuteLine;
    }

    getHourLine(index: number): HTMLElement {
        var hourLine = document.createElement('div');
        hourLine.className = 'clockline';
        for (var i = 0; i < 3; ++i) {
            var hourButton = document.createElement('button');
            hourButton.className = 'clocknum';
            hourButton.innerText = this.formatNumber(8 + 4 * i + index);
            hourButton.addEventListener('click', (e: Event) => {
                this.changeHours(e);
            });
            hourLine.appendChild(hourButton);
        }
        return hourLine;
    }

    flashElement(el: Element): void {
        el.classList.add('invalid');
        setTimeout(() => {
            el.classList.remove('invalid');
        }, 200);
    }
    
    changeHours(e: Event) {
        var newHourText: string = e.srcElement.innerHTML;
        if (this.hourCallback(newHourText, this.parentControl) === true) {
            this.selectOption(this.target.hours, newHourText);
        }
        else {
            this.flashElement(e.srcElement);
        }
    }

    changeMinutes(e: Event) {
        var newMinuteText: string = e.srcElement.innerHTML;
        if (this.minuteCallback(newMinuteText, this.parentControl) === true) {
            this.selectOption(this.target.minutes, newMinuteText);
        }
        else {
            this.flashElement(e.srcElement);
        }
    }

    selectOption(element: HTMLElement, newSelection: string) {
        if (element instanceof HTMLSelectElement) {
            var selectElement = element as HTMLSelectElement;
            for (var index = 0; index < selectElement.options.length; ++index) {
                var option = selectElement.options[index] as HTMLOptionElement;
                if (option.text === newSelection) {
                    selectElement.selectedIndex = index;
                    break;
                }
            }
        }
    }

    formatNumber(value: number): string {
        if (value < 0 || value > 99) {
            return '' + value;
        }
        return ((value < 10)? '0': '') + value;
    }
};