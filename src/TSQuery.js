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

  constructor(middlewares) {
    this.middlewares = [DefaultMiddleware];
    if (middlewares) this.middlewares = [...this.middlewares, middlewares];
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
      const { result, error, status } = await this.send(
        url,
        method,
        { ...options, cacheEnabled: false },
        body
      );
      toSave.result = result;
      toSave.error = error;
      toSave.status = status;
    };
    const interval = TS.createInterval(updateValue, refetchTimeInMs);
    const removeInterval = () => clearInterval(interval);
    return removeInterval;
  };

  send = async (url, method, options, body) => {
    const cacheEnabled = options.cacheEnabled;
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
    else resultObj = await this.fetch(url, options, reqAction);
    this.callMiddlewares(reqAction);
    if (cacheEnabled) cacheRequest(url, method, options, body, resultObj);
    return resultObj;
  };

  fetch = async (url, options, reqAction) => {
    const response = await fetch(url, options);
    if (response.ok) {
      reqAction.responseStatus = TSQuery.STATUS.SUCCESS;
      return {
        result: await this.convertResponseToData(response),
        status: response.status,
      };
    } else {
      reqAction.responseStatus = TSQuery.STATUS.ERROR;
      reqAction.error = await this.convertResponseToData(response);
      return {
        error: await this.convertResponseToData(response),
        status: response.status,
      };
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
    console.log(
      `ERROR ${action.requestMethod} request: ${action.requestUrl} ${requestTime}`
    );
});
