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