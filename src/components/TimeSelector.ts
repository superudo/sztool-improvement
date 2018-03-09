import { TimeTable } from "./TimeTable";
import { TimeControlWrapper } from "./TimeControlWrapper";
import { style } from "typestyle";
import { ControlSwitcher } from "./ControlSwitcher";
import { css } from "./ComponentStyles";

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

        let controlDiv = document.createElement('div');
        controlDiv.classList.add(css.controlArea);
        controlDiv.appendChild(fromView);
        controlDiv.appendChild(toView);

        insertAfter.parentNode.insertBefore(controlDiv, insertAfter.nextSibling);

        // insertAfter.parentNode.insertBefore(fromView, insertAfter.nextSibling);
        // fromView.parentNode.insertBefore(toView, fromView.nextSibling);
        new ControlSwitcher().injectOffSwitch(toView.parentElement);

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


