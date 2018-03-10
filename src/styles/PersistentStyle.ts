import * as csstips from "csstips";
import * as csx from "csx";
import { style } from "typestyle";
import { StyleConfiguration } from "./StyleConfiguration";

export class PersistentStyle {
  public static variableClass = style({
    color: "var(--brand-color)"
  });

  public static overlay = style({
    height: csx.percent(100),
    width: csx.percent(100),
    position: "absolute",
    top: 0,
    left: 0
  });

  public static parentOfOverlay = style({
    position: "absolute",
    overflow: "auto"
  });

  public static controlArea = style(csstips.content, {
    fontFamily: "var(--font-family)",
    fontSize: "11pt",
    $nest: {
      select: {
        fontFamily: "var(--font-family)",
        fontSize: "10pt"
      },
      input: {
        fontFamily: "var(--font-family)",
        fontSize: "9pt"
      }
    }
  });

  public static clockline = style({
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
  });

  public static outer = style(csstips.inlineBlock, {
    backgroundColor: csx.burlywood.toString(),
    padding: "0.3em",
    fontFamily: ["Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"],
    fontSize: "10pt",
    overflowY: "auto"
  });

  public static clockTitle = style({
    color: csx.white.toString(),
    backgroundColor: csx.darkgreen.toString(),
    border: "1px solid " + csx.green.toString(),
    fontWeight: "bold",
    padding: "0.1em 0.2em",
    marginBottom: "0.3em"
  });

  public static hours = style({
    float: "left"
  });

  public static minutes = style({
    float: "left",
    marginLeft: "0.5em"
  });

  public static inputButton = style({
    float: "right",
    margin: "0.2em auto"
  });

  public static hiddenTime = style({
    height: "0",
    visibility: "collapse"
  });

  public static switchLink = style({
    textDecoration: "none"
  });

  public static invalid = style({
    color: csx.important(csx.red.toString())
  });

  constructor() {
    this.setTheme("default");
  }

  public setTheme(theme: string) {
    switch (theme) {
      case "panda":
        this.applyVars({
          "--brand-color": csx.green.toString()
        });
        break;
      case "lion":
        this.applyVars({
          "--brand-color": csx.blue.toString()
        });
        break;
      default:
        this.applyVars({
          "--brand-color": csx.yellow.toString(),
          "--font-family": StyleConfiguration.getFontFamily()
        });
        break;
    }
  }

  private applyVars(dictionary: any): void {
    const el = document.body;
    for (const name in dictionary) {
      if (dictionary.hasOwnProperty) {
        el.style.setProperty(name, dictionary[name]);
      }
    }
  }
}
