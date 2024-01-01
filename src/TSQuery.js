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
