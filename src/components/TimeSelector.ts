import * as csstips from "csstips";
import { percent } from "csx/lib";
import { style } from "typestyle";
import { IStylesheetProvider } from "../interfaces/IStylesheetProvider";
import { StyleConfiguration } from "../styles/StyleConfiguration";
import { CONTROL_ITEM_CONFIG,
  CONTROL_ITEM_NEW,
  ControlSwitcher,
  USE_CONTROL_ITEM } from "./ControlSwitcher";
import { ElementFactory } from "./ElementFactory";
import { OverlayControl } from "./OverlayControl";
import { IStyleEditorValues, StyleEditor } from "./StyleEditor";
import { TimeControlWrapper } from "./TimeControlWrapper";
import { TimeTable } from "./TimeTable";
import { Utf16Encode } from "../environment/Utf16Encode";

const INPUT_BUTTON_SIGN: string = Utf16Encode.utf16Encode([0x27BD]); // "➽";
const CANCEL_BUTTON_SIGN: string = Utf16Encode.utf16Encode([0x26D4]); // "⛔";

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
        fontSize: "10pt",
      })
    };
  }

  public initApp(appRootId: string): void {
    this.fromTable = new TimeTable(this.fromTime);
    this.toTable = new TimeTable(this.toTime);

    const fromView = this.fromTable.createDom(
      this.cancelButton,
      CANCEL_BUTTON_SIGN
    );
    const toView = this.toTable.createDom(this.inputButton, INPUT_BUTTON_SIGN);

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

    if (localStorage.getItem(USE_CONTROL_ITEM) === CONTROL_ITEM_CONFIG) {
      this.injectConfigControl(fromView, toView);
    }
  }

  private injectConfigControl(viewLeft: HTMLElement, viewRight: HTMLElement) {
    const overlayID = "time-control-overlay";
    const targetDivOv = ElementFactory.div().withID(overlayID).create();
    viewLeft.insertBefore(targetDivOv, viewLeft.firstChild);
    new OverlayControl(overlayID).init().run();

    const rootID = "time-control-config";
    const targetDiv = ElementFactory.div().withID(rootID).create();
    viewRight.insertBefore(targetDiv, viewRight.firstChild);

    const myValues = this.fromTable.getColorValues();
    new StyleEditor(rootID)
      .init(myValues)
      .whenCancel(() => {
        targetDivOv.remove();
        localStorage.setItem(USE_CONTROL_ITEM, CONTROL_ITEM_NEW);
      })
      .whenOk((values?: IStyleEditorValues) => {
        this.fromTable.setColorValues(values);
        targetDivOv.remove();
        localStorage.setItem(USE_CONTROL_ITEM, CONTROL_ITEM_NEW);
        window.location.replace(window.location.pathname);
      })
      .run();
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
