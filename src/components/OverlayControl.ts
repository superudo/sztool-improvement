import { em, lightgray, percent } from "csx/lib";
import { style } from "typestyle/lib";
import { IStylesheetProvider } from "../interfaces/IStylesheetProvider";
import { addStyles } from "../tools/StyleUtils";
import { AbstractComponent } from "./AbstractComponent";
import { ElementFactory } from "./ElementFactory";

export class OverlayControl extends AbstractComponent {

    constructor(rootID: string) {
        super(rootID);
    }

    public renderDOM(div: HTMLElement): void {
        addStyles(div, this, "appContainer");
        div.appendChild(ElementFactory.div()
            .usingStylesheetProvider(this)
            .withStyles("appContainer").create());
    }

    public getDefaultStylesheet(): any {
        return {
            appContainer: style({
                zIndex: 100,
                opacity: 0,
                margin: 0,
                position: "absolute",
                width: percent(100),
                height: percent(100),
                top: 0,
                left: 0
            }),
        };
    }

    public getProviderName(): string {
        return this.rootID;
    }
}
