import { TimeTable } from "./components/TimeTable";
import { TimeSelector } from "./components/TimeSelector";
import { TimeControlWrapper } from "./components/TimeControlWrapper";
import { TimesParagraphWrapper } from "./components/TimesParagraphWrapper";
import * as LocalStorageService from './environment/LocalStorageService'

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

if (LocalStorageService.isSupported) {
  console.log("Local storage supported.");
}
else {
  console.log("Seems not.");
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

  function switchCallback(e: Event) {
    localStorage.setItem('useNewControl', 'true');
    window.location.replace(window.location.pathname + window.location.hash);
    e.stopPropagation();
  };

  if (LocalStorageService.isSupported === false) {
    console.warn("Local storage not supported.");
    return;
  }
  let timesParagraph = new TimesParagraphWrapper(
    document.getElementsByClassName('times')[0] as HTMLParagraphElement);

  if (LocalStorageService.hasItem('useNewControl')) {
    injectControl();
  }  
  else {
    timesParagraph.appendSwitch(switchCallback);
  }
})();

