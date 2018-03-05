import './TimeTable.css';
import { TimeSelector } from './TimeSelector';
import { TimeControlWrapper } from './TimeControlWrapper';

export class TimeTable {
    target: TimeControlWrapper;
    button: HTMLInputElement;

    constructor(targetControl: TimeControlWrapper) {
        this.target = targetControl;
    }

    getView(btn?: HTMLInputElement): HTMLElement { 
        let outerDiv = document.createElement('div');
        outerDiv.classList.add('outer');

        let titleLine = document.createElement('div');
        titleLine.classList.add('clockline', 'clocktitle');

        titleLine.appendChild(this.target.hourControl);
        titleLine.appendChild(new Text(':'));
        titleLine.appendChild(this.target.minuteControl);

        if (btn) {
            btn.value = '➽';
            titleLine.appendChild(btn);
            btn.classList.add('inputbutton');
            this.button = btn;
        }

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
        minuteButton.type = 'button';
        minuteButton.addEventListener('click', (e: Event) => {
            this.changeMinutes(e);
            e.stopPropagation();
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