import React, { PureComponent } from 'react';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

class IndexComponent extends PureComponent {
    render() {
        return (
            <StandardPage title={'Hello'}>
                <Grid container>
                    <Grid item xs={12} md={8} style={{ margin: '0 24px 300px 64px' }}>
                        <p>Welcome to the new homepage.</p>
                    </Grid>
                </Grid>
            </StandardPage>
        );
    }
}

const StyledIndex = withStyles(null, { withTheme: true })(IndexComponent);
const Index = props => <StyledIndex {...props} />;
export default Index;
