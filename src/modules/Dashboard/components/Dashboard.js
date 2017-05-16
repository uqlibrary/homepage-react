import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardText, CardHeader} from 'material-ui/Card';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {publicationYearsBig as publicationYearsMockData} from '../../../mock/data/academic/publicationYears';

import {AuthorsPublicationsPerYearChart} from 'uqlibrary-react-toolbox';
import './Dashboard.scss';


class Dashboard extends React.Component {
    static propTypes = {
        account: PropTypes.object.isRequired,
        history: PropTypes.object,
        loadUsersPublications: PropTypes.func,
        claimPublicationResults: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            showAppbar: true
        };
    }

    componentDidMount() {
        // fetch data to display here
        this.props.loadUsersPublications(123);
    }

    hideAppBar = () => {
        this.setState({showAppbar: false});
    };

    claimYourPublications = () => {
        this.props.history.push('/claim-publications');
    };

    render() {
        const {
            account
        } = this.props;

        return (
            <div className="layout-fill">
                <div className="layout-card">
                    <div className="image-cover">
                        <div className="user-information" style={{color: '#FFF'}}>
                            <span className="display-1">{account.get('title')} {account.get('name')}</span><br />
                            <span className="subhead">{account.get('fullTitle')}</span><br />
                            <span className="body-1">{account.get('school')}</span>
                        </div>
                    </div>
                    <div className="notification-wrap">
                        <CSSTransitionGroup
                            transitionName="claim-publication-lure"
                            transitionEnterTimeout={100}
                            transitionLeaveTimeout={300}
                        >
                            {this.props.claimPublicationResults.size > 0 && this.state.showAppbar  && (
                            <AppBar
                                className="claim-publication-lure"
                                title={`We have found ${this.props.claimPublicationResults.size} articles that could possibly be your work.`}
                                iconElementLeft={<FontIcon className="material-icons error_outline">error_outline</FontIcon>}
                                iconElementRight={<span className="button-wrap">
                                    <FlatButton label="Claim your publications now" onTouchTap={this.claimYourPublications} className="claim-publications" />
                                    <IconButton onTouchTap={this.hideAppBar}><NavigationClose className="hide-appbar" /></IconButton></span>}
                            />
                            )}
                        </CSSTransitionGroup>
                    </div>
                </div>
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless">

                            <div className="column">
                                <h2 className="headline">eSpace publications by year</h2>
                            </div>

                        </div>
                    </CardHeader>

                    <CardText className="body-1">
                        <br />
                        <div>
                            <AuthorsPublicationsPerYearChart rawData={publicationYearsMockData} yAxisTitle="Total publications"/>
                        </div>
                    </CardText>

                </Card>
            </div>
        );
    }
}

export default Dashboard;
