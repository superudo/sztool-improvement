import { TimeTable } from "./TimeTable";
import { TimeControlWrapper } from "./TimeControlWrapper";
import './TimeSelector.css';

const INPUT_BUTTON_SIGN: string ='➽';
const CANCEL_BUTTON_SIGN: string = '⛔';

export class TimeSelector {
    fromTable: TimeTable;
    toTable: TimeTable;
    private fromTime: TimeControlWrapper;
    private toTime: TimeControlWrapper;
    private inputButton: HTMLInputElement;
    private cancelButton: HTMLInputElement;

    constructor(from: TimeControlWrapper, to: TimeControlWrapper, 
        inputButton: HTMLInputElement, cancelButton: HTMLInputElement) {
        this.fromTime = from;
        this.toTime = to;
        this.inputButton = inputButton;
        this.cancelButton = cancelButton;
    }

    injectAfter(insertAfter: Element): void {
        let fromControl = new TimeTable(this.fromTime);
        let toControl = new TimeTable(this.toTime);

        let fromView = fromControl.createDom(this.cancelButton, CANCEL_BUTTON_SIGN);
        let toView = toControl.createDom(this.inputButton, INPUT_BUTTON_SIGN);

        insertAfter.parentNode.insertBefore(fromView, insertAfter.nextSibling);
        fromView.parentNode.insertBefore(toView, fromView.nextSibling);
        let switchLink = document.createElement('a');
        switchLink.href = '#';
        switchLink.innerText = '☒';
        switchLink.classList.add('ts-switchLink');
        switchLink.addEventListener('click', (e: Event) => {
            localStorage.removeItem('useNewControl');
            window.location.replace(window.location.pathname);
            e.stopPropagation();
        });
        toView.parentNode.appendChild(switchLink);

        this.fromTime.setTimeCheckCallback(this.checkTimes, this);
        this.toTime.setTimeCheckCallback(this.checkTimes, this);
    }
        
    private checkTimes(s: TimeSelector) {
        let from = s.fromTime.getTimeInMinutes();
        let to = s.toTime.getTimeInMinutes();
        let isInvalid = (from >= to);
        s.fromTime.indicateError(isInvalid);
        s.toTime.indicateError(isInvalid);
        s.inputButton.disabled = isInvalid;
    }

    private checkTargetTime(fromHour?: string, fromMinutes?: string, toHour?: string, toMinutes?: string): boolean {
        let fromH = (fromHour !== null)? Number(fromHour): this.fromTime.getHours();
        let fromM = (fromMinutes !== null)? Number(fromMinutes): this.fromTime.getMinutes();
        let toH = (toHour !== null)? Number(toHour): this.toTime.getHours();
        let toM = (toMinutes !== null)? Number(toMinutes): this.toTime.getMinutes();
        return (60 * fromH + fromM < 60 * toH + toM);
    }
}


