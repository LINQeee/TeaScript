class TeaDate {

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
    value = TeaScript.uniqueReplaceAll(value, "yyyy", date.getFullYear(), true);
    value = TeaScript.uniqueReplaceAll(value, "yy", date.toLocaleDateString("default", { year: "2-digit"}), true);
    return value;
}

const formatHour = (date, value) => {
    value = TeaScript.uniqueReplaceAll(value, "hh12", date.toLocaleTimeString("default", {hour: "2-digit", hour12: true}).replace(" ", ""), true);
    value = TeaScript.uniqueReplaceAll(value, "hh", convertTwoDigit(date.getHours()), true);
    value = TeaScript.uniqueReplaceAll(value, "h12", date.toLocaleTimeString("default", {hour: "numeric", hour12: true}).replace(" ", ""), true);
    value = TeaScript.uniqueReplaceAll(value, "h", date.getHours(), true);
    return value;
}

const formatMonth = (date, value) => {
    value = TeaScript.uniqueReplaceAll(value, "MMMM", date.toLocaleDateString("default", {month: "long"}))
    value = TeaScript.uniqueReplaceAll(value, "MMM", date.toLocaleDateString("default", {month: "short"}));
    value = TeaScript.uniqueReplaceAll(value, "MM", convertTwoDigit(date.getMonth()));
    value = TeaScript.uniqueReplaceAll(value, "M", date.toLocaleDateString("default", {month: "numeric"}));
    return value;
}

const formatDay = (date, value) => {
    value = TeaScript.uniqueReplaceAll(value, "dd", convertTwoDigit(date.getDate()), true);
    value = TeaScript.uniqueReplaceAll(value, "d", date.getDate(), true);
    return value;
}

const formatWeekDay = (date, value) => {
    value = TeaScript.uniqueReplaceAll(value, "wwww", date.toLocaleDateString("default", {weekday: "long"}), true);
    value = TeaScript.uniqueReplaceAll(value, "www", date.toLocaleDateString("default", {weekday: "short"}), true);
    value = TeaScript.uniqueReplaceAll(value, "ww", date.toLocaleDateString("default", {weekday: "narrow"}), true);
    value = TeaScript.uniqueReplaceAll(value, "w", date.getDay(), true);
    return value;
}

const formatMinute = (date, value) => {
    value = TeaScript.uniqueReplaceAll(value, "mm", convertTwoDigit(date.getMinutes()));
    value = TeaScript.uniqueReplaceAll(value, "m", date.getMinutes());
    return value;
}

const formatSecond = (date, value) => {
    value = TeaScript.uniqueReplaceAll(value, "ss", convertTwoDigit(date.getSeconds()), true);
    value = TeaScript.uniqueReplaceAll(value, "s", date.getSeconds(), true);
    return value;
}

const convertTwoDigit = (value) => {
    if (+value < 10) value = "0" + value;
    return value;
}

class TeaScript {

    static templates = {};

    static addTemplate = (template) => {
        if (this.templates.hasOwnProperty(template.name)) throw new Error(`Template with name ${template.name} already exists`);
        this.templates[template.name] = template;
    }

    static createTemplate = (name, ...args) => {
        return fromHTML(this.templates[name](...args));
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
}

let fromHTML = (html, trim = true) => {
    html = trim ? html : html.trim();
    if (!html) return null;

    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content.children[0];

}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TeaScript, TeaDate };
}