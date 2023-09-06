import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import parse from 'html-react-parser';
import Button from '@mui/material/Button';

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

    return (
        <React.Fragment>
            <Dialog
                onClose={props.handlePreviewClose}
                open={props.isPreviewOpen}
                aria-labelledby="promopanel-preview-title"
                PaperProps={{ classes: { root: classes.dialogPaper } }}
            >
                <DialogTitle
                    id="promopanel-preview-title"
                    data-testid="promopanel-preview-title"
                    style={{ position: 'relative', borderBottom: '1px solid #d7d1cc', fontSize: 12 }}
                    children={
                        <>
                            <p style={{ lineHeight: 1, margin: 0 }}>{'Preview'}</p>
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
                                {parse(props.previewContent)}
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

PromoPanelPreview.defaultProps = {
    previewGroup: [],
    previewContent: '',
    helpButtonLabel: 'Help',
    helpContent: 'test',
};

export default React.memo(PromoPanelPreview);
