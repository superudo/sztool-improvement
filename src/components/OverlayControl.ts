import { em, lightgray, percent } from "csx/lib";
import { style } from "typestyle/lib";
import { StyleConfiguration } from "../styles/StyleConfiguration";
import { AbstractComponent } from "./AbstractComponent";
import { ElementFactory } from "./ElementFactory";

export class OverlayControl extends AbstractComponent {
    private stlyeConfig: StyleConfiguration;

    constructor(rootID: string) {
        super(rootID);
        this.stlyeConfig = new StyleConfiguration(this);
    }

    public renderDOM(div: HTMLElement): void {
        this.stlyeConfig.addStyles(div, "appContainer");
        div.appendChild(ElementFactory.div()
            .usingStyleConfig(this.stlyeConfig)
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
