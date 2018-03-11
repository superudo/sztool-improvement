import { StyleConfiguration } from "../styles/StyleConfiguration";

export class ElementFactory {
    public static element(tag?: string): ElementFactory {
        const factory = new ElementFactory();
        factory.tagName = tag;
        return factory;
    }

    private type: string;
    private tagName: string;
    private name: string;
    private id: string;
    private styles: string[];
    private children: any[];
    private text: string;
    private styleConfiguration: StyleConfiguration;

    public usingStyleConfig(styleConfiguration: StyleConfiguration):
            ElementFactory {
        this.styleConfiguration = styleConfiguration;
        return this;
    }

    public withName(name: string): ElementFactory {
        this.name = name;
        return this;
    }

    public withID(id: string): ElementFactory {
        this.id = id;
        return this;
    }

    public withInputType(type: string): ElementFactory {
        this.type = type;
        return this;
    }

    public withStyles(...styles: string[]): ElementFactory {
        this.styles = styles;
        return this;
    }

    public withChildren(...children: any[]) {
        this.children = children;
        return this;
    }

    public withText(text: string) {
        this.text = text;
        return this;
    }

    public create(): HTMLElement | Text {
        if (this.text) {
            return document.createTextNode(this.text);
        }

        const element = document.createElement(this.tagName);
        if (this.id) {
            element.id = this.id;
        }

        if (this.isInputElement(element)) {
            const inputElement = element as HTMLInputElement;
            if (this.name) {
                inputElement.name = this.name;
            }
            if (this.type) {
                inputElement.type = this.type;
            }
        }

        if (this.styles && this.styleConfiguration) {
            for (const styleName of this.styles) {
                this.styleConfiguration.addStyles(element, styleName);
            }
        }

        if (this.children) {
            for (const child of this.children) {
                element.appendChild(child);
            }
        }
        return element;
    }

    private isInputElement(element: HTMLElement): boolean {
        return (element instanceof HTMLInputElement
            || element instanceof HTMLButtonElement);
    }
}
