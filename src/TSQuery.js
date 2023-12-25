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

    static request = async (url, method, options, body) => {
        options = { ...options, method: method, body: body };
        try {
            const response = await fetch(url, options);
            let result = response;
            if (response.headers.get("Content-Type").includes("application/json")) result = await response.json();
            return { result, request: response };
        }
        catch (err) {
            return { error: err };
        }
    }
}