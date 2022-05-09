export function invokeValue(value, context, ...args) {
    if (typeof value === 'function') {
        value = value.apply(context, args);
    }
    return value;
}

export function invokeProperty(obj, key, ...args) {
    return invokeValue(obj[key], obj, ...args);
}

export function isAbsoluteUrl(url) {
    return /^https*\:\/\//g.test(url);
}

export function getEntityUrl(entity) {
    if (!entity) { return; }
    return invokeProperty(entity, 'url');
}

export function triggerOnEntity(entity, event, ...args) {
    if (!entity) { return; }
    let method = entity.triggerMethod || entity.trigger;
    if (method) {
        method.call(entity, event, ...args);
    }
}