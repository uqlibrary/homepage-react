import React from 'react';
import PropTypes from 'prop-types';
import { Controller as Base } from 'react-hook-form';
import { get } from 'lodash';

/**
 * Decorate react-hook-form's `field` object with the additional attributes our field components expect.
 *
 * `inputRef` is provided because MUI inputs take a ref via that prop name, while `ref` is nulled so it is
 * not forwarded twice. `state` collapses the parts of `fieldState`/`formState` a dumb field actually needs,
 * so field components never have to know about react-hook-form itself.
 */
export const getDecoratedField = (field, fieldState, formState) => ({
    ...field,
    inputRef: field.ref,
    ref: null,
    state: {
        error: fieldState.error?.message,
        defaultValue: get(formState?.defaultValues, field.name),
    },
});

/**
 * An extended react-hook-form <Controller>, whose `render` receives the decorated field above.
 *
 * Customisations relevant to specific components and cases should be added to a new component that extends
 * this one, rather than by growing this one.
 */
const Controller = ({ render, ...props }) => (
    <Base
        {...props}
        defaultValue={props.state?.defaultValue ?? ''}
        render={({ field, fieldState, formState }) =>
            render({
                field: getDecoratedField(field, fieldState, formState),
                fieldState,
                formState,
            })
        }
    />
);

Controller.propTypes = {
    render: PropTypes.func.isRequired,
    state: PropTypes.shape({
        defaultValue: PropTypes.any,
    }),
};

export default Controller;
