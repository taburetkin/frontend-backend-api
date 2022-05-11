function setFirstUrl(url, options, context) {
    options.url = url;
    context.urlFirst = true;
}

function setSecondUrl(url, options, context, error) {
    if (context.urlFirst) {
        throw new Error(error);
    }
    options.url = url;
}

function setOptions(providedOptions, options, context) {
    Object.assign(options, providedOptions);
}

function setEntity(entity, options, context) {
    options.entity = entity;
}

function setSync(sync, options, context) {
    options.sync = sync;
}

function setData(attrs, options, context) {
    options.attrs = attrs;
    context.data = true;
}


function normalizeFirst(arg, options, context, withoutBody) {
    let urlFirst = typeof arg === 'string';
    if (urlFirst) {
        setFirstUrl(arg, options, context);
    } else {
        setEntity(arg, options, context);
    }
    context.withoutBody = withoutBody;
}


function optionsOrSync(arg, options, context, numberWord)
{
    let type = typeof arg;
    if (type === 'function') {
        setSync(arg, options, context);
    } else if (type === 'object') {
        setOptions(arg, options, context);
    } else {
        throw new Error(`wrong ${numberWord} argument: expected options object or sync function`);
    }
}

function optionsOnly(arg, options, context, numberWord) {
    if (!arg) return;
    if (typeof arg === 'object') {
        setOptions(arg, options, context);
    } else {
        throw new Error(`wrong ${numberWord} argument: expected options object`);
    }
}


    // get() => error
    // get('asd/qwe') => Promise<data>
    // get('asd/qwe', options) => Promise<data|entity>
    // get('asd/qwe', syncFn) => Promise<data>
    // get('asd/qwe', syncFn, options) => Promise<data>
    // get(entity) => Promise<entity>, sync by default
    // get(entity, options) => Promise<entity>, sync by default if no additional url otherwise not syncing
    // get(entity, syncFn) => Promise<entity>
    // get(entity, syncFn, options) => Promise<entity>
    // get(entity, 'add/url') => Promise<entity>, no sync by default, relative url by default
    // get(entity, 'add/url', syncFn) => Promise<entity>, relative url by default
    // get(entity, 'add/url', syncFn, options) => Promise<entity>, relative url by default
    // get(entity, 'add/url', options) => Promise<entity>, relative url by default

    // signature: string | entity, [string | options | syncFn ], [syncFn | options]

export const withoutBodyArguments = [

    // first argument must be an url string or entity object
    (arg, options, context) => {

        normalizeFirst(arg, options, context, true);

    },

    // second argument can be: options object, sync function, or add url string
    (arg, options, context) => {
        let type = typeof arg;
        if (type === 'string') {
            setSecondUrl(arg, options, context, 'wrong second argument type: expected sync function or options object');
        } else if (type === 'function') {

            setSync(arg, options, context);

        } else {
            setOptions(arg, options, context);
        }
    },

    // third argument can be: options object or sync function
    (arg, options, context) => {
        optionsOrSync(arg, options, context, 'third');
    },
    
    // fourth argument can be only an options object
    (arg, options, context) => {
        optionsOnly(arg, options, context, 'fourth');
    }

];


    // post() => error
    // ----- url first: (string[, object | func][, object | func][, object]);
    // for providing only url and options 3arguments signature must be used: post('asd/qwe', null, options)
    // post('asd/qwe') => Promise<data>
    // post('asd/qwe', jsonData) => Promise<?>
    // post('asd/qwe', jsonData, options) => Promise<?>
    // post('asd/qwe', syncFn) => Promise<syncFn()>
    // post('asd/qwe', syncFn, options) => Promise<syncFn()>
    // post('asd/qwe', jsonData, syncFn) => Promise<?>
    // post('asd/qwe', jsonData, syncFn, options) => Promise<?>
    // ----- entity first: 
    // for providing only entity and options 3arguments signature must be used: post(entity, null, options)
    // for providing only entity, addUrl and options 4arguments signature must be used: post(entity, 'add/url', null, options)
    // post(entity) => Promise<entity>, sync by default, url from entity, empty body
    // post(entity, syncFn) => Promise<entity>
    // post(entity, syncFn, options) => Promise<entity>
    // post(entity, jsonData) => Promise<entity>, sync by default
    // post(entity, jsonData, options) => Promise<entity>, sync by default if no additional url otherwise not syncing
    // post(entity, jsonData, syncFn) => Promise<entity>, sync by default if no additional url otherwise not syncing
    // post(entity, jsonData, syncFn, options) => Promise<entity>, sync by default if no additional url otherwise not syncing
    // post(entity, 'add/url', syncFn) => Promise<entity>
    // post(entity, 'add/url', syncFn, options) => Promise<entity>
    // post(entity, 'add/url', jsonData) => Promise<entity>, sync by default
    // post(entity, 'add/url', jsonData, options) => Promise<entity>, sync by default if no additional url otherwise not syncing
    // post(entity, 'add/url', jsonData, syncFn) => Promise<entity>, sync by default if no additional url otherwise not syncing
    // post(entity, 'add/url', jsonData, syncFn, options) => Promise<entity>, sync by default if no additional url otherwise not syncing    

export const withBodyArguments = [
    // first argument must be an url string or entity object
    (arg, options, context) => {

        normalizeFirst(arg, options, context);

    },

    // second argument can be: json data object, sync function, or add url string
    (arg, options, context) => {
        let type = typeof arg;
        if (type === 'string') {
            setSecondUrl(arg, options, context, 'wrong second argument type: expected sync function or json data object');
        } else if (type === 'function') {

            setSync(arg, options, context);

        } else {
            setData(arg, options, context);
        }
    },


    // third argument can be: options object, sync function or json data object
    (arg, options, context) => {
        let type = typeof arg;
        if (type === 'function') {
            setSync(arg, options, context);
        } else {
            if (arg && type === 'object') {
                if (context.data) {
                    setOptions(arg, options, context);
                } else {
                    setData(arg, options, context);
                }
            } else {
                throw new Error('wrong third argument: expected options object, sync function or json data object');
            }
        }
    },

    // fourth argument can be: options object or sync function
    (arg, options, context) => {
        optionsOrSync(arg, options, context, 'fourth');
    },

    // fifth argument can be only an options object
    (arg, options, context) => {
        optionsOnly(arg, options, context, 'fifth');
    }

];


export function normalize(argumentsParsersArray, options, args, context = {}) {

    const len = args.length < argumentsParsersArray.length 
        ? args.length 
        : argumentsParsersArray.length;

    for (let index = 0; index < len; index++) {
        let callback = argumentsParsersArray[index];
        let arg = args[index];
        callback(arg, options, context);
    }


    return options;
}
