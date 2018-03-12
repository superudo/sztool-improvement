import { normalize, setupPage } from "csstips";

// tslint:disable-next-line:max-line-length
import { ControlSwitcher, USE_CONTROL_ITEM, CONTROL_ITEM_NEW, CONTROL_ITEM_ORIGINAL, CONTROL_ITEM_CONFIG } from "../components/ControlSwitcher";
import { TimeControlWrapper } from "../components/TimeControlWrapper";
import { TimeSelector } from "../components/TimeSelector";
import { TimesParagraphWrapper } from "../components/TimesParagraphWrapper";
import * as LocalStorageService from "../environment/LocalStorageService";

export interface IRunnnable {
  run: () => void;
}

export class TimeSelectorApp {
  private timesParagraphWrapper: TimesParagraphWrapper;
  private applicationID: string;
  private that: TimeSelectorApp;

  constructor(appElementID: string) {
    this.applicationID = appElementID;
    this.that = this;
  }

  public init(): IRunnnable {
    if (!LocalStorageService.isSupported) {
      throw new Error("Local storage not supported.");
    }

    this.timesParagraphWrapper = this.getTimesParagraph();
    return this.that;
  }

  public run() {
    if (this.showTimeSelector()) {
      normalize();
      setupPage(this.applicationID);
      this.prepareApplicationRoot(
        this.timesParagraphWrapper.getParagraphElement()
      );
      this.injectControl();
    } else {
      this.injectControlSwitch();
    }
  }

  private getTimesParagraph(): TimesParagraphWrapper {
    if (document.getElementsByClassName("times").length === 0) {
      throw new Error('Target element witth class "times" not found.');
    }

    return new TimesParagraphWrapper(document.getElementsByClassName(
      "times"
    )[0] as HTMLParagraphElement);
  }

  private prepareApplicationRoot(insertAfter: HTMLElement) {
    const appRoot = document.createElement("div");
    appRoot.id = "app-root";
    insertAfter.parentNode.insertBefore(appRoot, insertAfter.nextSibling);
  }

  private injectControl() {
    const controls = this.timesParagraphWrapper.getSelectControls();
    const fromControl = new TimeControlWrapper(controls.fromHours, controls.fromMinutes);
    const toControl = new TimeControlWrapper(controls.toHours, controls.toMinutes);
    new TimeSelector(
      fromControl, toControl,
      this.timesParagraphWrapper.getInputButton(),
      this.timesParagraphWrapper.getCancelButton()
    ).initApp("app-root");

    this.timesParagraphWrapper.hideParagraph();
  }

  private showTimeSelector(): boolean {
    return LocalStorageService.hasItem(USE_CONTROL_ITEM) 
      && localStorage.getItem(USE_CONTROL_ITEM) !== CONTROL_ITEM_ORIGINAL;
  }

  private injectControlSwitch(): void {
    ControlSwitcher.injectOnSwitch(
      this.timesParagraphWrapper.getParagraphElement()
    );
  }
}
