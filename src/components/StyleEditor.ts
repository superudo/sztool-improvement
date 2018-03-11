import { em, lightblue, percent } from "csx/lib";
import { style } from "typestyle";
import { IRunnable } from "../interfaces/IRunnable";
import { StyleConfiguration } from "../styles/StyleConfiguration";
import { AbstractComponent } from "./AbstractComponent";
import { ElementFactory } from "./ElementFactory";

export class StyleEditor extends AbstractComponent {
    private styleConfiguration: StyleConfiguration;

    constructor(rootID: string) {
        super(rootID);
        this.styleConfiguration = new StyleConfiguration(this);
    }

    public init(): IRunnable {
        return super.init();
    }

    public run(): void {
        super.run();
    }

    public getProviderName(): string {
        return this.rootID;
    }

    public getDefaultStylesheet(): object {
        return {
            appContainer: style({
                padding: em(0.2),
                display: "flex",
                backgroundColor: lightblue.toString(),
                margin: 0,
                position: "absolute",
                width: percent(100),
                height: percent(100),
                top: 0,
                left: 0
            }),
            form: style({
                display: "flex",
                flexDirection: "column",
                fontSize: "9pt",
                $nest: {
                    "p": {
                        margin: em(0.3)
                    },
                    "input": {
                        height: em(1.4)
                    },
                    "input[type=text], input[type=range]": {
                        width: percent(50)
                    },
                    "label": {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }
                }
            })
        };
    }

    public renderDOM(appRoot: HTMLElement) {
        this.styleConfiguration.addStyles(appRoot, "appContainer");
        appRoot.appendChild(
            ElementFactory.element("form")
                .usingStyleConfig(this.styleConfiguration)
                .withStyles("form")
                .withChildren(
                    ElementFactory.element("p")
                        .withChildren(
                            ElementFactory.element("label")
                                .withChildren(
                                    ElementFactory.element()
                                        .withText("Hintergrund")
                                        .create(),
                                    ElementFactory.element("input")
                                        .withName("bg")
                                        .withInputType("text")
                                        .create()
                                )
                                .create()
                        )
                        .create(),
                        ElementFactory.element("p")
                        .withChildren(
                            ElementFactory.element("label")
                                .withChildren(
                                    ElementFactory.element()
                                        .withText("Red")
                                        .create(),
                                    ElementFactory.element("input")
                                        .withName("red")
                                        .withInputType("range")
                                        .create()
                                )
                                .create()
                        )
                        .create(),
                        ElementFactory.element("p")
                        .withChildren(
                            ElementFactory.element("label")
                                .withChildren(
                                    ElementFactory.element()
                                        .withText("Green")
                                        .create(),
                                    ElementFactory.element("input")
                                        .withName("green")
                                        .withInputType("range")
                                        .create()
                                )
                                .create()
                        )
                        .create(),
                        ElementFactory.element("p")
                        .withChildren(
                            ElementFactory.element("label")
                                .withChildren(
                                    ElementFactory.element()
                                        .withText("Blue")
                                        .create(),
                                    ElementFactory.element("input")
                                        .withName("blue")
                                        .withInputType("range")
                                        .create()
                                )
                                .create()
                        )
                        .create(),
                        ElementFactory.element("p")
                        .withChildren(
                            ElementFactory.element("label")
                                .withChildren(
                            ElementFactory.element()
                            .withText(String.fromCharCode(160))
                            .create(),
                            ElementFactory.element("button")
                                .withName("ende")
                                .withChildren(
                                    ElementFactory.element()
                                        .withText("Ende")
                                        .create())
                                .create()
                            ).create()
                        )
                        .create()
                )
                .create()
        );
    }
}
