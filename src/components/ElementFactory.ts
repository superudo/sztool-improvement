import { IStylesheetProvider } from "../interfaces/IStylesheetProvider";
import { addStyles } from "../tools/StyleUtils";
const TAGS = {
  PARAGRAPH: "p",
  FORM: "form",
  INPUT: "input",
  BUTTON: "button",
  LABEL: "label",
  SELECT: "select",
  OPTION: "option",
  DIV: "div",
  SPAN: "span",
  BR: "br",
  LINK: "a",
  TABLE: "table",
  TR: "tr",
  TH: "th",
  TD: "td"
};

const INPUT_TAGS = [TAGS.INPUT, TAGS.BUTTON, TAGS.SELECT];

interface IElementFactory {
  withID: (id: string) => IElementFactory;
  withEventListener: (
    n: string,
    h: EventListenerOrEventListenerObject,
    o?: boolean | AddEventListenerOptions
  ) => IElementFactory;
  withAttribute: (k: string, v: string) => ElementFactory;
  create: () => HTMLElement | Text;
}

interface IParentFactory extends IElementFactory {
  withChildren: (...c: Array<HTMLElement | Text>) => IParentFactory;
}

interface IStyledParentFactory extends IParentFactory {
  usingStylesheetProvider: (s: IStylesheetProvider) => IStyleableFactory;
}

interface IStyleableFactory extends IParentFactory {
  withStyles: (...s: string[]) => IStyleableFactory;
}

interface ILinkFactory {
  withHref: (url: string) => IStyledParentFactory;
}

interface INamedFactory extends IStyledParentFactory {
  withName: (n: string) => INamedFactory;
}

interface IValuedFactory extends INamedFactory {
  withValue: (v: any) => IValuedFactory;
}

interface IInputFactory extends IValuedFactory {
  withInputType: (t: string) => IInputFactory;
  withRange: (min: number, max: number) => IInputFactory;
}

interface IButtonFactory extends INamedFactory {
  withText: (t: string) => IButtonFactory;
}

interface IOptionFactory extends IValuedFactory {
  isSelected: (s: boolean) => IOptionFactory;
}

interface IEvent {
  name: string;
  handler: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
}

export class ElementFactory
  implements
    IButtonFactory,
    IInputFactory,
    IStyledParentFactory,
    IOptionFactory,
    ILinkFactory {

  public static form(): IStyledParentFactory {
    return this.buildFactory(TAGS.FORM);
  }

  public static paragraph(): IStyledParentFactory {
    return this.buildFactory(TAGS.PARAGRAPH);
  }

  public static input(): IInputFactory {
    return this.buildFactory(TAGS.INPUT);
  }

  public static button(): IButtonFactory {
    return this.buildFactory(TAGS.BUTTON);
  }

  public static text(t: string): IElementFactory {
    const factory = new ElementFactory();
    factory.text = t;
    return factory;
  }

  public static label(): IStyledParentFactory {
    return this.buildFactory(TAGS.LABEL);
  }

  public static select(): INamedFactory {
    return this.buildFactory(TAGS.SELECT);
  }

  public static option(): IOptionFactory {
    return this.buildFactory(TAGS.OPTION);
  }

  public static link(): ILinkFactory {
    return this.buildFactory(TAGS.LINK);
  }

  public static div(): IStyledParentFactory {
    return this.buildFactory(TAGS.DIV);
  }

  public static span(): IStyledParentFactory {
    return this.buildFactory(TAGS.SPAN);
  }

  public static br(): ElementFactory {
      return this.buildFactory(TAGS.BR);
  }

  public static table(): IStyledParentFactory {
    return this.buildFactory(TAGS.TABLE);
  }

  public static tr(): IStyledParentFactory {
    return this.buildFactory(TAGS.TR);
  }

  public static th(): IStyledParentFactory {
    return this.buildFactory(TAGS.TH);
  }

  public static td(): IStyledParentFactory {
    return this.buildFactory(TAGS.TD);
  }

  public static fromElement(el: HTMLElement): IStyledParentFactory {
    const factory = new ElementFactory();
    factory.sourceElement = el;
    factory.children = [];
    factory.events = [];
    factory.attributes = {};
    return factory;
  }

  private static buildFactory(tagName?: string): ElementFactory {
    const factory = new ElementFactory();
    if (tagName) {
      factory.tagName = tagName;
    }
    factory.children = [];
    factory.events = [];
    factory.attributes = {};

    return factory;
  }

  private type: string;
  private tagName: string;
  private name: string;
  private id: string;
  private styles: string[];
  private children: any[];
  private text: string;
  private value: any;
  private url: string;
  private stylesheetProvider: IStylesheetProvider;
  private events: IEvent[];
  private that: ElementFactory;
  private optionSelected: boolean;
  private minmax: any;
  private attributes: any;
  private sourceElement: HTMLElement;

  public usingStylesheetProvider(
    stylesheetProvider: IStylesheetProvider
  ): ElementFactory {
    this.stylesheetProvider = stylesheetProvider;
    return this;
  }

  public withName(name: string): ElementFactory {
    this.name = name;
    return this;
  }

  public withInputType(type: string): IInputFactory {
    this.type = type;
    return this;
  }

  public withRange(minValue: number, maxValue: number): IInputFactory {
    this.minmax = { min: minValue, max: maxValue };
    return this;
  }

  public withValue(value: any): IInputFactory {
    this.value = value;
    return this;
  }

  public withID(id: string): ElementFactory {
    this.id = id;
    return this;
  }

  public withStyles(...styles: string[]): ElementFactory {
    if (this.styles === undefined) {
      this.styles = [];
    }
    for (const style of styles) {
      this.styles.push(style);
    }
    return this;
  }

  public withChildren(...children: any[]) {
    for (const child of children) {
      if (child !== null) {
        this.children.push(child);
      }
    }
    return this;
  }

  public withText(text: string) {
    this.text = text;
    return this;
  }

  public withHref(url: string) {
    this.url = url;
    return this;
  }

  public withEventListener(
    eventName: string,
    eventHandler: EventListenerOrEventListenerObject,
    eventOptions?: boolean | AddEventListenerOptions
  ): ElementFactory {
    this.events.push({
      name: eventName,
      handler: eventHandler,
      options: eventOptions
    });
    return this;
  }

  public withAttribute(key: string, value: string): ElementFactory {
    this.attributes[key] = value;
    return this;
  }

  public isSelected(selected: boolean): IOptionFactory {
    this.optionSelected = selected;
    return this;
  }

  public create(): HTMLElement | Text {
      if (this.text && !this.tagName) {
        return document.createTextNode(this.text);
      }

      const element = this.sourceElement
        || document.createElement(this.tagName);

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

      if (this.type === "range" && this.minmax !== undefined) {
        element.setAttribute("min", this.minmax.min);
        element.setAttribute("max", this.minmax.max);
      }

      if (this.value !== undefined) {
          inputElement.value = this.value;
      }
    }

      if (this.tagName === TAGS.OPTION) {
      const optionElement = element as HTMLOptionElement;
      if (this.value) {
        optionElement.value = this.value;
      }
      if (this.name) {
        optionElement.text = this.name;
      }
      if (this.optionSelected !== undefined) {
        optionElement.selected = this.optionSelected;
      }
    }

      if (this.tagName === TAGS.BUTTON) {
      (element as HTMLButtonElement).type = "button";
      (element as HTMLButtonElement).innerText = this.text || "Button";
    }

      if (this.styles) {
      if (!this.stylesheetProvider
        ||  !this.stylesheetProvider.getDefaultStylesheet()) {
        throw new Error("No stylesheet provider given.");
      }
      for (const styleName of this.styles) {
        addStyles(element, this.stylesheetProvider, styleName);
      }
    }

      if (this.children) {
      for (const child of this.children) {
        element.appendChild(child);
      }
    }

      if (this.tagName === TAGS.LINK && this.url) {
      (element as HTMLLinkElement).href = this.url;
    }

      if (this.events) {
      for (const ev of this.events) {
        element.addEventListener(ev.name, ev.handler, ev.options);
      }
    }

      Object.keys(this.attributes).forEach((value: string) => {
      element.setAttribute(value, this.attributes[value]);
    });

      return element;
  }

  private isInputElement(element: HTMLElement): boolean {
    return INPUT_TAGS.indexOf(this.tagName) > -1;
  }
}
