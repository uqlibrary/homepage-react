import Immutable from 'immutable';

export const mutateKey = (data, oldKey, newKey) => {
    // const value = data[oldKey];
    data[newKey] = data[oldKey];
    delete data[oldKey];
    // return { [newKey]: value };
};

export const mutateObject = (data, key) => {
    const value = data[key];
    delete data[key];
    return value;
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
