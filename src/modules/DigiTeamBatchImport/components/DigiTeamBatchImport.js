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

export class DigiTeamBatchImport extends PureComponent {
    static propTypes = {
        submitting: PropTypes.bool,
        formValues: PropTypes.object,
        docTypes: PropTypes.array,
        isLoading: PropTypes.bool,
        actions: PropTypes.object,
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

        const doctypeLocale = {
            title: 'Work type',
            hint: 'Select document type',
            ariaLabel: 'Select a publications type',
        };

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
                                        locale={doctypeLocale}
                                        required
                                    />
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>

                    {/* <p>directory will go here</p> */}
                </form>
            </StandardPage>
        );
    }
}

export default DigiTeamBatchImport;
