import { TimeTable } from "./components/TimeTable";
import { TimeSelector } from "./components/TimeSelector";
import { TimeControlWrapper } from "./components/TimeControlWrapper";
import { TimesParagraphWrapper } from "./components/TimesParagraphWrapper";
import * as LocalStorageService from './environment/LocalStorageService'
import { ControlSwitcher, USE_CONTROL_ITEM } from "./components/ControlSwitcher";

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

(function main() {
  function injectControl() {
    let controls = timesParagraph.getSelectControls();
    new TimeSelector( 
      new TimeControlWrapper(controls.fromHours, controls.fromMinutes), 
      new TimeControlWrapper(controls.toHours, controls.toMinutes),
      timesParagraph.getInputButton(),
      timesParagraph.getCancelButton()
    ).injectAfter(timesParagraph.getParagraphElement());
    timesParagraph.hideParagraph();
  }

  if (LocalStorageService.isSupported === false) {
    console.warn("Local storage not supported.");
    return;
  }
  let timesParagraph = new TimesParagraphWrapper(
    document.getElementsByClassName('times')[0] as HTMLParagraphElement);

  if (LocalStorageService.hasItem(USE_CONTROL_ITEM)) {
    injectControl();
  }  
  else {
    new ControlSwitcher().injectOnSwitch(timesParagraph.getParagraphElement());
  }
})();

