import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import txt from './masqueradeLocale';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

export default class Masquerade extends PureComponent {
    static propTypes = {
        account: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            loading: false,
        };
    }

    _masqueradeAs = event => {
        if ((event && event.key && event.key !== 'Enter') || this.state.userName.length === 0) return;

        this.setState({
            loading: true,
        });

        const redirectUrl = `${window.location.protocol}//${window.location.hostname}/`;
        window.location.assign(
            `https://auth.library.uq.edu.au/masquerade?user=${this.state.userName}&return=${window.btoa(redirectUrl)}`,
        );
    };

    _usernameChanged = event => {
        this.setState({
            userName: event.target.value,
        });
    };

    userCapabilityStatement = canMasqueradeType => {
        return canMasqueradeType && canMasqueradeType === 'readonly'
            ? txt.user.access.readonly.capabilityStatement
            : txt.user.access.full.capabilityStatement;
    };

    render() {
        return (
            <StandardPage>
                <div className="layout-card" style={{ margin: '-8px auto 16px' }}>
                    <StandardCard noPadding noHeader>
                        <Grid
                            alignItems={'flex-end'}
                            container
                            spacing={1}
                            style={{ paddingTop: 12, paddingRight: 30, paddingBottom: 12, paddingLeft: 30 }}
                        >
                            <Grid item xs={12} md={'auto'} id="masquerade">
                                <InputLabel id="masquerade-form-label">{txt.title}</InputLabel>
                                <Typography>
                                    {this.userCapabilityStatement(this.props.account.canMasqueradeType)}
                                </Typography>
                                <Grid container spacing={3} alignItems={'flex-end'} style={{ marginTop: 12 }}>
                                    <Grid item xs>
                                        <TextField
                                            data-testid="masquerade-userName"
                                            fullWidth
                                            id="userName"
                                            label={txt.labels.hint}
                                            onChange={this._usernameChanged}
                                            onKeyPress={this._masqueradeAs}
                                            value={this.state.userName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={'auto'}>
                                        <Button
                                            children={txt.labels.submit}
                                            color="primary"
                                            data-testid="masquerade-submit"
                                            disabled={this.state.loading}
                                            fullWidth
                                            id="submitMasquerade"
                                            onClick={this._masqueradeAs}
                                            variant="contained"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </StandardCard>
                </div>
            </StandardPage>
        );
    }
}
