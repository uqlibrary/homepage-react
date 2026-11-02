import React from 'react';
import { Map } from 'immutable';

const FormErrorsContext = React.createContext({
    formValues: Map({}),
});

export default FormErrorsContext;
