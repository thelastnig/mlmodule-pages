class FormatUtil {
    static excludeSpecialChar(value, isUserId = false) {
        if (!value) return;

        const regExp = (isUserId) ?
            /[ \{\}\[\]\/?,;:|\)*~`!^+┼<>\#$%&\'\"\\\(\=]/gi :
            /[ \{\}\[\]\/?.,;:|\)*~`!^+┼<>@\#$%&\'\"\\\(\=]/gi;

        if (value.match(regExp)) {
            value = value.replace(regExp, '');
        }

        return value;
    };

    static isEmpty(value) {
        if (value === null) return true;
        if (value === undefined) return true;
        if (FormatUtil.isString(value) && value === '') return true;
        if (FormatUtil.isArray(value) && value.length < 1) return true;
        if (FormatUtil.isObject(value) && Object.keys(value).length < 1 && Object.getOwnPropertyNames(value) < 1)
            return true;
        if (typeof value === 'object' && value.constructor.name === 'String' && Object.keys(value).length < 1)
            return true;

        return false;
    };

    static isString(value) {
        return typeof value === 'string';
    }

    static isArray(value) {
        return Array.isArray(value);
    }

    static isObject(value) {
        return typeof value === 'object' && value.constructor.name === 'Object'
    }
}

export default FormatUtil;