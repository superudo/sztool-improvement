import { style } from "typestyle";
import { css, myClass, setTheme } from "./ComponentStyles";

export const USE_CONTROL_ITEM = 'useNewControl';

export class ControlSwitcher {
    injectOnSwitch(parent: HTMLElement) {
        let linkSwitch = document.createElement('a');
        linkSwitch.href = '#';
        linkSwitch.addEventListener('click', (e: Event) => {
            localStorage.setItem(USE_CONTROL_ITEM, 'true');
            window.location.replace(window.location.pathname);
            e.stopPropagation();
        });
        linkSwitch.innerText = '☑';
        linkSwitch.classList.add(css.switchLink);
        parent.appendChild(linkSwitch);
    }
        
    injectOffSwitch(parent: HTMLElement) {
        let switchLink = document.createElement('a');
        switchLink.href = '#';
        switchLink.innerText = '☒';
        switchLink.classList.add(css.switchLink);
        switchLink.addEventListener('click', (e: Event) => {
            localStorage.removeItem(USE_CONTROL_ITEM);
            window.location.replace(window.location.pathname);
            e.stopPropagation();
        });
        parent.appendChild(switchLink);

        let testText = document.createElement('span');
        testText.innerText = 'Hello world!';
        testText.classList.add(myClass);
        testText.addEventListener('mouseenter', (e: Event) => {
            setTheme('panda')
        });
        testText.addEventListener('mouseleave', (e: Event) => {
            setTheme('lion')
        });
        parent.appendChild(testText);
    }
}