import './TimeTable.css';
import { TimeSelector } from './TimeSelector';
import { TimeControlWrapper } from './TimeControlWrapper';

export class TimeTable {
    title: string;
    target: TimeControlWrapper;

    constructor(selectorTitle: string, targetControl: TimeControlWrapper) {
        this.title = selectorTitle;
        this.target = targetControl;
    }

    getView(): HTMLElement { 
        let outerDiv = document.createElement('div');
        outerDiv.classList.add('outer');

        let titleLine = document.createElement('div');
        titleLine.classList.add('clockline', 'clocktitle');
        titleLine.innerText = this.title;
        outerDiv.appendChild(titleLine);

        let hoursContainer = document.createElement('div');
        for (let i = 0; i < 4; ++i) {
            let hourLine = this.getHourLine(i);
            hoursContainer.appendChild(hourLine);
        }
        hoursContainer.classList.add('hours');
        outerDiv.appendChild(hoursContainer);

        let minutesContainer = document.createElement('div');
        for (let i = 0; i < 4; ++i) {
            let minuteLine = this.getMinuteLine(i);
            minutesContainer.appendChild(minuteLine);
        }
        minutesContainer.classList.add('minutes');
        outerDiv.appendChild(minutesContainer);

        return outerDiv;
    }

    private getMinuteLine(index: number): HTMLElement {
        let minuteLine = document.createElement('div');
        minuteLine.classList.add('clockline');
        let minuteButton = document.createElement('button');
        minuteButton.classList.add('clocknum');
        let btnValue = this.formatNumber(index * 15);
        minuteButton.innerText = btnValue;;
        minuteButton.value = btnValue;
        minuteButton.addEventListener('click', (e: Event) => {
            this.changeMinutes(e);
        });
        minuteLine.appendChild(minuteButton);
        return minuteLine;
    }

    private getHourLine(index: number): HTMLElement {
        let hourLine = document.createElement('div');
        hourLine.className = 'clockline';
        for (let i = 0; i < 3; ++i) {
            let hourButton = document.createElement('button');
            hourButton.className = 'clocknum';
            let btnValue = this.formatNumber(8 + 4 * i + index);
            hourButton.innerText = btnValue;
            hourButton.value = btnValue;
            hourButton.addEventListener('click', (e: Event) => {
                this.changeHours(e);
            });
            hourLine.appendChild(hourButton);
        }
        return hourLine;
    }

    private changeHours(e: Event) {
        let newHourText = (e.target as HTMLButtonElement).value;
        this.target.setHours(newHourText);
    }

    private changeMinutes(e: Event) {
        let newMinuteText = (e.target as HTMLButtonElement).value;
        this.target.setMinutes(newMinuteText);
    }

    private formatNumber(value: number): string {
        if (value < 0 || value > 99) {
            return '' + value;
        }
        return ((value < 10)? '0': '') + value;
    }
}