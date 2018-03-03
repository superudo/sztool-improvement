import { TimeTable, TimeControl } from "./components/TimeTable";
import { TimeSelector } from "./components/TimeSelector";

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

(
  function main() {
    var fromControl = new TimeControl( 
      document.getElementsByName('from_hh')[0] as HTMLSelectElement, 
      document.getElementsByName('from_mm')[0] as HTMLSelectElement
    );

    var toControl = new TimeControl( 
      document.getElementsByName('to_hh')[0] as HTMLSelectElement,
      document.getElementsByName('to_mm')[0] as HTMLSelectElement
    );

    var selector: TimeSelector = new TimeSelector(document.getElementsByClassName('times')[0], fromControl, toControl);
  }
)();

