/* istanbul ignore file */
import Immutable from 'immutable';

export const mutateKey = (data, oldKey, newKey) => {
    data[newKey] = data[oldKey];
    delete data[oldKey];
};

export const mutateObject = (data, key) => {
    const value = data[key];
    delete data[key];
    return value;
};

export const mutateClearObject = (data, key) => {
    delete data[key];
    return undefined;
};

export const transformer = (originalFormValues, transformerRules) => {
    const immFormData = Immutable.fromJS(originalFormValues);
    const newFormData = immFormData.toJS();
    // reducer assumes each transform rule is a function, and must return
    // a keyed object
    const newVals = Object.keys(transformerRules).reduce(
        (prev, current) => ({ ...prev, ...transformerRules[current](prev, newFormData) }),
        {},
    );
    return { ...newFormData, ...newVals };
};
