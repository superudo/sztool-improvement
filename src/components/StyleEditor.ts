import * as csstips from "csstips";
import { em, lightblue, percent, rgb } from "csx/lib";
import { style } from "typestyle";
import { IRunnable } from "../interfaces/IRunnable";
import { StyleConfiguration } from "../styles/StyleConfiguration";
import { AbstractComponent, IObserver } from "./AbstractComponent";
import { ElementFactory } from "./ElementFactory";
import { RangeSlider } from "./RangeSlider";

interface IRGBValue {
  r: number;
  g: number;
  b: number;
}

export class StyleEditor extends AbstractComponent implements IObserver {
  private styleConfiguration: StyleConfiguration;

  private redSlider: RangeSlider;
  private greenSlider: RangeSlider;
  private blueSlider: RangeSlider;

  private rgb: IRGBValue;

  constructor(rootID: string) {
    super(rootID);
    this.styleConfiguration = new StyleConfiguration(this);
  }

  public init(rgbValue: IRGBValue): IRunnable {
    this.rgb = rgbValue;
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
        backgroundColor: lightblue.toString(),
        margin: 0,
        position: "absolute",
        width: percent(100),
        height: percent(100),
        top: 0,
        left: 0
      }),
      form: style({
        display: "flex",
        flexDirection: "column",
        fontSize: "9pt",
        fontFamily: StyleConfiguration.getFontFamily(),
        $nest: {
          "p": {
            margin: em(0.3)
          },
          "input": {
            height: em(1.4)
          },
          "input[type=range]": {
            width: percent(50)
          },
          "label": {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }
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
        width: percent(100),
        padding: "0 " + em(0.5),
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
    const newColor: IRGBValue = {
      r: this.redSlider.getCurrentValue(),
      g: this.greenSlider.getCurrentValue(),
      b: this.blueSlider.getCurrentValue(),
    };

    parent.visualizeColor(newColor);
  }

  public renderDOM(appRoot: HTMLElement) {
    this.styleConfiguration.addStyles(appRoot, "appContainer");

    const rSliderDiv = ElementFactory.div().withID("r-slider").create();
    const gSliderDiv = ElementFactory.div().withID("g-slider").create();
    const bSliderDiv = ElementFactory.div().withID("b-slider").create();

    appRoot.appendChild(
      ElementFactory.form()
        .usingStyleConfig(this.styleConfiguration)
        .withStyles("form")
        .withChildren(
          ElementFactory.paragraph()
            .withChildren(
              ElementFactory.label()
                .withChildren(
                  ElementFactory.text("Element").create(),
                  ElementFactory.select()
                    .withChildren(
                      ElementFactory.option()
                        .withName("Background")
                        .create(),
                      ElementFactory.option()
                        .withName("Timebar")
                        .create(),
                      ElementFactory.option()
                        .withName("Button Text")
                        .create(),
                        ElementFactory.option()
                        .withName("Button color")
                        .create(),
                    )
                    .create()
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
                    .withText("☑")
                    .withName("ok")
                    .create(),
                  ElementFactory.button()
                    .withText("☒")
                    .withName("cancel")
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

    this.redSlider.init({min: 0, max: 255, value: this.rgb.r}).run();
    this.greenSlider.init({min: 0, max: 255, value: this.rgb.g}).run();
    this.blueSlider.init({min: 0, max: 255, value: this.rgb.b}).run();

    this.redSlider.registerObserver(this);
    this.greenSlider.registerObserver(this);
    this.blueSlider.registerObserver(this);

    this.visualizeColor();
  }

  public receiveNotification<T>(message: T) {
    const newColor = {
        r: this.redSlider.getCurrentValue(),
        g: this.greenSlider.getCurrentValue(),
        b: this.blueSlider.getCurrentValue()
    };
    this.visualizeColor(newColor);
  }

  private visualizeColor(colorValue?: IRGBValue) {
    if (!colorValue) {
      this.visualizeColor(this.rgb);
    } else {
      const currentColor = rgb(colorValue.r, colorValue.g, colorValue.b);
      this.rootDiv.style.backgroundColor = currentColor.toString();
    }
  }
}
