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

  const cp = new ColorPicker(
    document.getElementById("small"),
    (hex: string, hsv: any, rgb: any) => {
      console.log(hsv.h, hsv.s, hsv.v);
      console.log(rgb.r, rgb.g, rgb.b);
      document.body.style.backgroundColor = hex;
    }
   );

  checkDevMode();

  new TimeSelectorApp("app-root")
    .init()
    .run();
})();

