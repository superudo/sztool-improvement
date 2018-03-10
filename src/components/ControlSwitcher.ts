import { style } from "typestyle";
import { StyleConfiguration } from "../styles/StyleConfiguration";

export const USE_CONTROL_ITEM = "useNewControl";

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
        new StyleConfiguration().addStyles(switchLink, "switchLink");
        parent.appendChild(switchLink);
    }

    public static injectOffSwitch(parent: HTMLElement) {
        const switchLink = document.createElement("a");
        switchLink.href = "#";
        switchLink.innerText = "☒";
        new StyleConfiguration().addStyles(switchLink, "switchLink");
        switchLink.addEventListener("click", (e: Event) => {
            localStorage.removeItem(USE_CONTROL_ITEM);
            window.location.replace(window.location.pathname);
            e.stopPropagation();
        });
        parent.appendChild(switchLink);
    }
}
