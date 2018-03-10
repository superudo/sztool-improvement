import { style } from "typestyle";
import { PersistentStyle } from "../styles/PersistentStyle";

const INPUT_BUTTON_TEXT: string = "Eintragen!";
const CANCEL_BUTTON_TEXT: string = "cancel edit!";

export interface ITimeControls {
  fromHours: HTMLSelectElement;
  toHours: HTMLSelectElement;
  fromMinutes: HTMLSelectElement;
  toMinutes: HTMLSelectElement;
}

export class TimesParagraphWrapper {
  private paragraph: HTMLParagraphElement;

  constructor(p: HTMLParagraphElement) {
    this.paragraph = p;
  }

  public hideParagraph() {
    this.paragraph.classList.add(PersistentStyle.hiddenTime);
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
