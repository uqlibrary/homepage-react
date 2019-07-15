import React, { PureComponent } from 'react';

import { Field } from 'redux-form/lib/immutable';
import PropTypes from 'prop-types';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { CommunitiesSelectField } from 'modules/SharedComponents/PublicationSubtype';
// import { CollectionsSelectField } from 'modules/SharedComponents/PublicationSubtype';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
// import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';
import DocumentTypeField from 'modules/SharedComponents/SearchComponent/components/Fields/DocumentTypeField';

import Grid from '@material-ui/core/Grid';

import { validation } from 'config';
import { default as componentLocale } from 'locale/components';
import { default as publicationForm } from 'locale/publicationForm';
import { Alert } from '../../SharedComponents/Toolbox/Alert';
import Button from '@material-ui/core/Button';

export class DigiTeamBatchImport extends PureComponent {
    static propTypes = {
        submitting: PropTypes.bool,
        formValues: PropTypes.object,
        docTypes: PropTypes.array,
        isLoading: PropTypes.bool,
        actions: PropTypes.object,
        handleSubmit: PropTypes.object,
        disableSubmit: PropTypes.bool,
    };

    static defaultProps = {
        docTypes: [],
    };

    constructor(props) {
        super(props);
        this.state = {
            rekMemberIdCommunity: null,
            rekMemberIdCollection: null,
            documentType: null,
        };
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log('nextProps: ', nextProps);
    // }

    _onCommunityChange = newCommunityPid => {
        let newState = {
            ...this.state,
            rekMemberIdCommunity: newCommunityPid,
        };
        if (newCommunityPid !== this.state.rekMemberIdCommunity) {
            // community has changed - clear the community
            newState = {
                ...newState,
                rekMemberIdCollection: null,
            };
        }

        this.setState({
            ...this.state,
            newState,
        });

        // load collection list
        this.props.actions &&
            this.props.actions.collectionsByCommunityList &&
            this.props.actions.collectionsByCommunityList(newCommunityPid);
    };

    _onCollectionChanged = newCollectionPid => {
        this.setState({
            ...this.state,
            rekMemberIdCollection: newCollectionPid,
        });
    };

    // _loadCollections = () => {
    //     console.log('_loadCollections');
    // };

    _onDocTypeChange = newDocType => {
        // Update the state with new values
        this.setState({
            ...this.state,
            documentType: newDocType,
        });
    };

    render() {
        const batchImportTxt = componentLocale.components.digiTeam.batchImport;
        // const publicationTypeTxt = componentLocale.publicationType;
        const AddACollectionTxt = publicationForm.addACollection; // check this is right...

        const alertProps = validation.getErrorAlertProps({
            ...this.props,
            alertLocale: {
                validationAlert: { ...publicationForm.validationAlert },
                progressAlert: { ...publicationForm.progressAlert },
                successAlert: { ...publicationForm.successAlert },
                errorAlert: { ...publicationForm.errorAlert },
            },
        });

        return (
            <StandardPage title={batchImportTxt.title}>
                <form>
                    <Grid container spacing={16}>
                        <Grid item xs={12}>
                            <StandardCard
                                title={batchImportTxt.formLabels.community.label}
                                help={batchImportTxt.details.community.help}
                            >
                                <Grid container spacing={16}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={CommunitiesSelectField}
                                            disabled={this.props.submitting}
                                            name="community_ismemberof"
                                            locale={AddACollectionTxt.formLabels.ismemberof}
                                            required
                                            validate={[validation.required]}
                                            onChange={this._onCommunityChange}
                                        />
                                    </Grid>
                                    {this.props.formValues &&
                                        this.props.formValues.get('community_ismemberof') &&
                                        this.props.formValues.get('community_ismemberof').length > 0 && (
                                        <Grid item xs={12}>
                                            <Field
                                                component={GenericSelectField}
                                                disabled={this.props.submitting}
                                                name="collection_ismemberof"
                                                // locale={batchImportTxt.formLabels.collection}
                                                required
                                                validate={[validation.required]}
                                                onChange={this._onCollectionChanged}
                                                // itemsList={communityCollectionsList}
                                                // itemsLoading={communityCollectionsLoading}
                                                {...batchImportTxt.formLabels.collection}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </StandardCard>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <StandardCard
                            title={batchImportTxt.formLabels.docType.label}
                            help={batchImportTxt.details.docType.help}
                        >
                            <Grid container spacing={16}>
                                <Grid item xs={12}>
                                    <DocumentTypeField
                                        docTypes={this.props.docTypes}
                                        updateDocTypeValues={this._onDocTypeChange}
                                        disabled={this.props.isLoading}
                                        disableMultiple
                                        locale={batchImportTxt.formLabels.docType}
                                        required
                                    />
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>

                    {/* <p>directory will go here</p> */}

                    {alertProps && (
                        <Grid item xs={12}>
                            <Alert {...alertProps} />
                        </Grid>
                    )}

                    <Grid container spacing={16}  style={{ paddingTop: 12 }}>
                        <Grid item xs={false} sm />
                        <Grid item xs={12} sm="auto">
                            <Button
                                variant="contained"
                                fullWidth
                                children={batchImportTxt.formLabels.cancelButtonLabel}
                                aria-label={batchImportTxt.formLabels.cancelButtonLabel}
                                disabled={this.props.submitting}
                                onClick={this._restartWorkflow}
                            />
                        </Grid>
                        <Grid item xs={12} sm="auto">
                            <Button
                                id="submit-data-collection"
                                variant="contained"
                                color="primary"
                                fullWidth
                                children={batchImportTxt.formLabels.submitButtonLabel}
                                aria-label={batchImportTxt.formLabels.submitButtonLabel}
                                onClick={this.props.handleSubmit}
                                disabled={this.props.submitting || this.props.disableSubmit}
                            />
                        </Grid>
                    </Grid>
                </form>
            </StandardPage>
        );
    }
}

export default DigiTeamBatchImport;
