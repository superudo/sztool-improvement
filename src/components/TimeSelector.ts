import * as csstips from "csstips";
import { style } from "typestyle";
import { IStylesheetProvider } from "../interfaces/IStylesheetProvider";
import { StyleConfiguration } from "../styles/StyleConfiguration";
import { ControlSwitcher } from "./ControlSwitcher";
import { TimeControlWrapper } from "./TimeControlWrapper";
import { TimeTable } from "./TimeTable";

const INPUT_BUTTON_SIGN: string = "➽";
const CANCEL_BUTTON_SIGN: string = "⛔";

export class TimeSelector implements IStylesheetProvider {
  public fromTable: TimeTable;
  public toTable: TimeTable;
  private fromTime: TimeControlWrapper;
  private toTime: TimeControlWrapper;
  private inputButton: HTMLInputElement;
  private cancelButton: HTMLInputElement;
  private styleConfiguration: StyleConfiguration;

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
    this.styleConfiguration = new StyleConfiguration(this);
  }

  public getProviderName() {
    return "timeselector";
  }

  public getDefaultStylesheet() {
    return {
      controlArea: style(csstips.content, {
        fontFamily: StyleConfiguration.getFontFamily(),
        fontSize: "11pt",
        $nest: {
          select: {
            fontFamily: StyleConfiguration.getFontFamily(),
            fontSize: "10pt"
          },
          input: {
            fontFamily: StyleConfiguration.getFontFamily(),
            fontSize: "9pt"
          }
        }
      })
    };
  }

  public initApp(appRootId: string): void {
    const fromControl = new TimeTable(this.fromTime);
    const toControl = new TimeTable(this.toTime);

    const fromView = fromControl.createDom(
      this.cancelButton,
      CANCEL_BUTTON_SIGN
    );
    const toView = toControl.createDom(this.inputButton, INPUT_BUTTON_SIGN);

    const controlDiv = document.getElementById(appRootId);
    if (controlDiv === null) {
      throw new Error("App root not found.");
    }
    this.styleConfiguration.addStyles(controlDiv, "controlArea");
    controlDiv.appendChild(fromView);
    controlDiv.appendChild(toView);

    ControlSwitcher.injectOffSwitch(toView.parentElement);

    this.fromTime.setTimeCheckCallback(this.checkTimes, this);
    this.toTime.setTimeCheckCallback(this.checkTimes, this);
  }

  private checkTimes(s: TimeSelector) {
    const from = s.fromTime.getTimeInMinutes();
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
