import { ColorHelper, em, lightblue, percent } from "csx/lib";
import { style } from "typestyle";
import { IRunnable } from "../interfaces/IRunnable";
import { StyleConfiguration } from "../styles/StyleConfiguration";
import { AbstractComponent } from "./AbstractComponent";
import { ElementFactory } from "./ElementFactory";
import { IObserver } from "../interfaces/IObserver";
import { IObservable } from "../interfaces/IObservable";
import { IInitializable } from "../interfaces/IInitializable";

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
        .withStyles("slidercontainer")
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
            width: em(6)
          },
          "&>input[type=text]": {
            fontSize: percent(90),
            width: em(2.25),
            marginRight: 0
          }
        }
      })
    };
  }

  public getProviderName(): string {
    return this.rootID;
  }

  private assertNumberInRange(v: number): number {
    return Math.min(Math.max(this.min, v), this.max);
  }
}
