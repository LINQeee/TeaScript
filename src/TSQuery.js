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
        PATCH: "PATCH"
    }

    static request = (url, method, body, options) => new Promise(resolve => {
        options = {...options, method: method, body: body};
        let error = undefined;
        let result = undefined;

        fetch(url, options)
            .then(response => result = response)
            .catch(err => error = err);

        resolve({result, error});
    });
}