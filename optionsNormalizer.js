import { BaseOptionsNormalizer } from "./baseOptionsNormalizer.js";
import { BodyOptionsNormalizer } from "./bodyOptionsNormalizer.js";
import { withBodyArguments, withoutBodyArguments } from "./normalizeUtils.js";
import { isAbsoluteUrl } from "./utils.js";


const methodsMapping = {
    get: 'withoutBody',
    delete: 'withoutBody',
    post: 'withBody',
    patch: 'withBody',
    put: 'withBody',
}

export class OptionsNormalizer extends BaseOptionsNormalizer {

    constructor(options) {
        super();
        this.methodsMapping = { ...methodsMapping };
        this.withBody = this._buildWithBodyOptionsNormalizer(options); 
        this.withoutBody = this._buildWithoutBodyOptionsNormalizer(options);
        this.initialize(options);
    }

    _buildWithBodyOptionsNormalizer() {
        return new BodyOptionsNormalizer(withBodyArguments);
    }

    _buildWithoutBodyOptionsNormalizer() {
        return new BodyOptionsNormalizer(withoutBodyArguments);
    }

    normalize(httpMethod, args, context) {
        let normalizeMethod = this.methodsMapping[httpMethod];
        let options = this[normalizeMethod].normalize(httpMethod, args, context);

        let { url, sync, entity } = options;

        if (!url && !entity) {
            throw new Error('url or entity must be provided to perform a request');
        }

        if (!url && !sync) {
            options.useDefaultSync = true;
        }

        if (url && options.relativeUrl == null) {
            options.relativeUrl = !isAbsoluteUrl(url);
        }

        return options;
    }

}


