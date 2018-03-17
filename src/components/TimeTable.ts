import * as csstips from "csstips";
import { center } from "csstips";
import { background, ColorHelper, em, green, important, rgb, white } from "csx";
import { percent } from "csx/lib";
import { cssRaw, style } from "typestyle";
import * as LocalStorageService from "../environment/LocalStorageService";
import { IRGBValue } from "../interfaces/IRGBValue";
import { IStylesheetProvider } from "../interfaces/IStylesheetProvider";
import { StyleConfiguration } from "../styles/StyleConfiguration";
import { ElementFactory } from "./ElementFactory";
import { IStyleEditorValues } from "./StyleEditor";
import { TimeControlWrapper } from "./TimeControlWrapper";
import { TimeSelector } from "./TimeSelector";

const START_HOUR: number = 7;
const TIME_ROWS: number = 4;
const HOUR_COLUMNS: number = 4;

const DARKEN_BY_PERCENT = 5;
const DESATURATE_BY_PERCENT = 70;

const COLOR_CONFIG_STORE = "time-table-color-config";
export const TIME_TABLE_DEFAULT_COLORS: any = {
  "Background": { r: 222, g: 184, b: 35 },
  "Button BG(Hrs)": { r: 0, g: 128, b: 0 },
  "Button Text(Hrs)": { r: 255, g: 255, b: 255 },
  "Button BG(Min)": { r: 0, g: 100, b: 0 },
  "Button Text(Min)": { r: 255, g: 255, b: 255 },
  "Time bar": { r: 0, g: 100, b: 0 }
};

export class TimeTable implements IStylesheetProvider {
  private target: TimeControlWrapper;
  private styleConfiguration: StyleConfiguration;
  private colorValues: IStyleEditorValues;

  constructor(targetControl: TimeControlWrapper) {
    this.target = targetControl;
    this.styleConfiguration = new StyleConfiguration(this);
    this.colorValues = LocalStorageService.getObject(COLOR_CONFIG_STORE)
     || TIME_TABLE_DEFAULT_COLORS;
  }

  public getProviderName() {
    return "timetable";
  }

  public getDefaultStylesheet() {
    return {
      outer: style(csstips.inlineBlock, {
        backgroundColor: this.getCssColorFor("Background").toString(),
        padding: em(0.3),
        fontFamily: StyleConfiguration.getFontFamily(),
        fontSize: "12pt",
        position: "relative",
        overflowY: "auto"
      }),
      container: style({
        fontSize: "10pt",
        fontFamily: StyleConfiguration.getFontFamily(),
        overflow: "hidden",
        display: "inline-block",
        $nest: {
          "& select": {
            fontFamily: StyleConfiguration.getFontFamily(),
            marginTop: em(0.2),
          },
          "& table": {
            borderCollapse: "collapse",
            fontFamily: StyleConfiguration.getFontFamily(),
            fontSize: percent(100),
            color: white.toString()
          },
          "& table th": {
            backgroundColor: important(
              this.getCssColorFor("Time bar").toString())
          },
          "& td": {
            verticalAlign: "middle",
            textAlign: "center",
            padding: em(0.4) + " " + em(0.8)
          },
          "& table tr:first-child": {
            backgroundColor: this.getCssColorFor("Time bar").toString(),
            borderTop: "1px solid " + white.toString()
          },
          "& table th:first-child": {
            borderLeft: "1px solid " + white.toString(),
            textAlign: "left",
            padding: em(0.2) + " " + em(0.4)
          },
          "& table th:last-child": {
            borderRight: "1px solid " + white.toString(),
            padding: em(0.2) + " " + em(0.4)
          },
          "& table tr td": {
            transition: "background-color .2s",
            backgroundColor: this.getCssColorFor("Button BG(Hrs)").toString(),
            color: this.getCssColorFor("Button Text(Hrs)").toString(),
            border: "1px solid " + white.toString(),
            $nest: {
              "&:hover": {
                backgroundColor: this.getCssColorFor("Button BG(Hrs)")
                  .lighten(percent(DARKEN_BY_PERCENT))
                  .toString(),
                fontSize: percent(90),
                cursor: "pointer"
              }
            }
          },
          "& table tr td:nth-child(5)": {
            fontSize: percent(30),
            backgroundColor: this.getCssColorFor("Background").toString(),
            border: 0,
            cursor: "default",
            $nest: {
              "&:hover": {
                fontSize: percent(30),
                backgroundColor: this.getCssColorFor("Background").toString(),
                border: 0,
                cursor: "default"
              }
            }
          },
          "& table tr td:last-child": {
            backgroundColor: this.getCssColorFor("Button BG(Min)").toString(),
            color: this.getCssColorFor("Button Text(Min)").toString(),
            $nest: {
              "&:hover": {
                backgroundColor: this.getCssColorFor("Button BG(Min)")
                  .lighten(percent(DARKEN_BY_PERCENT)).toString()
              }
            }
          }
        }
      }),
      inputButton: style({
        float: "right",
        margin: "0.2em 0.2em 0.2em"
      }),
      invisible: style({
        visibility: "hidden",
      })
    };
  }

  public createDom(btn: HTMLInputElement, btnValue: string): HTMLElement {
    const inputButton: HTMLInputElement = btn || ElementFactory.input()
          .withInputType("button")
          .usingStyleConfig(this.styleConfiguration)
          .withStyles("invisible")
          .create() as HTMLInputElement;

    inputButton.value = btnValue || "?";

    const m = this.changeMinutes;
    const h = this.changeHours;

    return ElementFactory.div()
      .usingStyleConfig(this.styleConfiguration)
      .withStyles("outer")
      .withChildren(
        ElementFactory.div()
          .usingStyleConfig(this.styleConfiguration)
          .withStyles("container")
          .withChildren(
            ElementFactory.table()
              .withChildren(
                ElementFactory.tr()
                  .withChildren(
                    ElementFactory.th()
                      .withAttribute("colspan", "6")
                      .withChildren(
                        this.target.hourControl,
                        ElementFactory.text(":").create(),
                        this.target.minuteControl,
                        ElementFactory.fromElement(inputButton)
                          .usingStyleConfig(this.styleConfiguration)
                          .withStyles("inputButton")
                          .create()
                      )
                      .create()
                  )
                  .create(),
                ElementFactory.tr()
                  .withChildren(
                    this.createTD(7, h),
                    this.createTD(8, h),
                    this.createTD(9, h),
                    this.createTD(10, h),
                    this.createSpaceTD(),
                    this.createTD(0, m),
                  )
                  .create(),
                ElementFactory.tr()
                  .withChildren(
                    this.createTD(11, h),
                    this.createTD(12, h),
                    this.createTD(13, h),
                    this.createTD(14, h),
                    this.createSpaceTD(),
                    this.createTD(15, m)
                  )
                  .create(),
                ElementFactory.tr()
                  .withChildren(
                    this.createTD(15, h),
                    this.createTD(16, h),
                    this.createTD(17, h),
                    this.createTD(18, h),
                    this.createSpaceTD(),
                    this.createTD(30, m)
                  )
                  .create(),
                ElementFactory.tr()
                  .withChildren(
                    this.createTD(19, h),
                    this.createTD(20, h),
                    this.createTD(21, h),
                    this.createTD(22, h),
                    this.createSpaceTD(),
                    this.createTD(45, m)
                  )
                  .create()
              )
              .create()
          )
          .create()
      )
      .create() as HTMLElement;
  }

  public getColorValues(): IStyleEditorValues {
    return this.colorValues;
  }

  public setColorValues(values?: IStyleEditorValues) {
    if (values) {
      this.colorValues = values;
      LocalStorageService.setObject(COLOR_CONFIG_STORE, this.colorValues);
    }
  }

  private createSpaceTD(): HTMLElement {
    return ElementFactory.td()
      .withChildren(ElementFactory.text(String.fromCharCode(160)).create())
      .create() as HTMLElement;
  }

  private createTD(value: number,
                   change: (p: TimeTable, v: string) => void): HTMLElement {
    const vText = (value < 10 ? "0" : "") + value;
    return ElementFactory.td()
      .withChildren(ElementFactory.text(vText).create())
      .withEventListener("click", (() => {
        const parent = this;
        const val = vText;
        return (e: Event) => {
            change(parent, val);
            e.stopPropagation();
        };
    })())
    .create() as HTMLElement;
  }

  private getCssColorFor(
    element: "Background" | "Button BG(Hrs)" | "Button Text(Hrs)"
      | "Time bar" | "Button BG(Min)" | "Button Text(Min)"
  ): ColorHelper {
    const cssColor = this.colorValues[element]
      || TIME_TABLE_DEFAULT_COLORS[element];
    return rgb(cssColor.r, cssColor.g, cssColor.b);
  }

  private changeHours(parent: TimeTable, v: string) {
    parent.target.setHours(v);
  }

  private changeMinutes(parent: TimeTable, v: string) {
    parent.target.setMinutes(v);
  }

  private formatNumber(value: number): string {
    if (value < 0 || value > 99) {
      return "" + value;
    }
    return (value < 10 ? "0" : "") + value;
  }
}
