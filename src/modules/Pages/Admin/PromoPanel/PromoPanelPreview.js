/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import parse from 'html-react-parser';
import Button from '@material-ui/core/Button';

const moment = require('moment');

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

const useStyles = makeStyles(theme => ({
    contentBox: {
        minWidth: '90%',
        paddingTop: 20,
        '& img': {
            maxWidth: 800,
            height: 800,
            border: '1px solid grey',
            textAlign: 'center',
        },
        '& li': {
            marginBottom: 10,
            padding: 10,
            '&:hover': {
                backgroundColor: theme.palette.secondary.main,
                transition: 'background-color 1s ease',
            },
            '& p': {
                marginBottom: 0,
                marginTop: 1,
            },
        },
        '& [aria-labelledby="lightboxTitle"]': {
            color: 'blue',
        },
    },
    dialogPaper: {
        // make the block take up more of the page
        width: 400,
    },
    link: {
        marginBottom: 10,
        marginRight: 10,
        cursor: 'pointer',
    },
}));
export const PromoPanelPreview = props => {
    const classes = useStyles();
    console.log('PROPS for the object', props);

    return (
        <React.Fragment>
            <Dialog
                open={props.isPreviewOpen}
                aria-labelledby="lightboxTitle"
                PaperProps={{ classes: { root: classes.dialogPaper } }}
            >
                <DialogTitle
                    id="lightboxTitle"
                    data-testid="spotlights-viewbyimage-lightbox-title"
                    style={{ position: 'relative', borderBottom: '1px solid #d7d1cc', fontSize: 12 }}
                    children={
                        <>
                            <p style={{ lineHeight: 1, margin: 0 }}>{'Preview'}</p>
                            <p style={{ fontSize: 14, fontWeight: 100, lineHeight: 1, margin: 0 }}>
                                {props.previewName}
                            </p>
                            <p style={{ fontSize: 12, fontWeight: 100 }}>
                                <b>{'For Group: '}</b>
                                {props.previewGroup.join(', ')}
                            </p>
                            {!!props.previewScheduled && (
                                <p style={{ fontSize: 12, fontWeight: 100 }}>
                                    <b>Schedule to</b>
                                    <br />
                                    <b>Start:</b> {moment(props.previewStart).format('dddd DD/MM/YYYY HH:mm a')}
                                    <br />
                                    <b>End:</b> {moment(props.previewEnd).format('dddd DD/MM/YYYY HH:mm a')}
                                </p>
                            )}
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
                                {parse(props.previewContent)}
                            </Grid>
                        </Grid>
                    </StandardCard>
                    <Grid item xs={12} align="right">
                        <Button
                            style={{ marginTop: 10 }}
                            color="secondary"
                            children="Close"
                            data-testid="admin-promopanel-form-button-cancel"
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
    previewGroup: PropTypes.array,
    previewScheduled: PropTypes.bool,
    previewStart: PropTypes.string,
    previewEnd: PropTypes.string,
    handlePreviewClose: PropTypes.func,
    handleLightboxClose: PropTypes.func,
    helpButtonLabel: PropTypes.string,
    helpContent: PropTypes.any,
    isLightboxOpen: PropTypes.bool,
    showViewByHistoryLightbox: PropTypes.func,
    spotlightImageUrl: PropTypes.string,
    spotlights: PropTypes.array,
};

PromoPanelPreview.defaultProps = {
    previewGroup: [],
    previewContent: '',
    helpButtonLabel: 'Help',
    helpContent: 'test',
    spotlights: [],
};

export default React.memo(PromoPanelPreview);
