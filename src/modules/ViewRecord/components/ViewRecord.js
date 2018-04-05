import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {InlineLoader} from 'uqlibrary-react-toolbox/build/Loaders';
import {StandardPage} from 'uqlibrary-react-toolbox/build/StandardPage';
import {Alert} from 'uqlibrary-react-toolbox/build/Alert';
import {PublicationCitation} from 'modules/SharedComponents/PublicationCitation';
import {locale} from 'locale';
import Files from './Files';
import PublicationDetails from './PublicationDetails';
import AdditionalInformation from './AdditionalInformation';
import GrantInformation from './GrantInformation';
import RelatedPublications from './RelatedPublications';
import Links from './Links';

export default class ViewRecord extends PureComponent {
    static propTypes = {
        recordToView: PropTypes.object,
        loadingRecordToView: PropTypes.bool,
        recordToViewError: PropTypes.string,
        match: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        hideCulturalSensitivityStatement: PropTypes.bool
    };

    componentDidMount() {
        if (this.props.actions && !this.props.recordToView) {
            this.props.actions.loadRecordToView(this.props.match.params.pid);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.recordToView !== nextProps.recordToView
            || this.state !== nextState;
    }

    componentWillUnmount() {
        // clear previously selected record
        if (this.props.actions) {
            this.props.actions.clearRecordToView();
        }
    }

    render() {
        const txt = locale.pages.viewRecord;
        const {loadingRecordToView, recordToViewError, recordToView, actions} = this.props;

        if(loadingRecordToView) {
            return (
                <div className="is-centered">
                    <InlineLoader message={txt.loadingMessage}/>
                </div>
            );
        } else if(recordToViewError) {
            return (
                <StandardPage>
                    <Alert message={recordToViewError} />
                </StandardPage>
            );
        } else if(!recordToView) {
            return <div className="empty"/>;
        }

        return (
            <StandardPage className="viewRecord" title={recordToView.rek_title}>
                <PublicationCitation publication={recordToView} hideTitle />

                <RelatedPublications
                    title={locale.viewRecord.sections.relatedPublications.title}
                    publication={recordToView}
                    actions={actions}
                    field={'fez_record_search_key_has_related_datasets'}
                    subKey={'rek_has_related_datasets'}
                />

                <Files
                    publication={recordToView}
                    hideCulturalSensitivityStatement={this.props.hideCulturalSensitivityStatement}
                    setHideCulturalSensitivityStatement={this.props.actions.setHideCulturalSensitivityStatement} />

                <Links publication={recordToView}/>

                <AdditionalInformation publication={recordToView} />

                <GrantInformation publication={recordToView} />

                <PublicationDetails publication={recordToView} />

                <RelatedPublications
                    title={locale.viewRecord.sections.availableVersions}
                    publication={recordToView}
                    actions={actions}
                    field={'fez_record_search_key_has_derivations'}
                    subKey={'rek_has_derivations'}
                    showPublicationTitle
                />
            </StandardPage>
        );
    }
}
