import * as csstips from "csstips";
import * as csx from "csx";
import { style } from "typestyle";
import * as LocalStorageService from "../environment/LocalStorageService";
import { IStylesheetProvider } from "../interfaces/IStylesheetProvider";

export class StyleConfiguration {

    public static getFontFamily(): string[] {
        return [
            "Segoe UI",
            "Tahoma",
            "Geneva",
            "Verdana",
            "sans-serif"
          ];
    }

    private static STYLE_KEY: string = "userStyle";

    private styleDefinition: any;
    private styleProvider: IStylesheetProvider;
    private that: StyleConfiguration;

    constructor(provider: IStylesheetProvider) {
      this.styleProvider = provider;
      this.styleDefinition =
          LocalStorageService.getObject(provider.getProviderName());
      this.that = this;
    }

    public addStyles(el: HTMLElement, ...cssStlyes: string[]) {
        for (const cssStyle of cssStlyes) {
            const className = this.that.getStyle(cssStyle);
            el.classList.add(this.that.getStyle(cssStyle));
        }
    }

    public removeStyles(el: HTMLElement, ...cssStyles: string[]) {
        for (const cssStyle of cssStyles) {
            el.classList.remove(this.that.getStyle(cssStyle));
        }
    }

    public saveStyle(withReload?: boolean) {
        LocalStorageService.setObject(
            StyleConfiguration.STYLE_KEY, this.that.styleDefinition);
        if (withReload) {
            window.location.replace(window.location.pathname);
        }
    }

    private getStyle(name: string): string {
        if (this.that.styleDefinition && this.that.styleDefinition[name]) {
          return this.that.styleDefinition[name];
        }
        return this.that.styleProvider.getDefaultStylesheet()[name];
    }
}
