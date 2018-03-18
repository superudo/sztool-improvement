import * as csstips from "csstips";
import { center } from "csstips";
import { aquamarine, color, ColorHelper, em, gray, linen, percent, rgb } from "csx";
import { style } from "typestyle";
import { IInitializable } from "../interfaces/IInitializable";
import { IObservable } from "../interfaces/IObservable";
import { IObserver } from "../interfaces/IObserver";
import { IRGBValue } from "../interfaces/IRGBValue";
import { IRunnable } from "../interfaces/IRunnable";
import { StyleConfiguration } from "../styles/StyleConfiguration";
import { ColorPicker } from "../vendor/FlexiColorPicker/ColorPicker";
import { AbstractComponent } from "./AbstractComponent";
import { ElementFactory } from "./ElementFactory";
import { RangeSlider } from "./RangeSlider";
import { TIME_TABLE_DEFAULT_COLORS } from "./TimeTable";

export interface IStyleEditorValues {
  Background: IRGBValue;
  "Time bar": IRGBValue;
  "Button BG(Hrs)": IRGBValue;
  "Button Text(Hrs)": IRGBValue;
  "Button BG(Min)": IRGBValue;
  "Button Text(Min)": IRGBValue;
  [key: string]: IRGBValue;
}

const STYLE_EDITOR_VALUE_KEYS = [
  "Background",
  "Time bar",
  "Button BG(Hrs)",
  "Button Text",
  "Button BG(Min)",
  "Button Text(Min)"
];

const OK_TEXT = "✔";
const CANCEL_TEXT = "✘";

const COLOR_EXAMPLE_SIZE: string = "18px";

export class StyleEditor extends AbstractComponent implements IObservable {
  private styleConfiguration: StyleConfiguration;

  private values: IStyleEditorValues;
  private lastSelectedOption: string;

  private selector: HTMLSelectElement;
  private colorPicker: ColorPicker;
  private colorValueInput: HTMLInputElement;
  private colorExample: HTMLElement;

  private observers: IObserver[];

  constructor(rootID: string) {
    super(rootID);
    this.styleConfiguration = new StyleConfiguration(this);
    this.observers = [];
  }

  public registerObserver(o: IObserver) {
    this.observers.push(o);
  }

  public removeObserver(o: IObserver) {
    for (let i = 0; i < this.observers.length; ++i) {
      if (this.observers[i] === o) {
        this.observers.splice(i, 1);
      }
    }
  }

  public notifyObservers() {
    for (const o of this.observers) {
      o.receiveNotification(this.values);
    }
  }

  public init(colorValues: IStyleEditorValues): IInitializable {
    this.values = colorValues;
    STYLE_EDITOR_VALUE_KEYS.forEach((key: string) => {
      if (this.values[key] === undefined) {
        this.values[key] = TIME_TABLE_DEFAULT_COLORS[key];
      }
    });
    return super.init();
  }

  public run(): void {
    super.run();
  }

  public getProviderName(): string {
    return this.rootID;
  }

  public getDefaultStylesheet(): any {
    return {
      appContainer: style({
        padding: em(0.2),
        display: "inline-block",
        backgroundColor: linen.toString(),
        margin: 0,
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      }),
      // new styles
      colorTargetSelectionOuter: style({
        fontSize: percent(98),
        width: percent(100),
        margin: em(0.1),
        display: "inline-block",
        $nest: {
          "& select": {
            fontSize: "9pt",
            float: "left",
            width: em(8.5)
          }
        }
      }),
      colorExampleOuter: style({
        fontSize: percent(98),
        backgroundColor: gray.toString(),
        height: COLOR_EXAMPLE_SIZE,
        width: COLOR_EXAMPLE_SIZE,
        borderRadius: COLOR_EXAMPLE_SIZE,
        marginRight: em(0.3),
        marginLeft: em(0.2),
        display: "inline-block",
        position: "relative",
        float: "left"
      }),
      colorExampleInner: style({
        fontSize: percent(98),
        backgroundColor: gray.toString(),
        height: COLOR_EXAMPLE_SIZE,
        width: COLOR_EXAMPLE_SIZE,
        borderRadius: COLOR_EXAMPLE_SIZE
      }),
      colorSelectorOuter: style({
        display: "flex",
        alignItems: "flex-end",
        flexDirection: "row",
        paddingLeft: em(0.2),
        $nest: {
          "& input": {
            fontSize: "8pt",
            width: em(4.5),
            height: em(0.9),
            marginLeft: em(0.5)
          },
          "& a": {
            fontSize: "10pt",
            fontWeight: "bold",
            textDecoration: "none",
            cursor: "pointer",
            float: "right",
          }
        }
      }),
      dialogButtonContainer: style({
        display: "inline-block",
        paddingRight: em(0.1),
        float: "right",
        $nest: {
          "& a": {
            fontSize: "9pt",
            textDecoration: "none",
            borderStyle: "solid",
            borderColor: "black",
            borderWidth: "1px",
            padding: "0 0.4em",
            marginLeft: em(0.3),
            display: "inline-block",
            position: "relative",
            cursor: "pointer",
            $nest: {
              "&:hover": {
                backgroundColor: aquamarine.toString()
              }
            }
          }
        }
      })
    };
  }

  public renderDOM(appRoot: HTMLElement) {
    this.styleConfiguration.addStyles(appRoot, "appContainer");

    appRoot.appendChild(this.createSelectorDiv());
    appRoot.appendChild(this.createColorPickerDiv());

    this.selector.selectedIndex = 0;
    this.lastSelectedOption = this.getSelectedColorOption();
    const c = this.getSelectedOptionsColor();
    this.updateColorControls(rgb(c.r, c.g, c.b).toHexString(), c);
    this.colorPicker.setRgb(c);

  }

  private createSelectorDiv(): HTMLElement {
    return ElementFactory.div()
      .usingStyleConfig(this.styleConfiguration)
      .withStyles("colorTargetSelectionOuter")
      .withChildren(
        this.createColorExample(),
        this.createElementSelector(),
        this.createButtonDiv()
      )
      .withID("B1")
      .create() as HTMLElement;
  }

  private createColorPickerDiv(): HTMLElement {
    return ElementFactory.div()
      .usingStyleConfig(this.styleConfiguration)
      .withStyles("colorSelectorOuter")
      .withChildren(
        this.createColorPicker(),
        this.createColorInput()
      )
      .withID("C1")
      .create() as HTMLElement;
  }

  private getSelectedOptionsColor(): IRGBValue {
    const key = this.selector.selectedOptions[0].value;
    const selectedColor = this.values[key];
    return selectedColor;
  }

  private createColorExample(): HTMLElement {
    this.colorExample = ElementFactory.div()
      .usingStyleConfig(this.styleConfiguration)
      .withStyles("colorExampleInner")
      .withID("colorExampleInner")
      .create() as HTMLElement;

    return ElementFactory.link()
      .withHref("#")
      .usingStyleConfig(this.styleConfiguration)
      .withStyles("colorExampleOuter")
      .withChildren(this.colorExample)
      .create() as HTMLElement;
  }

  private createOKButton(): HTMLElement {
    return ElementFactory.link()
      .withHref("#")
      .usingStyleConfig(this.styleConfiguration)
      .withStyles("styleDialogButton")
      .withChildren(ElementFactory.text(OK_TEXT).create())
      .withEventListener(
        "click",
        (() => {
          const context: StyleEditor = this;
          return (e: Event) => {
            context.notifyOk(context.values);
            e.stopPropagation();
          };
        })()
      )
      .create() as HTMLElement;
  }

  private createCancelButton(): HTMLElement {
    return ElementFactory.link()
      .withHref("#")
      .usingStyleConfig(this.styleConfiguration)
      .withStyles("styleDialogButton")
      .withChildren(ElementFactory.text(CANCEL_TEXT).create())
      .withEventListener("click", (() => {
        const context: StyleEditor = this;
        return (e: Event) => {
          context.notifyCancel();
          e.stopPropagation();
        };
      })())
      .create() as HTMLElement;
  }

  private createElementSelector(): HTMLElement {
    const optionArray: HTMLElement[] = [];
    Object.keys(this.values).forEach(
      (value: string, index: number, array: string[]) => {
        const optionElement = ElementFactory.option()
          .withName(value)
          .create();
        optionArray.push(optionElement as HTMLElement);
      }
    );

    const selectFactory = ElementFactory.select();
    optionArray.forEach((element) => {
      selectFactory.withChildren(element);
    });

    selectFactory.withEventListener("change",
      (() => {
        const context: StyleEditor = this;
        return (e: Event) => {
          context.lastSelectedOption = this.getSelectedColorOption();
          const c = context.getSelectedOptionsColor();
          context.updateColorControls(rgb(c.r, c.g, c.b).toHexString(), c);
          context.colorPicker.setRgb(c);
          e.stopPropagation();
        };
      })()
    );

    this.selector = selectFactory.create() as HTMLSelectElement;
    return this.selector;
  }

  private createColorInput(): HTMLElement {
    this.colorValueInput = ElementFactory.input()
      .withInputType("text")
      .withID("selected-color-hex")
      .create() as HTMLInputElement;

    return ElementFactory.div()
      .withChildren(
        this.colorValueInput,
        ElementFactory.br().create(),
        this.createTransferColorButton()
      ).create() as HTMLElement;
  }

  private createTransferColorButton(): HTMLElement {
    return ElementFactory.link()
      .withHref("#")
      .withChildren(
        ElementFactory.text("🢀").create()
      )
      .withEventListener("click", (() => {
        const context: StyleEditor = this;
        return (e: Event) => {
          const v = context.colorValueInput.value;
          const newColor = color(v);
          const newColorRgb = {
            r: newColor.red(), g: newColor.green(), b: newColor.green()
          };

          this.values[this.getSelectedColorOption()] = newColorRgb;
          this.colorExample.style.backgroundColor = newColor.toHexString();
          this.colorPicker.setRgb(newColorRgb);
          e.stopPropagation();
        };
      })())
      .create() as HTMLElement;
  }

  private createColorPicker(): HTMLElement {
    const pickerContainer = ElementFactory.div()
      .withID("styleeditor-color-picker")
      .create() as HTMLElement;
    pickerContainer.classList.add("cp", "cp-small");
    pickerContainer.style.clear = "left";

    this.colorPicker = new ColorPicker(
      pickerContainer,
      (() => {
        const context: StyleEditor = this;
        return (hexP: string, hsvP: any, rgbP: any) => {
          context.updateColorControls(hexP, rgbP);
        };
      })()
    );

    return pickerContainer;
  }

  private getSelectedColorOption(): string {
    return this.selector.options[this.selector.selectedIndex].value;
  }

  private createButtonDiv(): HTMLElement {
    return ElementFactory.div()
      .usingStyleConfig(this.styleConfiguration)
      .withStyles("dialogButtonContainer")
      .withChildren(this.createCancelButton(), this.createOKButton())
      .create() as HTMLElement;
  }

  private updateColorControls(hexP: string, rgbP: IRGBValue) {
    this.values[this.getSelectedColorOption()] = rgbP;
    this.colorExample.style.backgroundColor = hexP;
    this.colorValueInput.value = hexP;
  }
}
