import { IComponent } from "../interfaces/IComponent";
import { IRunnable } from "../interfaces/IRunnable";
import { IStylesheetProvider } from "../interfaces/IStylesheetProvider";
import { StyleConfiguration } from "../styles/StyleConfiguration";

export interface IObserver {
    receiveNotification<T>(message: T): void;
}

export interface IObservable {
    registerObserver(observer: IObserver): void;
    removeObserver(observer: IObserver): void;
    notifyObservers(): void;
}

export abstract class AbstractComponent
    implements IComponent, IRunnable, IStylesheetProvider {

    protected rootID: string;
    protected rootDiv: HTMLElement;

    constructor(rootID: string) {
        if (rootID === null || rootID.length === 0) {
            throw new Error("Application root ID must not be empty.");
        }
        this.rootID = rootID;
    }

    public init(info?: any): IRunnable {
        this.rootDiv = document.getElementById(this.rootID);
        if (!this.rootDiv) {
            throw new Error("Application root element \""
                + this.rootID + "\" not found.");
        }
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

    private assertRootDiv() {
        if (this.rootDiv === null) {
            throw new Error("Application not initialized.");
        }
    }
}
