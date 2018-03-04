import { TimeTable } from "./TimeTable";
import { TimeControlWrapper } from "./TimeControlWrapper";

export class TimeSelector {
    fromTable: TimeTable;
    toTable: TimeTable;
    fromTime: TimeControlWrapper;
    toTime: TimeControlWrapper;

    constructor(from: TimeControlWrapper, to: TimeControlWrapper) {
        this.fromTime = from;
        this.toTime = to;
    }

    injectAfter(insertAfter: Element): void {
        let fromControl = new TimeTable('Start', this.fromTime);
        let toControl = new TimeTable('End', this.toTime);

        let fromView = fromControl.getView();
        let toView = toControl.getView();

        insertAfter.parentNode.insertBefore(fromView, insertAfter.nextSibling);
        fromView.parentNode.insertBefore(toView, fromView.nextSibling);

        this.fromTime.setTimeCheckCallback(this.checkTimes, this);
        this.toTime.setTimeCheckCallback(this.checkTimes, this);
    }
        
    private checkTimes(s: TimeSelector) {
        let from = s.fromTime.getTimeInMinutes();
        let to = s.toTime.getTimeInMinutes();
        let isInvalid = (from >= to);
        s.fromTime.indicateError(isInvalid);
        s.toTime.indicateError(isInvalid);
    }

    private checkTargetTime(fromHour?: string, fromMinutes?: string, toHour?: string, toMinutes?: string): boolean {
        let fromH = (fromHour !== null)? Number(fromHour): this.fromTime.getHours();
        let fromM = (fromMinutes !== null)? Number(fromMinutes): this.fromTime.getMinutes();
        let toH = (toHour !== null)? Number(toHour): this.toTime.getHours();
        let toM = (toMinutes !== null)? Number(toMinutes): this.toTime.getMinutes();
        return (60 * fromH + fromM < 60 * toH + toM);
    }
}


