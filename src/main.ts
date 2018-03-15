import { TimeSelectorApp } from "./app/TimeSelectorApp";
import { StyleEditor, IStyleEditorValues } from "./components/StyleEditor";
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
})();

