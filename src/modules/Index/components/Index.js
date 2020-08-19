import React, { PureComponent } from 'react';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

class IndexComponent extends PureComponent {
    render() {
        return (
            <StandardPage title="Welcome">
                <div className="layout-card" style={{ marginBottom: 250 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <StandardCard title={'To the new UQ Library Homepage'}>
                                <p>Welcome to the new homepage.</p>
                            </StandardCard>
                        </Grid>
                        <Grid item xs={4}>
                            <StandardCard title={'Side'}>
                                <p>This is a side panel</p>
                            </StandardCard>
                        </Grid>
                    </Grid>
                </div>
            </StandardPage>
        );
    }
}

const StyledIndex = withStyles(null, { withTheme: true })(IndexComponent);
const Index = props => <StyledIndex {...props} />;
export default Index;
