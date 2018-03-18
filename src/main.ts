import { TimeSelectorApp } from "./app/TimeSelectorApp";
import { IStyleEditorValues, StyleEditor } from "./components/StyleEditor";
import * as LocalStorageService from "./environment/LocalStorageService";
import { ColorPicker, HSV, RGB } from "./vendor/FlexiColorPicker/ColorPicker";

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
})();

