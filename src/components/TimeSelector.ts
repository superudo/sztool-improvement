import { TimeTable, TimeControl } from "./TimeTable";

export class TimeSelector {
    fromTable: TimeTable;
    toTable: TimeTable;
    fromTime: TimeControl;
    toTime: TimeControl;

    constructor(insertAfter: Element, from: TimeControl, to: TimeControl) {
        this.fromTime = from;
        this.toTime = to;

        var fromControl = new TimeTable('from', this.fromTime, this.checkFromHour, this.checkFromMinute, this);
        var toControl = new TimeTable('to', this.toTime, this.checkToHour, this.checkToMinute, this);

        var fromView = fromControl.getView();
        var toView = toControl.getView();

        insertAfter.parentNode.insertBefore(fromView, insertAfter.nextSibling);
        fromView.parentNode.insertBefore(toView, fromView.nextSibling);
    }

    checkFromHour(h: string, p: TimeSelector): boolean {
        var fromH = Number(h);
        var fromM = p.fromTime.getMinutes();
        var toH = p.toTime.getHours();
        var toM = p.toTime.getMinutes();
        return (60 * fromH + fromM < 60 * toH + toM);
    }

    checkFromMinute(m: string, p: TimeSelector): boolean {
        var fromH = p.fromTime.getHours();
        var fromM = Number(m);
        var toH = p.toTime.getHours();
        var toM = p.toTime.getMinutes();
        return (60 * fromH + fromM < 60 * toH + toM);
    }

    checkToHour(h: string, p: TimeSelector): boolean {
        var fromH = p.fromTime.getHours();
        var fromM = p.fromTime.getMinutes();
        var toH = Number(h);
        var toM = p.toTime.getMinutes();
        return (60 * fromH + fromM < 60 * toH + toM);
    }

    checkToMinute(m: string, p: TimeSelector): boolean {
        var fromH = p.fromTime.getHours();
        var fromM = p.fromTime.getMinutes();
        var toH = p.toTime.getHours();
        var toM = Number(m);
        return (60 * fromH + fromM < 60 * toH + toM);
    }

    checkTargetTime(fromHour?: string, fromMinutes?: string, toHour?: string, toMinutes?: string): boolean {
        var fromH = (fromHour !== null)? Number(fromHour): this.fromTime.getHours();
        var fromM = (fromMinutes !== null)? Number(fromMinutes): this.fromTime.getMinutes();
        var toH = (toHour !== null)? Number(toHour): this.toTime.getHours();
        var toM = (toMinutes !== null)? Number(toMinutes): this.toTime.getMinutes();
        return (60 * fromH + fromM < 60 * toH + toM);
    }
}


