import { TimeTable } from "./TimeTable";
import { TimeControlWrapper } from "./TimeControlWrapper";

export class TimeSelector {
    fromTable: TimeTable;
    toTable: TimeTable;
    fromTime: TimeControlWrapper;
    toTime: TimeControlWrapper;

    constructor(insertAfter: Element, from: TimeControlWrapper, to: TimeControlWrapper) {
        this.fromTime = from;
        this.toTime = to;

        var fromControl = new TimeTable('from', this.fromTime);
        var toControl = new TimeTable('to', this.toTime);

        var fromView = fromControl.getView();
        var toView = toControl.getView();

        insertAfter.parentNode.insertBefore(fromView, insertAfter.nextSibling);
        fromView.parentNode.insertBefore(toView, fromView.nextSibling);

        this.fromTime.setTimeCheckCallback(this.checkTimes, this);
        this.toTime.setTimeCheckCallback(this.checkTimes, this);
    }

    checkTimes(s: TimeSelector) {
        var from = s.fromTime.getTimeInMinutes();
        var to = s.toTime.getTimeInMinutes();
        var isInvalid = (from >= to);
        s.fromTime.indicateError(isInvalid);
        s.toTime.indicateError(isInvalid);
    }

    checkTargetTime(fromHour?: string, fromMinutes?: string, toHour?: string, toMinutes?: string): boolean {
        var fromH = (fromHour !== null)? Number(fromHour): this.fromTime.getHours();
        var fromM = (fromMinutes !== null)? Number(fromMinutes): this.fromTime.getMinutes();
        var toH = (toHour !== null)? Number(toHour): this.toTime.getHours();
        var toM = (toMinutes !== null)? Number(toMinutes): this.toTime.getMinutes();
        return (60 * fromH + fromM < 60 * toH + toM);
    }
}


