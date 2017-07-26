import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

// forms & custom components
import {PublicationsList} from 'modules/PublicationsList';
import {InlineLoader, StandardPage, StandardCard, ConfirmDialogBox} from 'uqlibrary-react-toolbox';

import {locale} from 'config';
import {searchPossiblyYourPublications, hidePublications} from 'actions';

export default class ClaimPublication extends React.Component {

    static propTypes = {
        publicationsList: PropTypes.array,
        loadingSearch: PropTypes.bool,
        history: PropTypes.object.isRequired,
        dispatch: PropTypes.func
    };
    constructor(props) {
        super(props);

        this.state = {
            publicationToHide: null
        };
    }

    componentDidMount() {
        this.props.dispatch(searchPossiblyYourPublications('uqifraze'));
    }

    _hidePublication = () => {
        if (this.state.publicationToHide) {
            this.props.dispatch(hidePublications([this.state.publicationToHide]))
                .then(() => {
                    this.props.dispatch(searchPossiblyYourPublications('uqifraze'));
                    this.setState({publicationToHide: null});
                });
        }
    }

    _confirmHidePublication = (item) => {
        this.setState({publicationToHide: item});
        this.hideConfirmationBox.showConfirmation();
    };

    _hideAllPublications = () => {
        this.props.dispatch(hidePublications(this.props.publicationsList))
            .then(() => {
                this.props.dispatch(searchPossiblyYourPublications('uqifraze'));
                this.setState({publicationToHide: null});
            });
    }

    _confirmHideAllPublications = () => {
        this.hideAllConfirmationBox.showConfirmation();
    };

    _claimPublication = (item) => {
        // TODO: pass item to claim form
        // TODO: route should not be hardcoded, should come from config/menu
        console.log('todo: pass item to claim form');
        console.log(item);
        // this.props.history.push('/claim-publications');
    }

    _navigateToDashboard = () => {
        // TODO: route should not be hardcoded, should come from config/menu
        // TODO: should navigation be handled by top-level container only, eg pass on as props:
        // TODO: this.props.navigateToDashboard() and this.props.navigateToClaimForm(item) <- fixes issue of linking item
        this.props.history.push('/dashboard');
    }

    render() {
        const txt = locale.pages.claimPublications;
        const actions = [
            {
                label: txt.searchResults.claim,
                handleAction: this._claimPublication
            },
            {
                label: txt.searchResults.hide,
                handleAction: this._confirmHidePublication
            }
        ];
        return (
            <StandardPage title={txt.title}>
                <ConfirmDialogBox onRef={ref => (this.hideAllConfirmationBox = ref)}
                                  onAction={this._hideAllPublications}
                                  locale={txt.hideAllPublicationsConfirmation} />

                <ConfirmDialogBox onRef={ref => (this.hideConfirmationBox = ref)}
                                  onAction={this._confirmHidePublication}
                                  locale={txt.hidePublicationConfirmation} />

                {
                    this.props.loadingSearch &&
                    <div className="is-centered">
                        <InlineLoader message={txt.loadingMessage} />
                    </div>
                }
                {
                    !this.props.loadingSearch && this.props.publicationsList.length === 0 &&
                    <StandardCard {...txt.noResultsFound}>
                        {txt.noResultsFound.text}
                    </StandardCard>
                }
                {
                    !this.props.loadingSearch && this.props.publicationsList.length > 0 &&
                    <div>
                        <StandardCard title={txt.searchResults.title} help={txt.searchResults.help}>
                            <div>
                                {txt.searchResults.text.replace('[resultsCount]', this.props.publicationsList.length)}
                            </div>
                            <PublicationsList publicationsList={this.props.publicationsList} actions={actions}/>
                        </StandardCard>
                        <div className="layout-card">
                            <div className="columns">
                                <div className="column is-hidden-mobile" />
                                <div className="column is-narrow-desktop is-12-mobile is-pulled-right">
                                    <RaisedButton
                                        label={txt.searchResults.hideAll}
                                        secondary
                                        fullWidth
                                        onTouchTap={this._confirmHideAllPublications}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </StandardPage>
        );
    }
}

