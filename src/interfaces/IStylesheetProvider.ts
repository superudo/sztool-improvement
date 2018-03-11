export interface IStylesheetProvider {
    getProviderName: () => string;
    getDefaultStylesheet: () => any;
}
