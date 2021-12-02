import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import CloseIcon from '@material-ui/icons/Close';

import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';

import moment from 'moment';
import { SpotlightsHelpDrawer } from 'modules/Pages/Admin/Spotlights/SpotlightsHelpDrawer';

const useStyles = makeStyles(theme => ({
    contentBox: {
        minWidth: '90%',
        paddingTop: 20,
        '& img': {
            maxWidth: 800,
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
        width: '90%',
        height: '90%',
        maxWidth: 'inherit',
    },
    link: {
        marginBottom: 10,
        marginRight: 10,
        cursor: 'pointer',
    },
}));

export const SpotlightsViewByImage = ({
    isLightboxOpen,
    handleLightboxClose,
    spotlights,
    showViewByHistoryLightbox,
    helpButtonLabel,
    helpContent,
}) => {
    const classes = useStyles();

    const [helpLightboxOpen, setHelpLightboxOpen] = useState(false);
    const openHelpLightbox = () => setHelpLightboxOpen(true);
    const closeHelpLightbox = () => setHelpLightboxOpen(false);

    let filterTerm;

    const [staticRows, setStaticRows] = useState([]);
    const [rows, setRows] = useState([]);
    React.useEffect(() => {
        setRows(spotlights);
        setStaticRows(spotlights);
    }, [spotlights]);

    const [textSearch, setTextSearch] = useState(filterTerm);
    const clearFilter = () => {
        setTextSearch('');
        setRows(staticRows);
    };
    const filterRowsByText = e => {
        filterTerm = e.target?.value;
        setTextSearch(filterTerm);
        setRows(
            [...staticRows].filter(r => {
                const lowercaseLinkAria = r.title.toLowerCase();
                const lowercaseImgAlt = r.img_alt.toLowerCase();
                return (
                    lowercaseLinkAria.includes(filterTerm.toLowerCase()) ||
                    lowercaseImgAlt.includes(filterTerm.toLowerCase())
                );
            }),
        );
    };

    return (
        <React.Fragment>
            <Dialog
                open={isLightboxOpen}
                onClose={handleLightboxClose}
                aria-labelledby="lightboxTitle"
                PaperProps={{ classes: { root: classes.dialogPaper } }}
            >
                <DialogTitle
                    id="lightboxTitle"
                    data-testid="spotlights-viewbyimage-lightbox-title"
                    style={{ minHeight: 48, position: 'relative', borderBottom: '1px solid #d7d1cc' }}
                >
                    <span style={{ minHeight: 48, verticalAlign: 'bottom' }}>{locale.viewByImage.title}</span>
                    <div style={{ display: 'inline', marginLeft: 16 }}>
                        <TextField
                            data-testid="spotlights-viewbyimage-clear-text-field"
                            inputProps={{
                                maxLength: 25,
                                'aria-label': locale.listPage.textSearch.ariaLabel,
                            }}
                            onChange={filterRowsByText}
                            label={locale.listPage.textSearch.displayLabel}
                            value={textSearch}
                        />
                        <CloseIcon
                            id="spotlights-list-clear-text-filter-clear-button"
                            data-testid="spotlights-list-clear-text-filter-clear-button"
                            color="disabled"
                            fontSize="small"
                            style={{ position: 'absolute', top: 37 }}
                            onClick={clearFilter}
                        />
                    </div>
                    <Button
                        children="Close"
                        color="secondary"
                        data-testid="spotlights-viewbyimage-lightbox-close-button"
                        onClick={handleLightboxClose}
                        style={{ float: 'right' }}
                        variant="contained"
                    />
                    <Button
                        children={helpButtonLabel}
                        color="secondary"
                        data-testid="admin-spotlights-help-button"
                        id="admin-spotlights-help-button"
                        onClick={openHelpLightbox}
                        style={{ float: 'right', marginRight: 16 }}
                        variant="contained"
                    />
                </DialogTitle>
                <DialogContent>
                    <Box className={classes.contentBox} data-testid="spotlights-viewbyimage-lightbox-content">
                        <div>
                            {!!rows &&
                                rows.length > 0 &&
                                rows
                                    .sort(
                                        (a, b) =>
                                            moment(b.end, 'YYYY-MM-DD hh:mm:ss') - moment(a.end, 'YYYY-MM-DD hh:mm:ss'),
                                    )
                                    .map((s, index) => {
                                        return (
                                            <a
                                                id={`${s.id}-lightbox-item`}
                                                title={`${s.title}\n${locale.viewByHistory.datePrefix} ${s.start} ${locale.viewByHistory.dateDivider} ${s.end}`}
                                                key={`${s.id}-lightbox-item`}
                                                className={classes.link}
                                                onClick={() => showViewByHistoryLightbox(s)}
                                                onKeyDown={() => showViewByHistoryLightbox(s)}
                                            >
                                                <img
                                                    src={s.img_url}
                                                    alt={s.img_alt}
                                                    width={250}
                                                    height={92}
                                                    loading={index > 20 ? 'lazy' : null}
                                                />
                                            </a>
                                        );
                                    })}
                        </div>
                    </Box>
                </DialogContent>
            </Dialog>
            <SpotlightsHelpDrawer
                helpContent={helpContent}
                closeHelpLightbox={closeHelpLightbox}
                open={helpLightboxOpen}
            />
        </React.Fragment>
    );
};

SpotlightsViewByImage.propTypes = {
    handleLightboxClose: PropTypes.func,
    helpButtonLabel: PropTypes.string,
    helpContent: PropTypes.any,
    isLightboxOpen: PropTypes.bool,
    showViewByHistoryLightbox: PropTypes.func,
    spotlightImageUrl: PropTypes.string,
    spotlights: PropTypes.array,
};

SpotlightsViewByImage.defaultProps = {
    helpButtonLabel: 'Help',
    helpContent: locale.viewByImage.help,
    spotlights: [],
};

export default React.memo(SpotlightsViewByImage);
