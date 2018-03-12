import { AbstractComponent } from "./AbstractComponent";
import { style } from "typestyle/lib";
import { percent, lightgray, em } from "csx/lib";
import { ElementFactory } from "./ElementFactory";
import { StyleConfiguration } from "../styles/StyleConfiguration";

export class OverlayControl extends AbstractComponent {
    private stlyeConfig: StyleConfiguration;

    constructor(rootID: string) {
        super(rootID);
        this.stlyeConfig = new StyleConfiguration(this);
    }

    public renderDOM(div: HTMLElement): void {
        this.stlyeConfig.addStyles(div.parentElement, "parentDiv");
        this.stlyeConfig.addStyles(div, "appContainer");
        div.appendChild(ElementFactory.div()
            .usingStyleConfig(this.stlyeConfig)
            .withStyles("appContainer").create());
    }

    public getDefaultStylesheet(): any {
        return {
            parentDiv: style({
                position: "relative",
                overflow: "auto"
            }),
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