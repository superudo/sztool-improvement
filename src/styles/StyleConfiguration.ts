import * as csstips from "csstips";
import * as csx from "csx";
import { style } from "typestyle";
import * as LocalStorageService from "../environment/LocalStorageService";

export class StyleConfiguration {

    public static getFontFamily(): string[] {
        return [
            "Segoe UI",
            "Tahoma",
            "Geneva",
            "Verdana",
            "sans-serif"
          ];
    }

    private static STYLE_KEY: string = "userStyle";

    private styleDefinition: any;

    constructor() {
        this.styleDefinition =
            LocalStorageService.getObject(StyleConfiguration.STYLE_KEY)
            || this.getDefaultStyle();
    }

    public addStyles(el: HTMLElement, ...cssStlyes: string[]) {
        for (const cssStyle of cssStlyes) {
            el.classList.add(this.getStyle(cssStyle));
        }
    }

    public removeStyles(el: HTMLElement, ...cssStyles: string[]) {
        for (const cssStyle of cssStyles) {
            el.classList.remove(this.getStyle(cssStyle));
        }
    }

    public saveStyle(withReload?: boolean) {
        LocalStorageService.setObject(
            StyleConfiguration.STYLE_KEY, this.styleDefinition);
        if (withReload) {
            window.location.replace(window.location.pathname);
        }
    }

    private getStyle(name: string): string {
        return this.styleDefinition[name];
    }

    private getDefaultStyle(): {} {
        return {
            overlay: style({
                height: csx.percent(100),
                width: csx.percent(100),
                position: "absolute",
                top: 0,
                left: 0
              }),
              parentOfOverlay: style({
                position: "absolute",
                overflow: "auto"
              }),
              controlArea: style(csstips.content, {
                fontFamily: StyleConfiguration.getFontFamily(),
                fontSize: "11pt",
                $nest: {
                  select: {
                    fontFamily: StyleConfiguration.getFontFamily(),
                    fontSize: "10pt"
                  },
                  input: {
                    fontFamily: StyleConfiguration.getFontFamily(),
                    fontSize: "9pt"
                  }
                }
              }),
            clockline: style({
                backgroundColor: csx.green.toString(),
                padding: "0px",
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
                padding: "0.3em",
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
              }),
              hiddenTime: style({
                height: "0",
                visibility: "collapse"
              }),
              switchLink: style({
                textDecoration: "none"
              }),
              invalid: style({
                color: csx.important(csx.red.toString())
              })
          };
    }
}
