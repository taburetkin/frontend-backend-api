import { 
    defaultBackboneBuildSendRequestArguments, 
    defaultJqueryBuildSendRequestArguments 
} from "./defaults.js";
import { BaseOptionsNormalizer } from './baseOptionsNormalizer.js'
import { OptionsNormalizer } from "./optionsNormalizer.js";
import { getEntityUrl, triggerOnEntity } from "./utils.js";

// sendOptions = {
//     url: String,
//     method: String,
//     headers: Object,
//     entity: Object
// }

const defaultHeaders = { 
    'Content-Type': 'application/json; charset=UTF-8' 
};

class BackendApi {

    constructor(options = {}) {

        this.headers = options.headers || defaultHeaders;
        if (options.sync) {
            this.defaultSync = options.sync.bind(this);
        }
        this.initializeSendRequest(options);

        this.optionsNormalizer = this.buildOptionsNormalizer(options.optionsNormalizer || OptionsNormalizer);
    }

    initializeSendRequest(options) {
        let { jquerySend, backboneSend, sendRequest, buildSendRequestArguments } = options;
        sendRequest = jquerySend || backboneSend || sendRequest;
        if (sendRequest) {
            this.sendRequest = sendRequest;
        }

        if (!buildSendRequestArguments && jquerySend) {
            buildSendRequestArguments = defaultJqueryBuildSendRequestArguments;
        }

        if (!buildSendRequestArguments && backboneSend) {
            buildSendRequestArguments = defaultBackboneBuildSendRequestArguments;
        }


        if (buildSendRequestArguments) {
            this.buildSendRequestArguments = buildSendRequestArguments.bind(this);
        }

    }

    buildOptionsNormalizer(Normalizer) {
        return new Normalizer();
    }

    ///===============================================================///

    
    send(options) {
        let { entity } = options;
        let sendRequestArguments = this.buildSendRequestArguments(options);
        let req = this.sendRequest(...sendRequestArguments).then(data => this.afterSend(data, options));
        if (options.shouldTriggerRequest !== false) {
            triggerOnEntity(entity, 'request', entity, req, options);
        }
        return req;
    }

    afterSend(data, options) {
        let { sync, entity } = options;
        let returnValue = entity || data;
        if (sync && entity) {
            sync(data, entity, options);
        }
        return returnValue;
    }

    // fetch implementation by default
    sendRequest(...args) {
        return fetch(...args).then(resp => {
            if (resp.ok && resp.status !== 204) {
                return resp.json();
            }
            return resp.text();
        });
    }

    // for fetch implementation by default
    buildSendRequestArguments(options) {
        let url = this._getUrl(options);
        let body;
        let { method, attrs, headers } = options;
        if (attrs) {
            body = JSON.stringify(attrs);
        }
        let sendOptions = { method, body, headers };
        return [url, sendOptions];
    }


    _send(method, args) {
        let options = this.normalizeOptions(method, args);
        return this.send(options);
    }

    normalizeOptions(method, args, context = {}) {
        let options = this.optionsNormalizer.normalize(method, args, context);
        options = this.populateSendOptions(options);
        return options;
    }
    populateSendOptions(options, method, args) {
        if (!options.sync && options.useDefaultSync) {
            options.sync = this.defaultSync;
        }
        if (options.shouldMergeHeaders !== false) {
            options.headers = Object.assign({}, this.headers, options.headers);
        }
        if (!options.headers['Content-Type']) {
            options.headers['Content-Type'] = 'application/json; charset=UTF-8';
        }
        return options;
    }

    // the default API:
    // get() => error
    // get('asd/qwe') => Promise<data>
    // get('asd/qwe', options) => Promise<data|entity>
    // get('asd/qwe', syncFn) => Promise<data>
    // get('asd/qwe', syncFn, options) => Promise<data>
    // get(entity) => Promise<entity>, sync by default
    // get(entity, 'add/url') => Promise<entity>, no sync by default
    // get(entity, options) => Promise<entity>, sync by default if no additional url otherwise not syncing
    // get(entity, syncFn) => Promise<entity>
    // get(entity, 'add/url', syncFn)
    get() {
        return this._send('get', arguments);
    }

    // delete has the same signatures like the get method.
    delete() { 
        return this._send('delete', arguments);
    }

    
    // the default API:
    // post() => error
    // ----- url first: (string[, object | func][, object | func][, object]);
    // for providing only url and options 3arguments signature must be used: post('asd/qwe', null, options)
    // post('asd/qwe') => Promise<data>
    // post('asd/qwe', jsonData) => Promise<?>
    // post('asd/qwe', syncFn) => Promise<syncFn()>
    // post('asd/qwe', jsonData, options) => Promise<?>
    // post('asd/qwe', syncFn, options) => Promise<syncFn()>
    // post('asd/qwe', jsonData, syncFn) => Promise<?>
    // post('asd/qwe', jsonData, syncFn, options) => Promise<?>
    // ----- entity first: 
    // for providing only entity and options 3arguments signature must be used: post(entity, null, options)
    // for providing only entity, addUrl and options 4arguments signature must be used: post(entity, 'add/url', null, options)
    // post(entity) => Promise<entity>, sync by default, url from entity, empty body
    // post(entity, syncFn) => Promise<entity>
    // post(entity, jsonData) => Promise<entity>, sync by default
    // post(entity, syncFn, options) => Promise<entity>
    // post(entity, jsonData, options) => Promise<entity>, sync by default if no additional url otherwise not syncing
    // post(entity, jsonData, syncFn) => Promise<entity>, sync by default if no additional url otherwise not syncing
    // post(entity, jsonData, syncFn, options) => Promise<entity>, sync by default if no additional url otherwise not syncing
    // post(entity, 'add/url', syncFn) => Promise<entity>
    // post(entity, 'add/url', jsonData) => Promise<entity>, sync by default
    // post(entity, 'add/url', syncFn, options) => Promise<entity>
    // post(entity, 'add/url', jsonData, options) => Promise<entity>, sync by default if no additional url otherwise not syncing
    // post(entity, 'add/url', jsonData, syncFn) => Promise<entity>, sync by default if no additional url otherwise not syncing
    // post(entity, 'add/url', jsonData, syncFn, options) => Promise<entity>, sync by default if no additional url otherwise not syncing
    post() {
        return this._send('post', arguments);
    }

    // patch has the same signatures like the post method.
    patch() {
        return this._send('patch', arguments);      
    }

    // put has the same signatures like the post method
    put() {
        return this._send('put', arguments);
    }



    // post for new and patch for exist entity
    // only allowed entity first signatures
    save(entity) {
        if (!(entity && typeof entity === 'object')) {
            throw new Error('save method expect first argument being entity');
        }
        let method = this.isNewEntity(entity) ? 'post' : 'patch';
        let options = this.normalizeOptions(method, arguments);
        return this.send(options);
    }

    // get by default, but sometimes can be post
    fetch() {
        let options = this.normalizeOptions('get', arguments, { fetch: true });
        return this.send(options);
    }

    isNewEntity(entity) {
        if (typeof entity.isNew === 'function') {
            return entity.isNew();
        }
        return !entity.id;
    }

    setHeader(key, value) {
        if (value == null) {
            delete this.headers[key];
        }
        this.headers[key] = value;
    }

    setHeaders(headers, replace)
    {
        if (headers === null) {
            replace = true;
        }
        headers || (headers = {});
        if (replace) {
            this.headers = headers;
        } else {
            Object.assign(this.headers, headers);
        }
    }

    _getUrl(options) {
        
        if (!options) { return; }
        let { url, entity, relativeUrl = true } = options;

        if (url && !relativeUrl) {
            return url;
        }

        let entityUrl = this._getEntityUrl(entity);

        return (entityUrl || '') + (url || '');

    }

    _getEntityUrl(entity) {
        return getEntityUrl(entity);
    }


    defaultSync(data, entity, options) {
        if (!entity) return;

        if (options.method === 'DELETE') {
            if (entity.destroy) {
                entity.isNew = () => true;
                entity.destroy();
            }
        } else if (data && entity.set) {
            entity.set(data, options);
        }

        triggerOnEntity(entity, 'sync', entity, data, options);
    }

}

export {
    BackendApi,
    OptionsNormalizer,
    BaseOptionsNormalizer
}