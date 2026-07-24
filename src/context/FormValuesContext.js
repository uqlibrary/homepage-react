import React from 'react';
import { Map } from 'immutable';

const FormValuesContext = React.createContext({
    formValues: Map({}),
    onDeleteAttachedFile: () => {},
});

export default FormValuesContext;
