import React, { PureComponent } from 'react';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import ImageGallery from 'react-image-gallery';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

class IndexComponent extends PureComponent {
    render() {
        const images = [
            {
                original: 'https://app.library.uq.edu.au/file/public/babcccc0-e0e4-11ea-b159-6dfe174e1a21.jpg',
            },
            {
                original: 'https://app.library.uq.edu.au/file/public/8bb2b540-dc32-11ea-9810-53ef2bd221b3.jpg',
            },
            {
                original: 'https://app.library.uq.edu.au/file/public/adaa3870-dad2-11ea-ae85-8b875639d1ad.jpg',
            },
        ];
        return (
            <StandardPage title="Welcome">
                <div className="layout-card" style={{ marginBottom: 250 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <div style={{ boxShadow: '0px 0px 5px rgba(0,0,0,0.2' }}>
                                <ImageGallery
                                    items={images}
                                    showThumbnails={false}
                                    showFullscreenButton={false}
                                    showPlayButton={false}
                                    autoPlay
                                    slideDuration={2500}
                                    slideInterval={8000}
                                    showBullets
                                />
                            </div>
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
