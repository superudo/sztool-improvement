import { none } from "csstips/lib";
import { style } from "typestyle";
import { IStylesheetProvider } from "../interfaces/IStylesheetProvider";
import { StyleConfiguration } from "../styles/StyleConfiguration";

export const USE_CONTROL_ITEM = "useNewControl";

class ControlSwitcherStyle implements IStylesheetProvider {
    public getProviderName() {
        return "controlswitcher";
    }

    public getDefaultStylesheet() {
        return {
            switchLink: style({
                textDecoration: none
            })
        };
    }
}

// tslint:disable-next-line:max-classes-per-file
export class ControlSwitcher {
    public static injectOnSwitch(parent: HTMLElement) {
        const switchLink = document.createElement("a");
        switchLink.href = "#";
        switchLink.addEventListener("click", (e: Event) => {
            localStorage.setItem(USE_CONTROL_ITEM, "true");
            window.location.replace(window.location.pathname);
            e.stopPropagation();
        });
        switchLink.innerText = "☑";
        this.styleConfiguration.addStyles(switchLink, "switchLink");
        parent.appendChild(switchLink);
    }

    public static injectOffSwitch(parent: HTMLElement) {
        const switchLink = document.createElement("a");
        switchLink.href = "#";
        switchLink.innerText = "☒";
        this.styleConfiguration.addStyles(switchLink, "switchLink");
        switchLink.addEventListener("click", (e: Event) => {
            localStorage.removeItem(USE_CONTROL_ITEM);
            window.location.replace(window.location.pathname);
            e.stopPropagation();
        });
        parent.appendChild(switchLink);
    }

    private static styleConfiguration =
        new StyleConfiguration(new ControlSwitcherStyle());
}
