import { TimeTable } from "./components/TimeTable";
import { TimeSelector } from "./components/TimeSelector";
import { TimeControlWrapper } from "./components/TimeControlWrapper";
import { TimesParagraphWrapper } from "./components/TimesParagraphWrapper";

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

(
  function main() {
    let timesParagraph = new TimesParagraphWrapper(
      document.getElementsByClassName('times')[0] as HTMLParagraphElement);
    let controls = timesParagraph.getSelectControls();
    new TimeSelector( 
      new TimeControlWrapper(controls.fromHours, controls.fromMinutes), 
      new TimeControlWrapper(controls.toHours, controls.toMinutes),
      timesParagraph.getInputButton()
    ).injectAfter(timesParagraph.getParagraphElement());
    timesParagraph.hideParagraph();
  }
)();

