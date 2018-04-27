import { style } from "typestyle";
import { Utf16Encode } from "../environment/Utf16Encode";
import { IStylesheetProvider } from "../interfaces/IStylesheetProvider";
import { ElementFactory } from "./ElementFactory";
import { black } from "csx/lib";

export const USE_CONTROL_ITEM = "useNewControl";
export const CONTROL_ITEM_ORIGINAL = "original";
export const CONTROL_ITEM_NEW = "new";
export const CONTROL_ITEM_CONFIG = "config";

const ON_SYMBOL = Utf16Encode.utf16Encode([0x2726]); // ◉
const OFF_SYMBOL = Utf16Encode.utf16Encode([0x2727]); // ◎
const WRENCH_SYMBOL = Utf16Encode.utf16Encode([0x2710]); // 🔧

class ControlSwitcherStyle implements IStylesheetProvider {
  public getProviderName() {
    return "controlswitcher";
  }

  public getDefaultStylesheet() {
    return {
      switchLink: style({
        textDecoration: "none",
        fontSize: "1.5em",
        color: black.toString(),
      }),
      outer: style({
        display: "inline-block"
      })
    };
  }
}

// tslint:disable-next-line:max-classes-per-file
export class ControlSwitcher {
  public static injectOnSwitch(parent: HTMLElement) {
    const styleConfiguration = new ControlSwitcherStyle();
    parent.appendChild(
      ElementFactory.link()
        .withHref("#")
        .usingStylesheetProvider(styleConfiguration)
        .withStyles("switchLink")
        .withChildren(ElementFactory.text(OFF_SYMBOL).create())
        .withEventListener("click", (e: Event) => {
          localStorage.setItem(USE_CONTROL_ITEM, CONTROL_ITEM_NEW);
          window.location.replace(window.location.pathname);
          e.stopPropagation();
        })
        .create()
    );
  }

  public static injectOffSwitch(parent: HTMLElement) {
    const styleConfiguration = new ControlSwitcherStyle();
    parent.appendChild(
      ElementFactory.span()
        .usingStylesheetProvider(styleConfiguration)
        .withStyles("outer")
        .withChildren(
          ElementFactory.link()
            .withHref("#")
            .usingStylesheetProvider(styleConfiguration)
            .withStyles("switchLink")
            .withChildren(ElementFactory.text(WRENCH_SYMBOL).create())
            .withEventListener("click", (e: Event) => {
              localStorage.setItem(USE_CONTROL_ITEM, CONTROL_ITEM_CONFIG);
              window.location.replace(window.location.pathname);
              e.stopPropagation();
            })
            .create(),
          ElementFactory.br().create(),
          ElementFactory.br().create(),
          ElementFactory.link()
            .withHref("#")
            .usingStylesheetProvider(styleConfiguration)
            .withStyles("switchLink")
            .withChildren(ElementFactory.text(ON_SYMBOL).create())
            .withEventListener("click", (e: Event) => {
              localStorage.setItem(USE_CONTROL_ITEM, CONTROL_ITEM_ORIGINAL);
              window.location.replace(window.location.pathname);
              e.stopPropagation();
            })
            .create()
        )
        .create()
    );
  }
}
