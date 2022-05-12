import { normalize, withBodyArguments, withoutBodyArguments } from "./normalizeUtils.js";
import { isAbsoluteUrl } from "./utils.js";


const defaultMethodsMapping = {
    get: 'withoutBody',
    delete: 'withoutBody',
    post: 'withBody',
    patch: 'withBody',
    put: 'withBody',
}

export class OptionsNormalizer {

    constructor(options) {
        options = Object.assign({ withBodyArguments, withoutBodyArguments, methodsMapping: defaultMethodsMapping }, options);
        this.initialize(options);
    }
    
    initialize(options) {
        let { withBodyArguments, withoutBodyArguments, methodsMapping } = options;
        this.methodsMapping = { ...methodsMapping };
        this.withBody = normalize.bind(this, withBodyArguments); 
        this.withoutBody = normalize.bind(this, withoutBodyArguments); 
    }


    normalize(httpMethod, args, context) {

        if (!Array.isArray(args) || !args.length) {
            throw new Error('call signature mismatched');
        }

        let options = { method: httpMethod.toUpperCase() };
        
        let normalizeMethod = this.methodsMapping[httpMethod];
        
        options = this[normalizeMethod](options, args, context);

        let { url, sync, entity } = options;

        if (!url && !sync) {
            options.useDefaultSync = true;
        }

        if (url && options.relativeUrl == null) {
            options.relativeUrl = !isAbsoluteUrl(url);
        }

        return options;
    }

}


