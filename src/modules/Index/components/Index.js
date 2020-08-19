import React, { PureComponent } from 'react';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import { withStyles } from '@material-ui/core/styles';

class IndexComponent extends PureComponent {
    render() {
        return (
            <StandardPage title="Welcome">
                <div className="layout-card">
                    <StandardCard title={'To the new UQ Library Homepage'}>Welcome to the new homepage.</StandardCard>
                </div>
            </StandardPage>
        );
    }
}

const StyledIndex = withStyles(null, { withTheme: true })(IndexComponent);
const Index = props => <StyledIndex {...props} />;
export default Index;
