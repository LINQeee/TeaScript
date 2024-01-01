class TS {

    static templates = {};

    static addTemplate = (name, func) => {
        if (this.templates.hasOwnProperty(name)) return;
        this.templates[name] = func;
    }

    static initializeTemplate = async (name, ...args) => {
        if (!this.templates.hasOwnProperty(name)) throw new Error(`Template ${name} does not exist`);
        return this.fromHTML(await this.templates[name](...args));
    }

    static initializeHTMLTemplate = (name, ...args) => {
        let initialized = this.templates[name](...args);
        if (TS.isPromise(initialized))
            initialized.then(response => initialized = response);
        return initialized;
    }

    static replace = (value, search, replacement, ignoreCase) => {
        if (!ignoreCase) return value.replace(search, replacement);
        let regEx = new RegExp(search, "ig");

        return value.replace(regEx, replacement);
    }

    static replaceAll = (value, search, replacement, ignoreCase) => {
        if (!ignoreCase) return value.replaceAll(search, replacement);
        let regEx = new RegExp(search, "ig");

        return value.replaceAll(regEx, replacement);
    }

    static uniqueReplace = (value, search, replacement, ignoreCase) => {
        if (!ignoreCase) {
            let regex = new RegExp(`(?<!\\w)${search}(?!\\w)`, 'g');
            return value.replace(regex, replacement);
        }
        let regex = new RegExp(`(?<!\\w)${search}(?!\\w)`, 'ig');
        return value.replace(regex, replacement);
    }
    static uniqueReplaceAll = (value, search, replacement, ignoreCase) => {
        if (!ignoreCase) {
            let regex = new RegExp(`(?<!\\w)${search}(?!\\w)`, 'g');
            return value.replaceAll(regex, replacement);
        }
        let regex = new RegExp(`(?<!\\w)${search}(?!\\w)`, 'ig');
        return value.replaceAll(regex, replacement);
    }

    static fromHTML = (html, trim = true) => {
        html = trim ? html : html.trim();
        if (!html) return null;

        const template = document.createElement('template');
        template.innerHTML = html;
        return template.content.children[0];
    }

    static toHTML = (element) => {
        return element.outerHTML.trim();
    }

    static q = (selector) => {
        return document.querySelector(selector);
    }

    static qAll = (selector) => {
        return document.querySelectorAll(selector);
    }

    static param = function getUrlParameter(sParam) {
        let sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return false;
    };

    static str = (str) => {
        return JSON.stringify(str.replace(/'/g, "\"")).replace(/"/g, "'");
    }

    static obj = (object) => {
        object = this.removeQuotes(object);
        return JSON.stringify(object).replace(/"/g, "'");
    }

    static removeQuotes = (object) => {
        const result = {};
        Object.keys(object).forEach(key => {
            const value = object[key];
            let escapedValue = value;

            if (typeof value === 'object') {
                escapedValue = this.removeQuotes(value);
            } else if (typeof value === 'string') {
                escapedValue = value.replace(/'/g, "\"");
            }

            result[key] = escapedValue;
        });
        return result;
    }

    static createInterval = (func, timeout, ...args) => {
        func();
        return setInterval(func, timeout, ...args);
    }

    static isPromise = (p) => {
        return p && Object.prototype.toString.call(p) === "[object Promise]";
    }
}

class Template {
    constructor(name, func) {
        TS.addTemplate(name, func);
    }
}

new Template("SysError", (message) => {
    return `<div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #171717; color: #fff; border-radius: 5px; font-size: 20px">${message}</div>`;
});