class TS {

    static templates = {};

    static addTemplate = (template) => {
        if (this.templates.hasOwnProperty(template.name)) return;
        this.templates[template.name] = template;
    }

    static initializeTemplate = (name, ...args) => {
        if (!this.templates.hasOwnProperty(name)) throw new Error(`Template ${name} does not exist`);
        return this.fromHTML(this.templates[name](...args));
    }

    static initializeHTMLTemplate = (name, ...args) => {
        return this.templates[name](...args);
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
}

class TSNavigator {

    paths = {};

    constructor(initPaths) {
        this.paths = initPaths;
        document.body.appendChild(TS.initializeTemplate(initPaths[TS.param("page")]));
    }

    gotoPage(pageName) {
        TS.qAll("body > :not(script)").forEach(el => el.remove());
        document.body.appendChild(TS.initializeTemplate(this.paths[pageName]));
    }
}

class TSDate {

    static formatDate = (date, value) => {
        value = formatYear(date, value);
        value = formatHour(date, value);
        value = formatDay(date, value);
        value = formatMinute(date, value);
        value = formatSecond(date, value);
        value = formatMonth(date, value);
        value = formatWeekDay(date, value);
        return value;
    }
}

const formatYear = (date, value) => {
    value = TS.uniqueReplaceAll(value, "yyyy", date.getFullYear(), true);
    value = TS.uniqueReplaceAll(value, "yy", date.toLocaleDateString("default", { year: "2-digit"}), true);
    return value;
}

const formatHour = (date, value) => {
    value = TS.uniqueReplaceAll(value, "hh12", date.toLocaleTimeString("default", {hour: "2-digit", hour12: true}).replace(" ", ""), true);
    value = TS.uniqueReplaceAll(value, "hh", convertTwoDigit(date.getHours()), true);
    value = TS.uniqueReplaceAll(value, "h12", date.toLocaleTimeString("default", {hour: "numeric", hour12: true}).replace(" ", ""), true);
    value = TS.uniqueReplaceAll(value, "h", date.getHours(), true);
    return value;
}

const formatMonth = (date, value) => {
    value = TS.uniqueReplaceAll(value, "MMMM", date.toLocaleDateString("default", {month: "long"}))
    value = TS.uniqueReplaceAll(value, "MMM", date.toLocaleDateString("default", {month: "short"}));
    value = TS.uniqueReplaceAll(value, "MM", convertTwoDigit(date.getMonth()));
    value = TS.uniqueReplaceAll(value, "M", date.toLocaleDateString("default", {month: "numeric"}));
    return value;
}

const formatDay = (date, value) => {
    value = TS.uniqueReplaceAll(value, "dd", convertTwoDigit(date.getDate()), true);
    value = TS.uniqueReplaceAll(value, "d", date.getDate(), true);
    return value;
}

const formatWeekDay = (date, value) => {
    value = TS.uniqueReplaceAll(value, "wwww", date.toLocaleDateString("default", {weekday: "long"}), true);
    value = TS.uniqueReplaceAll(value, "www", date.toLocaleDateString("default", {weekday: "short"}), true);
    value = TS.uniqueReplaceAll(value, "ww", date.toLocaleDateString("default", {weekday: "narrow"}), true);
    value = TS.uniqueReplaceAll(value, "w", date.getDay(), true);
    return value;
}

const formatMinute = (date, value) => {
    value = TS.uniqueReplaceAll(value, "mm", convertTwoDigit(date.getMinutes()));
    value = TS.uniqueReplaceAll(value, "m", date.getMinutes());
    return value;
}

const formatSecond = (date, value) => {
    value = TS.uniqueReplaceAll(value, "ss", convertTwoDigit(date.getSeconds()), true);
    value = TS.uniqueReplaceAll(value, "s", date.getSeconds(), true);
    return value;
}

const convertTwoDigit = (value) => {
    if (+value < 10) value = "0" + value;
    return value;
}