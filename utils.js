export function invokeValue(value, context, ...args) {
    if (typeof value === 'function') {
        value = value.apply(context, args);
    }
    return value;
}

export function invokeProperty(obj, key, ...args) {
    if (obj == null) { return; }
    return invokeValue(obj[key], obj, ...args);
}

export function isAbsoluteUrl(url) {
    return /^https*\:\/\//g.test(url);
}

export function getEntityUrl(entity, ...args) {
    return invokeProperty(entity, 'url', ...args);
}

export function triggerOnEntity(entity, event, ...args) {

    if (!entity) { return; }

    if (typeof entity.triggerMethod === 'function') {

        entity.triggerMethod(event, ...args);

    } else if (typeof entity.trigger === 'function') {

        entity.trigger(event, ...args);
    }
}