import { TimeSelector } from './TimeSelector';
import { TimeControlWrapper } from './TimeControlWrapper';
import { style, media } from 'typestyle';
import * as csx from "csx";

const START_HOUR: number = 7;
const TIME_ROWS: number = 4;
const HOUR_COLUMNS: number = 4;

const cssClockline = style({
    backgroundColor: csx.green.toString(),
    padding: '0px',
    overflow: 'auto',
    $nest: {
        '&>button': {
            backgroundColor: csx.color('#4caf50').toString(),
            border: '1px solid ' + csx.green.toString(),
            color: csx.white.toString(),
            padding: '0.1em 0.7em',
            cursor: 'pointer',
            float: 'left'
        },
        '&>button:hover': {
            backgroundColor: csx.rgb(64, 128, 64).toString()
        },
        '&+button': {
            clear: 'left'
        },
        '&>select': {
            margin: '1px auto'
        }
    }
})

const cssOuter = style({
    backgroundColor: csx.burlywood.toString(),
    padding: '0.3em',
    fontFamily: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
    fontSize: '10pt',
    overflowY: 'auto',
    display: 'inline-block'
})

const cssClockTitle = style({
    color: csx.white.toString(),
    backgroundColor: csx.darkgreen.toString(),
    border: '1px solid ' + csx.green.toString(),
    fontWeight: 'bold',
    padding: '0.1em 0.2em',
    marginBottom: '0.3em'   
})

const cssHours = style({
    float: 'left'
})

const cssMinutes = style({
    float: 'left',
    marginLeft: '0.5em'
})

const cssInputButton = style({
    float: 'right',
    margin: '1px auto'
})

export class TimeTable {
    target: TimeControlWrapper;
    
    constructor(targetControl: TimeControlWrapper) {
        this.target = targetControl;
    }

    createDom(btn: HTMLInputElement, btnValue: string): HTMLElement { 
        let outerDiv = document.createElement('div');
        outerDiv.classList.add(cssOuter);

        let titleLine = document.createElement('div');
        titleLine.classList.add(cssClockline, cssClockTitle);

        titleLine.appendChild(this.target.hourControl);
        titleLine.appendChild(new Text(':'));
        titleLine.appendChild(this.target.minuteControl);

        if (btn && btn != null) {
            btn.value = (btnValue)? btnValue: '???';
            titleLine.appendChild(btn);
            btn.classList.add(cssInputButton);
        }

        outerDiv.appendChild(titleLine);

        let hoursContainer = document.createElement('div');
        for (let i = 0; i < TIME_ROWS; ++i) {
            let hourLine = this.getHourLine(i);
            hoursContainer.appendChild(hourLine);
        }
        hoursContainer.classList.add(cssHours);
        outerDiv.appendChild(hoursContainer);

        let minutesContainer = document.createElement('div');
        for (let i = 0; i < TIME_ROWS; ++i) {
            let minuteLine = this.getMinuteLine(i);
            minutesContainer.appendChild(minuteLine);
        }
        minutesContainer.classList.add(cssMinutes);
        outerDiv.appendChild(minutesContainer);

        return outerDiv;
    }

   private getMinuteLine(index: number): HTMLElement {
        let minuteLine = document.createElement('div');
        minuteLine.classList.add(cssClockline);
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

    private getHourLine(index: number): HTMLElement {
        let hourLine = document.createElement('div');
        hourLine.classList.add(cssClockline);
        for (let i = 0; i < HOUR_COLUMNS; ++i) {
            let hourButton = document.createElement('button');
            let btnValue = this.formatNumber(START_HOUR + TIME_ROWS * i + index);
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