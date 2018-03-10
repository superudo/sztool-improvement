import { css } from "../styles/ComponentStyles";
import { ControlSwitcher } from "./ControlSwitcher";
import { TimeControlWrapper } from "./TimeControlWrapper";
import { TimeTable } from "./TimeTable";

const INPUT_BUTTON_SIGN: string = "➽";
const CANCEL_BUTTON_SIGN: string = "⛔";

export class TimeSelector {
  fromTable: TimeTable;
  toTable: TimeTable;
  private fromTime: TimeControlWrapper;
  private toTime: TimeControlWrapper;
  private inputButton: HTMLInputElement;
  private cancelButton: HTMLInputElement;

  constructor(
    from: TimeControlWrapper,
    to: TimeControlWrapper,
    inputButton: HTMLInputElement,
    cancelButton: HTMLInputElement
  ) {
    this.fromTime = from;
    this.toTime = to;
    this.inputButton = inputButton;
    this.cancelButton = cancelButton;
  }

  public initApp(appRootId: string): void {
    const fromControl = new TimeTable(this.fromTime);
    const toControl = new TimeTable(this.toTime);

    const fromView = fromControl.createDom(
      this.cancelButton,
      CANCEL_BUTTON_SIGN
    );
    let toView = toControl.createDom(this.inputButton, INPUT_BUTTON_SIGN);

    let controlDiv = document.getElementById(appRootId);
    if (controlDiv === null) {
      throw "App root not found.";
    }
    controlDiv.classList.add(css.controlArea);
    controlDiv.appendChild(fromView);
    controlDiv.appendChild(toView);

    new ControlSwitcher().injectOffSwitch(toView.parentElement);

    this.fromTime.setTimeCheckCallback(this.checkTimes, this);
    this.toTime.setTimeCheckCallback(this.checkTimes, this);
  }

  private checkTimes(s: TimeSelector) {
    let from = s.fromTime.getTimeInMinutes();
    const to = s.toTime.getTimeInMinutes();
    const isInvalid = from >= to;
    s.fromTime.indicateError(isInvalid);
    s.toTime.indicateError(isInvalid);
    s.inputButton.disabled = isInvalid;
  }

  private checkTargetTime(
    fromHour?: string,
    fromMinutes?: string,
    toHour?: string,
    toMinutes?: string
  ): boolean {
    const fromH =
      fromHour !== null ? Number(fromHour) : this.fromTime.getHours();
    const fromM =
      fromMinutes !== null ? Number(fromMinutes) : this.fromTime.getMinutes();
    const toH = toHour !== null ? Number(toHour) : this.toTime.getHours();
    const toM =
      toMinutes !== null ? Number(toMinutes) : this.toTime.getMinutes();
    return 60 * fromH + fromM < 60 * toH + toM;
  }
}
