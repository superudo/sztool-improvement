import { style } from "typestyle";
import { IStylesheetProvider } from "../interfaces/IStylesheetProvider";
import { StyleConfiguration } from "../styles/StyleConfiguration";
import { ElementFactory } from "./ElementFactory";

export const USE_CONTROL_ITEM = "useNewControl";
export const CONTROL_ITEM_ORIGINAL = "original";
export const CONTROL_ITEM_NEW = "new";
export const CONTROL_ITEM_CONFIG = "config";

const ON_SYMBOL = "◉";
const OFF_SYMBOL = "◎";

class ControlSwitcherStyle implements IStylesheetProvider {
  public getProviderName() {
    return "controlswitcher";
  }

  public getDefaultStylesheet() {
    return {
      switchLink: style({
        textDecoration: "none"
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
    parent.appendChild(
      ElementFactory.link()
        .withHref("#")
        .usingStyleConfig(this.styleConfiguration)
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
    parent.appendChild(
      ElementFactory.span()
        .usingStyleConfig(this.styleConfiguration)
        .withStyles("outer")
        .withChildren(
          ElementFactory.link()
            .withHref("#")
            .usingStyleConfig(this.styleConfiguration)
            .withStyles("switchLink")
            .withChildren(ElementFactory.text("🔧").create())
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
            .usingStyleConfig(this.styleConfiguration)
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

  private static styleConfiguration = new StyleConfiguration(
    new ControlSwitcherStyle()
  );
}
