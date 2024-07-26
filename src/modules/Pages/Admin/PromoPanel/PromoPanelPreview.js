import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import parse from 'html-react-parser';
import Button from '@mui/material/Button';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Box from '@mui/material/Box';

export const PromoPanelPreview = props => {
    return (
        <React.Fragment>
            <Dialog
                onClose={props.handlePreviewClose}
                open={props.isPreviewOpen}
                aria-labelledby="promopanel-preview-title"
                PaperProps={{ style: { width: 400 } }}
            >
                <DialogTitle
                    id="promopanel-preview-title"
                    data-testid="promopanel-preview-title"
                    style={{ position: 'relative', borderBottom: '1px solid #d7d1cc', fontSize: 12 }}
                    children={
                        <>
                            <Box style={{ fontSize: '1.5em', fontWeight: 'bold', lineHeight: 1, margin: 0 }}>
                                {'Preview'}
                            </Box>
                            <p style={{ fontSize: 14, fontWeight: 100, lineHeight: 1, margin: 0 }}>
                                {props.previewName}
                            </p>
                        </>
                    }
                />
                <DialogContent>
                    <StandardCard
                        primaryHeader
                        fullHeight
                        standardCardId="promo-panel"
                        title={
                            <Grid container>
                                <Grid item xs={10} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {props.previewTitle}
                                </Grid>
                            </Grid>
                        }
                    >
                        <Grid container spacing={1}>
                            <Grid item xs>
                                {parse(props.previewContent || '')}
                            </Grid>
                        </Grid>
                    </StandardCard>
                    <Grid item xs={12} align="right">
                        <Button
                            style={{ marginTop: 10 }}
                            color="secondary"
                            children="Close"
                            id="admin-promopanel-preview-button-cancel"
                            data-testid="admin-promopanel-preview-button-cancel"
                            variant="contained"
                            onClick={props.handlePreviewClose}
                        />
                    </Grid>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

PromoPanelPreview.propTypes = {
    isPreviewOpen: PropTypes.bool,
    previewName: PropTypes.string,
    previewTitle: PropTypes.string,
    previewContent: PropTypes.string,
    handlePreviewClose: PropTypes.func,
};

export default React.memo(PromoPanelPreview);
