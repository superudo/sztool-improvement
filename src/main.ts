import { TimeSelectorApp } from "./app/TimeSelectorApp";
import { StyleEditor } from "./components/StyleEditor";
import * as LocalStorageService from "./environment/LocalStorageService";

(function main() {
  function checkDevMode() {
    if (process.env.NODE_ENV !== "production") {
      console.log("Looks like we are in development mode!");
    }
  }

  checkDevMode();

  new TimeSelectorApp("app-root")
    .init()
    .run();

  new StyleEditor("test").init(
    {
      "Background": {r: 100, g: 200, b: 42},
      "Button BG": {r: 100, g: 200, b: 50},
      "Button Text": {r: 50, g: 100, b: 10},
      "Time bar": {r: 2, g: 20, b: 200},
    }
  ).run();
})();

