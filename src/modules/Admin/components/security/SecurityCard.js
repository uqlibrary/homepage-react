import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import Grid from '@material-ui/core/Grid';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import OverrideSecurity from './OverrideSecurity';
import InheritedSecurityDetails from './InheritedSecurityDetails';
import DataStreamSecuritySelector from './DataStreamSecuritySelector';
import SecuritySelector from './SecuritySelector';

import { useRecordContext, useFormValuesContext } from 'context';
import { RECORD_TYPE_COLLECTION, RECORD_TYPE_RECORD, RECORD_TYPE_COMMUNITY } from 'config/general';
import { locale } from 'locale';

export const SecurityCard = ({ disabled }) => {
    const { record } = useRecordContext();
    const { formValues } = useFormValuesContext();

    const recordType = record.rek_object_type_lookup.toLowerCase();
    const { admin, ...rest } = locale.components.securitySection;
    const text = rest[recordType];

    const dataStreams = !!(formValues.dataStreams || {}).toJS ? formValues.dataStreams.toJS() : formValues.dataStreams;
    const isOverrideSecurityChecked = formValues.rek_security_inherited === 0;
    const securityPolicy = formValues.rek_security_policy;
    const dataStreamPolicy = formValues.rek_datastream_policy;

    const title = (
        <span>
            <b>{recordType}</b> level security - {record.rek_pid}
        </span>
    );

    /* istanbul ignore next */
    /**
     * Redux-form normalize callback
     */
    const overrideSecurityValueNormalizer = (value) => value ? 0 : 1;

    return (
        <Grid container spacing={16}>
            <Grid item xs={12} sm={12}>
                <Alert
                    type="warning"
                    title={admin.warning.title}
                    message={admin.warning.message}
                />
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={title} accentHeader>
                    <Grid container spacing={16}>
                        {
                            recordType === RECORD_TYPE_RECORD &&
                            <React.Fragment>
                                <Grid item xs={12}>
                                    <InheritedSecurityDetails
                                        collections={record.fez_record_search_key_ismemberof}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        component={OverrideSecurity}
                                        name="securitySection.rek_security_inherited"
                                        label="Override inherited security (detailed below)"
                                        normalize={overrideSecurityValueNormalizer}
                                    />
                                </Grid>
                            </React.Fragment>
                        }
                        {
                            (
                                recordType === RECORD_TYPE_COMMUNITY ||
                                recordType === RECORD_TYPE_COLLECTION ||
                                (recordType === RECORD_TYPE_RECORD && isOverrideSecurityChecked)
                            ) &&
                            <Grid item xs={12}>
                                <SecuritySelector
                                    disabled={disabled}
                                    text={text}
                                    fieldName="securitySection.rek_security_policy"
                                    recordType={recordType}
                                    securityPolicy={securityPolicy}
                                />
                            </Grid>
                        }
                        {
                            recordType === RECORD_TYPE_COLLECTION &&
                            <Grid item xs={12}>
                                <SecuritySelector
                                    disabled={disabled}
                                    text={{
                                        prompt: text.prompt,
                                        selectedTitle: text.dataStreamSelectedTitle
                                    }}
                                    fieldName="securitySection.rek_datastream_policy"
                                    recordType={recordType}
                                    securityPolicy={dataStreamPolicy}
                                />
                            </Grid>
                        }
                    </Grid>
                </StandardCard>
            </Grid>
            {
                !!dataStreams && dataStreams.length > 0 &&
                <Grid item xs={12}>
                    <StandardCard title={<span><b>Datastream</b> security - {record.rek_pid}</span>} accentHeader>
                        <Grid container spacing={8}>
                            {
                                dataStreams.length &&
                                <Grid item xs={12}>
                                    <Field
                                        component={DataStreamSecuritySelector}
                                        name="securitySection.dataStreams"
                                        {...{
                                            disabled,
                                            text: text.dataStream,
                                        }}
                                    />
                                </Grid>
                            }
                        </Grid>
                    </StandardCard>
                </Grid>
            }
        </Grid>
    );
};

SecurityCard.propTypes = {
    disabled: PropTypes.bool
};

function isSame(prevProps, nextProps) {
    return prevProps.disabled === nextProps.disabled;
}

export default React.memo(SecurityCard, isSame);

