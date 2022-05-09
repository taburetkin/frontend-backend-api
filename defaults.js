export function defaultJqueryBuildSendRequestArguments(options) {
    let url = this._getUrl(options);
    let data = options.attrs;
    if (data) {
        data = JSON.stringify(data);
    }
    let { headers, method } = options;
    //let headers = Object.assign({}, this.headers, options.headers);
    let ajaxOptions = { method, data, headers, processData: false, };
    return [url, ajaxOptions];
}





const backboneDummyModel = {
    trigger() { }
}

var backboneMethodUnMap = {
    'POST' : 'create',
    'PUT': 'update',
    'PATCH': 'patch',
    'DELETE': 'delete',
    'GET': 'read'
};

export function defaultBackboneBuildSendRequestArguments(options) {
    options.shouldTriggerRequest = false;
    let model = options.entity || backboneDummyModel
    let method = backboneMethodUnMap[options.method];
    return [method, model, options];
}