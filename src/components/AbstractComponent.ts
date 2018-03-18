import { IComponent } from "../interfaces/IComponent";
import { IInitializable } from "../interfaces/IInitializable";
import { IRunnable } from "../interfaces/IRunnable";
import { IStylesheetProvider } from "../interfaces/IStylesheetProvider";

export abstract class AbstractComponent
    implements IComponent, IInitializable, IRunnable, IStylesheetProvider {

    protected rootID: string;
    protected rootDiv: HTMLElement;

    protected callbackOk: (info?: any) => void;
    protected callbackCancel: () => void;


    constructor(rootID: string) {
        if (rootID === null || rootID.length === 0) {
            throw new Error("Application root ID must not be empty.");
        }
        this.rootID = rootID;
    }

    public init(info?: any): IInitializable {
        this.rootDiv = document.getElementById(this.rootID);
        if (!this.rootDiv) {
            throw new Error("Application root element \""
                + this.rootID + "\" not found.");
        }
        return this;
    }

    public whenOk(callback: (info?: any) => void): IInitializable {
        this.callbackOk = callback;
        return this;
    }

    public whenCancel(callback: () => void): IInitializable {
        this.callbackCancel = callback;
        return this;
    }

    public destroy(): void {
        this.assertRootDiv();
    }

    public run(): void {
        this.assertRootDiv();
        this.renderDOM(this.rootDiv);
    }

    public abstract renderDOM(div: HTMLElement): void;
    public abstract getDefaultStylesheet(): object;
    public abstract getProviderName(): string;

    protected notifyOk(info?: any): void {
        if (this.callbackOk !== undefined) {
            this.callbackOk(info);
        }
        this.rootDiv.remove();
    }

    protected notifyCancel(): void {
        if (this.callbackCancel !== undefined) {
            this.callbackCancel();
        }
        this.rootDiv.remove();
    }

    private assertRootDiv() {
        if (this.rootDiv === null) {
            throw new Error("Application not initialized.");
        }
    }
}
