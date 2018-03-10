import { TimeSelector } from './TimeSelector';
import { TimeControlWrapper } from './TimeControlWrapper';
import { css } from '../styles/ComponentStyles';

const START_HOUR: number = 7;
const TIME_ROWS: number = 4;
const HOUR_COLUMNS: number = 4;

export class TimeTable {
    target: TimeControlWrapper;
    
    constructor(targetControl: TimeControlWrapper) {
        this.target = targetControl;
    }

    createDom(btn: HTMLInputElement, btnValue: string): HTMLElement { 
        let outerDiv = document.createElement('div');
        outerDiv.classList.add(css.outer);

        let titleLine = document.createElement('div');
        titleLine.classList.add(css.clockline, css.clockTitle);

        titleLine.appendChild(this.target.hourControl);
        titleLine.appendChild(new Text(':'));
        titleLine.appendChild(this.target.minuteControl);

        if (btn && btn != null) {
            btn.value = (btnValue)? btnValue: '???';
            titleLine.appendChild(btn);
            btn.classList.add(css.inputButton);
        }

        outerDiv.appendChild(titleLine);

        let hoursContainer = document.createElement('div');
        for (let i = 0; i < TIME_ROWS; ++i) {
            let hourLine = this.getHourLine(i);
            hoursContainer.appendChild(hourLine);
        }
        hoursContainer.classList.add(css.hours);
        outerDiv.appendChild(hoursContainer);

        let minutesContainer = document.createElement('div');
        for (let i = 0; i < TIME_ROWS; ++i) {
            let minuteLine = this.getMinuteLine(i);
            minutesContainer.appendChild(minuteLine);
        }
        minutesContainer.classList.add(css.minutes);
        outerDiv.appendChild(minutesContainer);

        return outerDiv;
    }

    private getMinuteLine(index: number): HTMLElement {
        let minuteLine = document.createElement('div');
        minuteLine.classList.add(css.clockline);
        let minuteButton = document.createElement('button');
        let btnValue = this.formatNumber(index * 15);
        minuteButton.innerText = btnValue;;
        minuteButton.value = btnValue;
        minuteButton.type = 'button';
        minuteButton.addEventListener('click', (e: Event) => {
            this.changeMinutes(e);
            e.stopPropagation();
        });
        minuteLine.appendChild(minuteButton);
        return minuteLine;
    }

    private getHourLine(timeRow: number): HTMLElement {
        let hourLine = document.createElement('div');
        hourLine.classList.add(css.clockline);
        for (let i = 0; i < HOUR_COLUMNS; ++i) {
            let hourButton = document.createElement('button');
            let btnValue = this.formatNumber(START_HOUR + TIME_ROWS * timeRow + i);
            hourButton.innerText = btnValue;
            hourButton.value = btnValue;
            hourButton.type = 'button';
            hourButton.addEventListener('click', (e: Event) => {
                this.changeHours(e);
                e.stopPropagation();
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