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
    value = TS.uniqueReplaceAll(value, "MM", convertTwoDigit(date.getMonth() + 1));
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

class TSNavigator {

    paths = {};

    history = [];

    constructor(initPaths) {
        this.paths = initPaths;
        const initialPageName = TS.param("page");
        if (!initialPageName || !this.paths.hasOwnProperty(initialPageName)) {
            TS.initializeTemplate("SysError", "Page not found: 404").then(response => document.body.appendChild(response));
            return;
        }
        TS.initializeTemplate(this.paths[initialPageName][0], this.paths[initialPageName][1]).then(response => document.body.appendChild(response));
        this.history.push(initialPageName);
    }

    goToPage = (pageName, saveHistory = true, ...args) => {
        TS.qAll("body > :not(script)").forEach(el => el.remove());
        TS.initializeTemplate(this.paths[pageName], ...args).then(response => document.body.appendChild(response));
        if (saveHistory) this.history.push(pageName);
    }

    goBack = async (deleteHistory = true) => {
        if (deleteHistory && this.history.length > 1) this.history.pop();
        let historyIndex;
        if (this.history.length === 1) historyIndex = 0;
        else if (deleteHistory) historyIndex = this.history.length - 1;
        else historyIndex = this.history.length - 2;
        await this.goToPage(this.history[historyIndex], !deleteHistory);
    }
}

class TSQuery {
    static METHOD = {
        GET: "GET",
        HEAD: "HEAD",
        POST: "POST",
        PUT: "PUT",
        DELETE: "DELETE",
        CONNECT: "CONNECT",
        OPTIONS: "OPTIONS",
        TRACE: "TRACE",
        PATCH: "PATCH",
    };

    static STATUS = {
        ERROR: "ERROR",
        SUCCESS: "SUCCESS",
    };

    constructor(...middlewares) {
        this.middlewares = [DefaultMiddleware];
        if (middlewares) this.middlewares = [...this.middlewares, ...middlewares];
    }

    refetchRequest = async (
        toSave,
        refetchTimeInMs,
        url,
        method,
        options,
        body
    ) => {
        const updateValue = async () => {
            const {result, error, status} = await this.send(
                url,
                method,
                {...options, cacheEnabled: false},
                body
            );
            toSave.result = result;
            toSave.error = error;
            toSave.status = status;
        };
        const interval = TS.createInterval(updateValue, refetchTimeInMs);
        return () => clearInterval(interval);
    };

    send = async (url, method, options, body) => {
        const cacheEnabled = options ? options.cacheEnabled : false;
        options = {
            ...options,
            method: method,
            body: body,
            cacheEnabled: undefined,
        };
        let resultObj;
        const reqAction = {
            requestUrl: url,
            request: this.send,
            requestMethod: method,
            requestBody: body,
            requestOptions: options,
        };

        const cachedRequest = cacheEnabled
            ? getRequestFromCache(url, method, options, body)
            : false;
        if (cachedRequest) resultObj = cachedRequest;
        else {
            resultObj = await this.fetch(url, options, reqAction);
            this.callMiddlewares(reqAction);
        }
        if (cacheEnabled) await cacheRequest(url, method, options, body, resultObj);
        return resultObj;
    };

    fetch = async (url, options, reqAction) => {
        try {
            const response = await fetch(url, options);
            if (response.ok) {
                reqAction.responseStatus = TSQuery.STATUS.SUCCESS;
                return {
                    result: await this.convertResponseToData(response),
                    status: response.status,
                };
            } else {
                reqAction.responseStatus = TSQuery.STATUS.ERROR;
                reqAction.error = await response.text();
                return {
                    error: await response.text(),
                    status: response.status,
                };
            }
        } catch (error) {
            if (error instanceof TypeError) {
                reqAction.responseStatus = TSQuery.STATUS.ERROR;
                reqAction.error = {message: 'Network error'};
                return {
                    error: 'Network error',
                    status: 0
                };
            } else if (error instanceof Response) {
                const errorData = await this.convertResponseToData(error);
                reqAction.responseStatus = TSQuery.STATUS.ERROR;
                reqAction.error = errorData;
                return {
                    error: errorData,
                    status: error.status,
                };
            } else {
                reqAction.responseStatus = TSQuery.STATUS.ERROR;
                reqAction.error = 'An error occurred';
                return {
                    error: 'An error occurred',
                    status: 500,
                };
            }
        }
    };

    convertResponseToData = async (response) => {
        if (response.headers.get("Content-Type").includes("application/json"))
            return await response.json();
        if (response.headers.get("Content-Type").includes("plain/text"))
            return await response.text();
    };

    callMiddlewares = (action) => {
        this.middlewares.forEach(
            async (middleware) => await middleware.call(action)
        );
    };
}

class Middleware {
    constructor(func) {
        this.call = func;
    }
}

const cacheRequest = async (url, method, options, body, resultObj) => {
    const jsonRequest = JSON.stringify({
        url,
        options,
        method,
        body,
    });
    if (sessionStorage.getItem(jsonRequest)) return;
    sessionStorage.setItem(jsonRequest, JSON.stringify(resultObj));
};

const getRequestFromCache = (url, method, options, body) => {
    const jsonRequest = JSON.stringify({
        url,
        options,
        method,
        body,
    });
    return JSON.parse(sessionStorage.getItem(jsonRequest));
};

const DefaultMiddleware = new Middleware((action) => {
    const requestTime = TSDate.formatDate(new Date(), "hh:mm:ss");
    if (action.responseStatus === TSQuery.STATUS.SUCCESS)
        console.log(
            `${action.requestMethod} request: ${action.requestUrl} - ${requestTime}`
        );
    else
        console.error(
            `ERROR ${action.requestMethod} request: ${action.requestUrl} ${requestTime}`
        );
});
