import Immutable from 'immutable';

export const transformer = (originalFormValues, transformerRules) => {
    const immFormData = Immutable.fromJS(originalFormValues);
    const newFormData = immFormData.toJS();
    // reducer assumes each transform rule is a function, and must return
    // a keyed object
    const newVals = Object.keys(transformerRules).reduce(
        (prev, current) => ({ ...prev, ...transformerRules[current](newFormData) }),
        {},
    );
    return { ...newFormData, ...newVals };
};
