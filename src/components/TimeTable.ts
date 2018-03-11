import * as csstips from "csstips";
import * as csx from "csx";
import { style } from "typestyle";
import { IStylesheetProvider } from "../interfaces/IStylesheetProvider";
import { StyleConfiguration } from "../styles/StyleConfiguration";
import { TimeControlWrapper } from "./TimeControlWrapper";
import { TimeSelector } from "./TimeSelector";

const START_HOUR: number = 7;
const TIME_ROWS: number = 4;
const HOUR_COLUMNS: number = 4;

export class TimeTable implements IStylesheetProvider {
    private target: TimeControlWrapper;
    private styleConfiguration: StyleConfiguration;

    constructor(targetControl: TimeControlWrapper) {
        this.target = targetControl;
        this.styleConfiguration = new StyleConfiguration(this);
    }

    public getProviderName() {
        return "timetable";
    }

    public getDefaultStylesheet() {
        return {
            clockline: style({
                backgroundColor: csx.green.toString(),
                padding: 0,
                overflow: "auto",
                $nest: {
                  "&>button": {
                    backgroundColor: csx.color("#4caf50").toString(),
                    border: "1px solid " + csx.green.toString(),
                    color: csx.white.toString(),
                    padding: "0.1em 0.7em",
                    cursor: "pointer",
                    float: "left"
                  },
                  "&>button:hover": {
                    backgroundColor: csx.rgb(64, 128, 64).toString()
                  },
                  "&+button": {
                    clear: "left"
                  },
                  "&>select": {
                    margin: "0.25em auto"
                  }
                }
              }),
              outer: style(csstips.inlineBlock, {
                backgroundColor: csx.burlywood.toString(),
                padding: csx.em(0.3),
                fontFamily: StyleConfiguration.getFontFamily(),
                fontSize: "10pt",
                overflowY: "auto"
              }),
            clockTitle: style({
                color: csx.white.toString(),
                backgroundColor: csx.darkgreen.toString(),
                border: "1px solid " + csx.green.toString(),
                fontWeight: "bold",
                padding: "0.1em 0.2em",
                marginBottom: "0.3em"
              }),
             hours: style({
                float: "left"
              }),
              minutes: style({
                float: "left",
                marginLeft: "0.5em"
              }),
              inputButton: style({
                float: "right",
                margin: "0.2em auto"
              })
          };
    }

    public createDom(btn: HTMLInputElement, btnValue: string): HTMLElement {
        const outerDiv = document.createElement("div");
        this.styleConfiguration.addStyles(outerDiv, "outer");

        const titleLine = document.createElement("div");
        this.styleConfiguration.addStyles(titleLine, "clockline", "clockTitle");

        titleLine.appendChild(this.target.hourControl);
        titleLine.appendChild(new Text(":"));
        titleLine.appendChild(this.target.minuteControl);

        if (btn && btn != null) {
            btn.value = (btnValue) ? btnValue : "???";
            titleLine.appendChild(btn);
            this.styleConfiguration.addStyles(btn, "inputButton");
        }

        outerDiv.appendChild(titleLine);

        const hoursContainer = document.createElement("div");
        for (let i = 0; i < TIME_ROWS; ++i) {
            const hourLine = this.getHourLine(i);
            hoursContainer.appendChild(hourLine);
        }
        this.styleConfiguration.addStyles(hoursContainer, "hours");
        outerDiv.appendChild(hoursContainer);

        const minutesContainer = document.createElement("div");
        for (let i = 0; i < TIME_ROWS; ++i) {
            const minuteLine = this.getMinuteLine(i);
            minutesContainer.appendChild(minuteLine);
        }
        this.styleConfiguration.addStyles(minutesContainer, "minutes");
        outerDiv.appendChild(minutesContainer);

        return outerDiv;
    }

    private getMinuteLine(index: number): HTMLElement {
        const minuteLine = document.createElement("div");
        this.styleConfiguration.addStyles(minuteLine, "clockline");
        const minuteButton = document.createElement("button");
        const btnValue = this.formatNumber(index * 15);
        minuteButton.innerText = btnValue;
        minuteButton.value = btnValue;
        minuteButton.type = "button";
        minuteButton.addEventListener("click", (e: Event) => {
            this.changeMinutes(e);
            e.stopPropagation();
        });
        minuteLine.appendChild(minuteButton);
        return minuteLine;
    }

    private getHourLine(timeRow: number): HTMLElement {
        const hourLine = document.createElement("div");
        this.styleConfiguration.addStyles(hourLine, "clockline");
        for (let i = 0; i < HOUR_COLUMNS; ++i) {
            const hourButton = document.createElement("button");
            const btnValue = this.formatNumber(
                START_HOUR + TIME_ROWS * timeRow + i);
            hourButton.innerText = btnValue;
            hourButton.value = btnValue;
            hourButton.type = "button";
            hourButton.addEventListener("click", (e: Event) => {
                this.changeHours(e);
                e.stopPropagation();
            });
            hourLine.appendChild(hourButton);
        }
        return hourLine;
    }

    private changeHours(e: Event) {
        const newHourText = (e.target as HTMLButtonElement).value;
        this.target.setHours(newHourText);
    }

    private changeMinutes(e: Event) {
        const newMinuteText = (e.target as HTMLButtonElement).value;
        this.target.setMinutes(newMinuteText);
    }

    private formatNumber(value: number): string {
        if (value < 0 || value > 99) {
            return "" + value;
        }
        return ((value < 10) ? "0" : "") + value;
    }
}
