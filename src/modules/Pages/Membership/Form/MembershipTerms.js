import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';

import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { getFieldValidators, isFieldVisible } from '../membershipFieldRules';
import { getFieldConfig } from '../membershipFormFields';
import ConfigText from '../SharedComponents/ConfigText';
import locale from '../membership.locale';

const { terms } = locale;

/**
 * The tick box the two alumni types must check before they can apply.
 *
 * The checkbox is its own control with its own label, and its error is tied to it with aria-describedby, so a
 * screen reader user is told what is wrong with it rather than only seeing the form refuse to go.
 */
export const TermsCheckbox = React.forwardRef((props, ref) => {
    const { state, inputRef, value, ...rest } = props;
    const errorMessage = state?.error;

    return (
        <>
            <FormControlLabel
                control={
                    <Checkbox
                        {...rest}
                        ref={ref}
                        inputRef={inputRef}
                        checked={!!value}
                        id="accept_mandatory_terms"
                        inputProps={{
                            'data-testid': 'accept_mandatory_terms-input',
                            'aria-invalid': !!errorMessage,
                            ...(errorMessage ? { 'aria-describedby': 'accept_mandatory_terms-helper-text' } : {}),
                        }}
                    />
                }
                label={getFieldConfig('accept_mandatory_terms').label}
            />
            {!!errorMessage && (
                <FormHelperText
                    error
                    id="accept_mandatory_terms-helper-text"
                    data-testid="accept_mandatory_terms-error"
                >
                    {errorMessage}
                </FormHelperText>
            )}
        </>
    );
});

TermsCheckbox.propTypes = {
    value: PropTypes.any,
    state: PropTypes.shape({ error: PropTypes.string }),
    inputRef: PropTypes.any,
};

TermsCheckbox.displayName = 'TermsCheckbox';

/**
 * What the applicant is agreeing to.
 *
 * The two alumni types tick a box, because their entitlements are narrower than people expect. Every other type
 * agrees by submitting, and sees the agreements its own config carries.
 */
export const MembershipTerms = ({ type, control, current }) => {
    const mustAcceptTerms = isFieldVisible('accept_mandatory_terms', type);

    return (
        <div data-testid="membership-terms">
            {!mustAcceptTerms && <Typography>{terms.submissionIndicatesAgreement}</Typography>}

            {!!mustAcceptTerms && (
                <Field
                    name="accept_mandatory_terms"
                    control={control}
                    component={TermsCheckbox}
                    validate={getFieldValidators('accept_mandatory_terms', type)}
                />
            )}

            <ul>
                {!!mustAcceptTerms && (
                    <li>
                        <a href={terms.alumniServices.url} target="_blank" rel="noopener noreferrer">
                            {terms.alumniServices.label}
                        </a>
                    </li>
                )}
                {terms.policies.map(policy => (
                    <li key={policy.url}>
                        <a href={policy.url} target="_blank" rel="noopener noreferrer">
                            {policy.label}
                        </a>
                    </li>
                ))}
                {/* The agreements a type's own config adds. The alumni types state theirs above instead. */}
                {!mustAcceptTerms &&
                    (current?.agreement ?? []).map(agreement => (
                        <ConfigText key={agreement} component="li" text={agreement} />
                    ))}
            </ul>

            <Typography component="h2" variant="body1" sx={{ fontWeight: 'bold' }}>
                {terms.privacy.title}
            </Typography>
            <ConfigText component="p" data-testid="membership-privacy" text={terms.privacy.statement} />
        </div>
    );
};

MembershipTerms.propTypes = {
    type: PropTypes.string,
    control: PropTypes.object.isRequired,
    current: PropTypes.object,
};

export default MembershipTerms;
