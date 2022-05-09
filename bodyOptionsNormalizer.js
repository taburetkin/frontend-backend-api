import { BaseOptionsNormalizer } from "./baseOptionsNormalizer";

function executer(arr, index, arg, options, context) {
    let callback = arr[index];
    if (!callback) return;
    callback(arg, options, context);
}

export class BodyOptionsNormalizer extends BaseOptionsNormalizer {
    constructor(argumentsArray) {
        super();
        this._byArgNumber = [ ...argumentsArray ];
    }

    normalize(method, args, context = {}) {
        if (!args.length) {
            throw new Error(method + ' fail. no arguments were provided');
        }

        let options = {
            method: method.toUpperCase()
        };


        Array.prototype.forEach.call(args, (arg, index) => executer(this._byArgNumber, index, arg, options, context));

        return options;
    }
}