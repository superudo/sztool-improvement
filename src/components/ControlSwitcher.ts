import { style } from "typestyle";
import { PersistentStyle } from "../styles/PersistentStyle";

export const USE_CONTROL_ITEM = "useNewControl";

export class ControlSwitcher {
    public injectOnSwitch(parent: HTMLElement) {
        const linkSwitch = document.createElement("a");
        linkSwitch.href = "#";
        linkSwitch.addEventListener("click", (e: Event) => {
            localStorage.setItem(USE_CONTROL_ITEM, "true");
            window.location.replace(window.location.pathname);
            e.stopPropagation();
        });
        linkSwitch.innerText = "☑";
        linkSwitch.classList.add(PersistentStyle.switchLink);
        parent.appendChild(linkSwitch);
    }

    public injectOffSwitch(parent: HTMLElement) {
        const switchLink = document.createElement("a");
        switchLink.href = "#";
        switchLink.innerText = "☒";
        switchLink.classList.add(PersistentStyle.switchLink);
        switchLink.addEventListener("click", (e: Event) => {
            localStorage.removeItem(USE_CONTROL_ITEM);
            window.location.replace(window.location.pathname);
            e.stopPropagation();
        });
        parent.appendChild(switchLink);
    }
}
