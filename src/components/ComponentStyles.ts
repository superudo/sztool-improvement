import { stylesheet, style } from "typestyle/lib";
import * as csx from "csx";

function applyVars(dictionary: any) {
    const el = document.body;
    for (var name in dictionary) {
        if (dictionary.hasOwnProperty) {
            el.style.setProperty(name, dictionary[name]);
        }
    }
}

export function setTheme(theme: string) {
    switch (theme) {
        case 'panda': 
            applyVars({
                '--clockline-background-color': csx.green.toString()
            });
            break;
        case 'lion':
            applyVars({
                '--clockline-background-color': csx.blue.toString()
            });
            break;
        default:
            applyVars({
                '--clockline-background-color': csx.yellow.toString()
            });
            break;
    }
}

export const myClass = style({
    color: 'var(--brand-color)'
});

export const css = stylesheet({
    controlArea: {
        fontFamily: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        fontSize: '11pt',
        display: 'inline-block',
        $nest: {
            'select': {
                fontFamily: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
                fontSize: '10pt'
            },
            'input': {
                fontFamily: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
                fontSize: '9pt'
            }
        }
    },
    clockline: {
        backgroundColor: csx.green.toString(),
        padding: '0px',
        overflow: 'auto',
        $nest: {
            '&>button': {
                backgroundColor: csx.color('#4caf50').toString(),
                border: '1px solid ' + csx.green.toString(),
                color: csx.white.toString(),
                padding: '0.1em 0.7em',
                cursor: 'pointer',
                float: 'left'
            },
            '&>button:hover': {
                backgroundColor: csx.rgb(64, 128, 64).toString()
            },
            '&+button': {
                clear: 'left'
            },
            '&>select': {
                margin: '0.25em auto'
            }
        }
    },
    outer: {
        backgroundColor: csx.burlywood.toString(),
        padding: '0.3em',
        fontFamily: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        fontSize: '10pt',
        overflowY: 'auto',
        display: 'inline-block'
    },
    clockTitle: {
        color: csx.white.toString(),
        backgroundColor: csx.darkgreen.toString(),
        border: '1px solid ' + csx.green.toString(),
        fontWeight: 'bold',
        padding: '0.1em 0.2em',
        marginBottom: '0.3em'   
    },
    hours: {
        float: 'left'
    },
    minutes: {
        float: 'left',
        marginLeft: '0.5em'
    },
    inputButton: {
        float: 'right',
        margin: '0.2em auto'
    },
    hiddenTime: {
        height: '0',
        visibility: 'collapse'
    },
    switchLink: {
        textDecoration: 'none'
    },
    invalid: {
        color: csx.important(csx.red.toString())
    }
});

