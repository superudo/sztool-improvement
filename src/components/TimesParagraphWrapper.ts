import { style } from "typestyle";
import { IStylesheetProvider } from "../interfaces/IStylesheetProvider";
import { addStyles } from "../tools/StyleUtils";

const INPUT_BUTTON_TEXT: string = "Eintragen!";
const CANCEL_BUTTON_TEXT: string = "cancel edit!";

export interface ITimeControls {
  fromHours: HTMLSelectElement;
  toHours: HTMLSelectElement;
  fromMinutes: HTMLSelectElement;
  toMinutes: HTMLSelectElement;
}

export class TimesParagraphWrapper implements IStylesheetProvider {
  private paragraph: HTMLParagraphElement;

  constructor(p: HTMLParagraphElement) {
    this.paragraph = p;
  }

  public getProviderName() {
    return "timesparagraphwrapper";
  }

  public getDefaultStylesheet() {
    return {
      hiddenTime: style({
        height: "0",
        visibility: "collapse"
      })
    };
  }

  public hideParagraph() {
      addStyles(this.paragraph, this, "hiddenTime");
  }

  public getParagraphElement(): HTMLParagraphElement {
    return this.paragraph;
  }

  public getSelectControls(): ITimeControls {
    return {
      fromHours: this.findFirstSelect("from_hh"),
      fromMinutes: this.findFirstSelect("from_mm"),
      toHours: this.findFirstSelect("to_hh"),
      toMinutes: this.findFirstSelect("to_mm")
    };
  }

  public getInputButton(): HTMLInputElement {
    return this.getButton(INPUT_BUTTON_TEXT);
  }

  public getCancelButton(): HTMLInputElement {
    return this.getButton(CANCEL_BUTTON_TEXT);
  }

  private findFirstSelect(name: string): HTMLSelectElement {
      const selectsFound = document.getElementsByName(name);
      return (selectsFound.length > 0)
        ? selectsFound[0] as HTMLSelectElement : null;
  }

  private getButton(withValue: string) {
    const inputChildren = this.paragraph.getElementsByTagName("input");
    let buttonFound: HTMLInputElement = null;
    Array.from(inputChildren).forEach((el: HTMLInputElement) => {
      if (
        el.type.toLowerCase() === "button" &&
        el.value.toLowerCase() === withValue.toLowerCase()
      ) {
        buttonFound = el;
      }
    });
    return buttonFound;
  }
}
