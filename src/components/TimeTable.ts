import './TimeTable.css';
import { TimeSelector } from './TimeSelector';
import { TimeControlWrapper } from './TimeControlWrapper';

type TimeCallback = (n: string, e: TimeSelector) => boolean;

export class TimeTable {
    title: string;
    target: TimeControlWrapper;

    constructor(selectorTitle: string, targetControl: TimeControlWrapper) {
        this.title = selectorTitle;
        this.target = targetControl;
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
        var btnValue = this.formatNumber(index * 15);
        minuteButton.innerText = btnValue;;
        minuteButton.value = btnValue;
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
            var btnValue = this.formatNumber(8 + 4 * i + index);
            hourButton.innerText = btnValue;
            hourButton.value = btnValue;
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
        }, 100);
    }
    
    changeHours(e: Event) {
        var newHourText: string = (e.target as HTMLButtonElement).value;
        this.target.setHours(newHourText);
    }

    changeMinutes(e: Event) {
        var newMinuteText: string = (e.target as HTMLButtonElement).value;
        this.target.setMinutes(newMinuteText);
    }

    formatNumber(value: number): string {
        if (value < 0 || value > 99) {
            return '' + value;
        }
        return ((value < 10)? '0': '') + value;
    }
}