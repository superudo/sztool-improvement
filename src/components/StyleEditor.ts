import * as csstips from "csstips";
import { ColorHelper, em, linen, percent, rgb } from "csx";
import { style } from "typestyle";
import { IInitializable } from "../interfaces/IInitializable";
import { IObservable } from "../interfaces/IObservable";
import { IObserver } from "../interfaces/IObserver";
import { IRGBValue } from "../interfaces/IRGBValue";
import { IRunnable } from "../interfaces/IRunnable";
import { StyleConfiguration } from "../styles/StyleConfiguration";
import { AbstractComponent } from "./AbstractComponent";
import { ElementFactory } from "./ElementFactory";
import { RangeSlider } from "./RangeSlider";

export interface IStyleEditorValues {
  "Background": IRGBValue;
  "Time bar": IRGBValue;
  "Button BG": IRGBValue;
  "Button Text": IRGBValue;
  [key: string]: IRGBValue;
}

const OK_TEXT = "✔";
const CANCEL_TEXT = "✘";

export class StyleEditor
  extends AbstractComponent
  implements IObserver, IObservable {

  private styleConfiguration: StyleConfiguration;

  private values: IStyleEditorValues;
  private lastSelectedOption: string;

  private selector: HTMLSelectElement;
  private redSlider: RangeSlider;
  private greenSlider: RangeSlider;
  private blueSlider: RangeSlider;

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
    return super.init();
  }

  public run(): void {
    super.run();
  }

  public getProviderName(): string {
    return this.rootID;
  }

  public getDefaultStylesheet(): object {
    return {
      appContainer: style({
        padding: em(0.2),
        display: "flex",
        backgroundColor: linen.toString(),
        margin: 0,
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      }),
      form: style({
        display: "flex",
        flexDirection: "column",
        fontSize: "9pt",
        fontFamily: StyleConfiguration.getFontFamily(),
        width: percent(100),
        $nest: {
          "& p": {
            margin: em(0.3),
          },
          "& input": {
            height: em(1.4)
          },
          "& select": {
            fontSize: percent(90),
            height: em(1.4),
          },
          "& label": {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          },
          "& button": {
            height: em(1.5)
          },
        }
      }),
      slidercontainer: style({
        padding: "0 " + em(0.5),
        textAlign: "right",
        display: "flex",
        justifyContent: "center",
        $nest: {
          "&>input[type=range]": {
            marginRight: em(0.35),
            width: em(6)
          },
          "&>input[type=text]": {
            height: em(1),
            width: em(2),
            marginRight: 0
          }
        }
      }),
      buttoncontainer: style({
        fontSize: percent(90),
        width: percent(100),
        padding: "0 " + em(0.3),
        textAlign: "right",
        $nest: {
          "&>button": {
            marginRight: em(0.35)
          },
          "&>button::last-child": {
            marginRight: 0
          }
        }
      })
    };
  }

  public onChangeCallback(e: Event, parent: StyleEditor) {
    parent.visualizeColor(parent.getSliderValues());
  }

  public renderDOM(appRoot: HTMLElement) {
    this.styleConfiguration.addStyles(appRoot, "appContainer");

    const rSliderDiv = ElementFactory.div().withID("r-slider").create();
    const gSliderDiv = ElementFactory.div().withID("g-slider").create();
    const bSliderDiv = ElementFactory.div().withID("b-slider").create();

    const optionArray: HTMLElement[] = [];
    Object.keys(this.values).forEach(
      (value: string, index: number, array: string[]) => {
      const optionElement = ElementFactory.option()
        .withName(value)
        .create();
      optionArray.push(optionElement as HTMLElement);
    });

    const selectFactory = ElementFactory.select();
    optionArray.forEach((element) => {
      selectFactory.withChildren(element);
    });

    selectFactory.withEventListener("input", (() => {
      const parentControl: StyleEditor = this;
      return (e: Event) => {
        const sel = e.target as HTMLSelectElement;
        const newSelectedOption = sel.selectedOptions[0].value;
        if (newSelectedOption !== parentControl.lastSelectedOption) {
          const colorSet = parentControl.getSliderValues();
          parentControl.values[parentControl.lastSelectedOption] = colorSet;
          parentControl.lastSelectedOption = newSelectedOption;
          const col = parentControl.values[newSelectedOption];
          parentControl.setSliderValues(col);
        }
        e.stopPropagation();
      };
    })()
  );

    this.selector = selectFactory.create() as HTMLSelectElement;

    appRoot.appendChild(
      ElementFactory.form()
        .usingStyleConfig(this.styleConfiguration)
        .withStyles("form")
        .withChildren(
          ElementFactory.paragraph()
            .withChildren(
              ElementFactory.label()
                .withChildren(
                  ElementFactory.span()
                    .usingStyleConfig(this.styleConfiguration)
                    .withChildren(
                      ElementFactory.text(
                        Array(17).join(String.fromCharCode(160)))
                        .create())
                    .withID("styleEdit-example")
                    .create(),
                    this.selector
                )
                .create()
            )
            .create(),
          ElementFactory.paragraph()
            .withChildren(
              ElementFactory.label()
                .withChildren(
                    ElementFactory.text("Red").create(),
                    rSliderDiv
                )
                .create()
            )
            .create(),
          ElementFactory.paragraph()
            .withChildren(
              ElementFactory.label()
                .withChildren(
                  ElementFactory.text("Green").create(),
                  gSliderDiv
                )
                .create()
            )
            .create(),
          ElementFactory.paragraph()
            .withChildren(
              ElementFactory.label()
                .withChildren(
                    ElementFactory.text("Blue").create(),
                    bSliderDiv
                )
                .create()
            )
            .create(),
          ElementFactory.paragraph()
            .withChildren(
              ElementFactory.div()
                .usingStyleConfig(this.styleConfiguration)
                .withStyles("buttoncontainer")
                .withChildren(
                  ElementFactory.text(String.fromCharCode(160)).create(),
                  ElementFactory.button()
                    .withText(OK_TEXT)
                    .withName("ok")
                    .withEventListener("click", (() => {
                      const parentControl: StyleEditor = this;
                      return (e: Event) => {
                        parentControl.setSelectedOptionsColorFromSliders();
                        parentControl.notifyOk(parentControl.values);
                        e.stopPropagation();
                      };
                    })()
                  ).create(),
                  ElementFactory.button()
                    .withText(CANCEL_TEXT)
                    .withName("cancel")
                    .withEventListener("click", (() => {
                      const parentControl: StyleEditor = this;
                      return (e: Event) => {
                        parentControl.notifyCancel();
                        e.stopPropagation();
                      };
                    })())
                    .create()
                )
                .create()
            )
            .create()
        )
        .create()
    );

    this.redSlider = new RangeSlider("r-slider");
    this.greenSlider = new RangeSlider("g-slider");
    this.blueSlider = new RangeSlider("b-slider");

    this.lastSelectedOption = Object.keys(this.values)[0];
    const initColor = this.values[this.lastSelectedOption];
    this.initializeSliders(initColor);

    this.redSlider.registerObserver(this);
    this.greenSlider.registerObserver(this);
    this.blueSlider.registerObserver(this);

    this.visualizeColor(initColor);
  }

  public receiveNotification<T>(message: T) {
    this.visualizeColor(this.getSliderValues());
  }

  public setSelectedOptionsColorFromSliders() {
    const colorSet: IRGBValue = this.getSliderValues();
    this.values[this.lastSelectedOption] = colorSet;
  }

  private getSelectedOptionsColor(): IRGBValue {
    const key = this.selector.selectedOptions[0].value;
    const selectedColor = this.values[key];
    return selectedColor;
  }

  private getSliderValues(): IRGBValue {
    return {
      r: this.redSlider.getCurrentValue(),
      g: this.greenSlider.getCurrentValue(),
      b: this.blueSlider.getCurrentValue()
    };
  }

  private setSliderValues(color: IRGBValue) {
    this.redSlider.setValue(color.r);
    this.greenSlider.setValue(color.g);
    this.blueSlider.setValue(color.b);
  }

  private initializeSliders(selectedColor: IRGBValue) {
    this.redSlider.init({min: 0, max: 255, value: selectedColor.r}).run();
    this.greenSlider.init({min: 0, max: 255, value: selectedColor.g}).run();
    this.blueSlider.init({min: 0, max: 255, value: selectedColor.b}).run();
  }

  private visualizeColor(colorValue?: IRGBValue) {
    if (!colorValue) {
      this.visualizeColor(this.getSelectedOptionsColor());
    }

    const currentColor = rgb(colorValue.r, colorValue.g, colorValue.b);
    document.getElementById("styleEdit-example")
      .style.backgroundColor = currentColor.toString();
  }
}
