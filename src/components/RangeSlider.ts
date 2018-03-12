import { ColorHelper, em, lightblue, percent } from "csx/lib";
import { cssRaw, style } from "typestyle";
import { IInitializable } from "../interfaces/IInitializable";
import { IObservable } from "../interfaces/IObservable";
import { IObserver } from "../interfaces/IObserver";
import { IRunnable } from "../interfaces/IRunnable";
import { StyleConfiguration } from "../styles/StyleConfiguration";
import { AbstractComponent } from "./AbstractComponent";
import { ElementFactory } from "./ElementFactory";

export interface IRangeSliderConfig {
  value: number;
  min: number;
  max: number;
}

export class RangeSlider extends AbstractComponent implements IObservable {
  private styleConfig: StyleConfiguration;
  private range: HTMLInputElement;
  private text: HTMLInputElement;
  private min: number;
  private max: number;
  private value: number;
  private observers: IObserver[];

  public constructor(rootID: string) {
      super(rootID);
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
          o.receiveNotification(this);
      }
  }

  public renderDOM(div: HTMLElement): void {
    this.range = ElementFactory.input()
      .withInputType("range")
      .withRange(this.min, this.max)
      .withValue(this.value)
      .withName(this.rootID)
      .create() as HTMLInputElement;

    this.text = ElementFactory.input()
      .withInputType("text")
      .withValue(this.value)
      .create() as HTMLInputElement;

    this.range.addEventListener("input", (e: Event) => {
      this.text.value = (e.target as HTMLInputElement).value;
      this.notifyObservers();
      e.stopPropagation();
    });

    this.text.addEventListener("blur", (e: Event) => {
      let currentValue = (e.target as HTMLInputElement).valueAsNumber;
      currentValue = this.assertNumberInRange(currentValue);
      this.range.value = currentValue.toString();
      this.range.dispatchEvent(new Event("input"));
      e.stopPropagation();
    });

    div.appendChild(
      ElementFactory.div()
        .usingStyleConfig(this.styleConfig)
        .withStyles("slidercontainer", "slider")
        .withChildren(
            this.range,
            this.text)
        .create()
    );
  }

  public init(cfg: IRangeSliderConfig): IInitializable {
    this.styleConfig = new StyleConfiguration(this);
    this.min = cfg.min;
    this.max = cfg.max;
    this.value = cfg.value;
    return super.init();
  }

  public setValue(v: number) {
    const ranged = this.assertNumberInRange(v);
    this.text.value = ranged.toString();
    this.range.value = ranged.toString();
    this.notifyObservers();
  }

  public getCurrentValue(): number {
    return this.range.valueAsNumber;
  }

  public getNumber(): number {
    return this.getCurrentValue();
  }

  public getDefaultStylesheet(): any {
    return {
      slidercontainer: style({
        padding: "0 " + em(0.5),
        textAlign: "right",
        display: "flex",
        justifyContent: "center",
        $nest: {
          "&>input[type=range]": {
            marginRight: em(0.35),
            width: em(6),
            height: em(1.4),
          },
          "&>input[type=text]": {
            fontSize: percent(90),
            width: em(2.25),
            marginRight: 0
          }
        }
      }),
/*
      slider: cssRaw(`
      input[type=range] {
        -webkit-appearance: none;
        width: 100%;
        margin: 5px 0;
        background-color: transparent;
      }
      input[type=range]:focus {
        outline: none;
      }
      input[type=range]::-webkit-slider-runnable-track {
        width: 100%;
        height: 2px;
        cursor: pointer;
        box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        background: #008000;
        border-radius: 2px;
        border: 0.1px solid #010101;
      }
      input[type=range]::-webkit-slider-thumb {
        box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        border: 1px solid #000000;
        height: 12px;
        width: 12px;
        border-radius: 6px;
        background: #ffffff;
        cursor: pointer;
        -webkit-appearance: none;
        margin-top: -5.1px;
      }
      input[type=range]:focus::-webkit-slider-runnable-track {
        background: #00b300;
      }
      input[type=range]::-moz-range-track {
        width: 100%;
        height: 2px;
        cursor: pointer;
        box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        background: #008000;
        border-radius: 2px;
        border: 0.1px solid #010101;
      }
      input[type=range]::-moz-range-thumb {
        box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        border: 1px solid #000000;
        height: 12px;
        width: 12px;
        border-radius: 6px;
        background: #ffffff;
        cursor: pointer;
      }
      input[type=range]::-ms-track {
        width: 100%;
        height: 2px;
        cursor: pointer;
        background: transparent;
        border-color: transparent;
        color: transparent;
      }
      input[type=range]::-ms-fill-lower {
        background: #004d00;
        border: 0.1px solid #010101;
        border-radius: 4px;
        box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
      }
      input[type=range]::-ms-fill-upper {
        background: #008000;
        border: 0.1px solid #010101;
        border-radius: 4px;
        box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
      }
      input[type=range]::-ms-thumb {
        box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        border: 1px solid #000000;
        height: 12px;
        width: 12px;
        border-radius: 6px;
        background: #ffffff;
        cursor: pointer;
        height: 2px;
      }
      input[type=range]:focus::-ms-fill-lower {
        background: #008000;
      }
      input[type=range]:focus::-ms-fill-upper {
        background: #00b300;
      }
      `)
*/
    };
  }

  public getProviderName(): string {
    return this.rootID;
  }

  private assertNumberInRange(v: number): number {
    return Math.min(Math.max(this.min, v), this.max);
  }
}
