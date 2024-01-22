const getNestedProp = (o, s) => {
    s = s.replace(/\[(\w+)]/g, '.$1');
    s = s.replace(/^\./, '');
    let a = s.split('.');
    for (let i = 0, n = a.length; i < n; ++i) {
        let k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

function setNestedProp(obj, propertyString, value) {
    const properties = propertyString.split('.');
    let currentObj = obj;

    for (let i = 0; i < properties.length - 1; i++) {
        const property = properties[i];

        currentObj[property] = currentObj[property] || {};
        currentObj = currentObj[property];
    }

    currentObj[properties[properties.length - 1]] = value;
}

const colorToString = (color) => `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

const generateGradientFunc = (radius, color, intensity, gradientStep, layer) => {
    return (pos) => {
        let grad = WW.layers[layer].ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius);
        for (let i = 0; i <= 1; i += 1 / gradientStep) {
            grad.addColorStop(clamp01(i), `rgba(${color.r}, ${color.g}, ${color.b}, ${intensity * ((1 - i) ** 2)})`);
        }
        return grad;
    }
}

const clamp01 = (number) => number > 1 ? 1 : number < 0 ? 0 : number;

const Color = {
    WHITE: {r: 255, g: 255, b: 255, a: 255},
    BLACK: {r: 0, g: 0, b: 0, a: 255},
    TRANSPARENT: {r: 0, g: 0, b: 0, a: 0},
    HALF_TRANSPARENT_BLACK: {r: 0, g: 0, b: 0, a: 0.5},
    HALF_TRANSPARENT_WHITE: {r: 255, g: 255, b: 255, a: 0.5},
}

const Key = {
    Backquote: 'Backquote',
    Backslash: 'Backslash',
    Backspace: 'Backspace',
    BracketLeft: 'BracketLeft',
    BracketRight: 'BracketRight',
    CapsLock: 'CapsLock',
    Comma: 'Comma',
    ControlLeft: 'ControlLeft',
    ControlRight: 'ControlRight',
    Delete: 'Delete',
    Digit0: 'Digit0',
    Digit1: 'Digit1',
    Digit2: 'Digit2',
    Digit3: 'Digit3',
    Digit4: 'Digit4',
    Digit5: 'Digit5',
    Digit6: 'Digit6',
    Digit7: 'Digit7',
    Digit8: 'Digit8',
    Digit9: 'Digit9',
    End: 'End',
    Enter: 'Enter',
    Escape: 'Escape',
    F1: 'F1',
    F2: 'F2',
    F3: 'F3',
    F4: 'F4',
    F5: 'F5',
    F6: 'F6',
    F7: 'F7',
    F8: 'F8',
    F9: 'F9',
    F10: 'F10',
    F11: 'F11',
    F12: 'F12',
    Home: 'Home',
    Insert: 'Insert',
    KeyA: 'KeyA',
    KeyB: 'KeyB',
    KeyC: 'KeyC',
    KeyD: 'KeyD',
    KeyE: 'KeyE',
    KeyF: 'KeyF',
    KeyG: 'KeyG',
    KeyH: 'KeyH',
    KeyI: 'KeyI',
    KeyJ: 'KeyJ',
    KeyK: 'KeyK',
    KeyL: 'KeyL',
    KeyM: 'KeyM',
    KeyN: 'KeyN',
    KeyO: 'KeyO',
    KeyP: 'KeyP',
    KeyQ: 'KeyQ',
    KeyR: 'KeyR',
    KeyS: 'KeyS',
    KeyT: 'KeyT',
    KeyU: 'KeyU',
    KeyV: 'KeyV',
    KeyW: 'KeyW',
    KeyX: 'KeyX',
    KeyY: 'KeyY',
    KeyZ: 'KeyZ',
    MetaLeft: 'MetaLeft',
    MetaRight: 'MetaRight',
    Minus: 'Minus',
    NumLock: 'NumLock',
    Numpad0: 'Numpad0',
    Numpad1: 'Numpad1',
    Numpad2: 'Numpad2',
    Numpad3: 'Numpad3',
    Numpad4: 'Numpad4',
    Numpad5: 'Numpad5',
    Numpad6: 'Numpad6',
    Numpad7: 'Numpad7',
    Numpad8: 'Numpad8',
    Numpad9: 'Numpad9',
    NumpadAdd: 'NumpadAdd',
    NumpadDecimal: 'NumpadDecimal',
    NumpadDivide: 'NumpadDivide',
    NumpadEnter: 'NumpadEnter',
    NumpadMultiply: 'NumpadMultiply',
    NumpadSubtract: 'NumpadSubtract',
    PageDown: 'PageDown',
    PageUp: 'PageUp',
    Pause: 'Pause',
    Period: 'Period',
    PrintScreen: 'PrintScreen',
    Quote: 'Quote',
    ScrollLock: 'ScrollLock',
    Semicolon: 'Semicolon',
    ShiftLeft: 'ShiftLeft',
    ShiftRight: 'ShiftRight',
    Slash: 'Slash',
    Space: 'Space',
    Tab: 'Tab',
    // Add more keys as needed
};