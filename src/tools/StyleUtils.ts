import { IStylesheetProvider } from "../interfaces/IStylesheetProvider";

export function getStyle(
  styleProvider: IStylesheetProvider,
  name: string
): string {
  return styleProvider.getDefaultStylesheet()[name];
}

export function addStyles(
  el: HTMLElement,
  styleProvider: IStylesheetProvider,
  ...cssStlyes: string[]
) {
  for (const cssStyle of cssStlyes) {
    const className = getStyle(styleProvider, cssStyle);
    el.classList.add(getStyle(styleProvider, cssStyle));
  }
}

export function removeStyles(
  el: HTMLElement,
  styleProvider: IStylesheetProvider,
  ...cssStyles: string[]
) {
  for (const cssStyle of cssStyles) {
    el.classList.remove(getStyle(styleProvider, cssStyle));
  }
}
