import React, { PureComponent } from 'react';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

class IndexComponent extends PureComponent {
    render() {
        return (
            <StandardPage title={'Hello'} spacing={0}>
                <Grid container>
                    <Grid item xs={12} md={8}>
                        Welcome to the new homepage.
                    </Grid>
                </Grid>
                <Grid item xs={12} md={8}>
                    {/* temp spacing to make the footer appear pushed down a bit */}
                    <p style={{ minHeight: '200px', margin: '0 auto' }}>&nbsp;</p>
                </Grid>
            </StandardPage>
        );
    }
}

const StyledIndex = withStyles(null, { withTheme: true })(IndexComponent);
const Index = props => <StyledIndex {...props} />;
export default Index;
