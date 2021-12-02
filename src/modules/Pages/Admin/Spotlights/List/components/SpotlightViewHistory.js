import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Box from '@material-ui/core/Box';

import SpotlightSizeWarningByUrl from 'modules/Pages/Admin/Spotlights/SpotlightSizeWarningByUrl';
import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';

import moment from 'moment';
import { SpotlightsHelpDrawer } from '../../SpotlightsHelpDrawer';
import SpotlightSplitButton from './SpotlightSplitButton';
import {
    isPastSpotlight,
    navigateToCloneForm,
    navigateToEditForm,
    navigateToView,
} from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

const useStyles = makeStyles(theme => ({
    viewHistoryLightboxStyle: {
        display: 'flex',
        flexDirection: 'column',
        m: 'auto',
        width: 'fit-content',
        '& img': {
            maxWidth: 800,
            border: '1px solid grey',
            textAlign: 'center',
        },
        '& li': {
            marginBottom: 10,
            padding: 10,
            '& p': {
                marginBottom: 0,
                marginTop: 1,
            },
            listStyle: 'none',
        },
    },
    entry: {
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            transition: 'background-color 1s ease',
        },
    },
    thisEntry: {
        backgroundColor: 'rgba(0,0,0,.65)',
        color: '#f7f6f5',
    },
}));

export const SpotlightViewHistory = ({
    focussedElement,
    helpButtonLabel,
    helpContent,
    isViewHistoryLightboxOpen,
    handleViewHistoryLightboxClose,
    spotlights,
    history,
}) => {
    const classes = useStyles();

    const [helpLightboxOpen, setHelpLightboxOpen] = useState(false);

    const openHelpLightbox = () => {
        setHelpLightboxOpen(true);
    };

    const closeHelpLightbox = () => {
        setHelpLightboxOpen(false);
    };

    return (
        <React.Fragment>
            <Dialog
                maxWidth="xl"
                open={isViewHistoryLightboxOpen}
                onClose={handleViewHistoryLightboxClose}
                aria-labelledby="viewHistoryLightboxTitle"
                data-testid="spotlights-viewbyhistory-lightbox-holder"
            >
                <DialogTitle>
                    <p id="viewHistoryLightboxTitle" data-testid="spotlights-viewbyhistory-lightbox-title">
                        {locale.viewByHistory.title}
                        <Button
                            children="Close"
                            color="secondary"
                            data-testid="spotlights-viewbyhistory-lightbox-close-button"
                            onClick={handleViewHistoryLightboxClose}
                            style={{ float: 'right', marginLeft: 10 }}
                            variant="contained"
                        />
                        <Button
                            children={helpButtonLabel}
                            color="secondary"
                            data-testid="spotlights-viewbyhistory-lightbox-help-button"
                            onClick={openHelpLightbox}
                            style={{ float: 'right' }}
                            variant="contained"
                        />
                    </p>
                </DialogTitle>
                <DialogContent>
                    <Box className={classes.viewHistoryLightboxStyle}>
                        <a
                            aria-label={focussedElement.title}
                            href={focussedElement.url}
                            rel="noopener noreferrer"
                            style={{ margin: '0 auto' }}
                            target="_blank"
                        >
                            <img
                                alt={focussedElement.img_alt}
                                src={focussedElement.img_url}
                                style={{ maxWidth: 650 }}
                            />
                        </a>
                        <div data-testid="spotlights-viewbyhistory-lightbox-dimensions" style={{ textAlign: 'center' }}>
                            <SpotlightSizeWarningByUrl spotlightImageUrl={focussedElement.img_url} />
                        </div>
                        <ul>
                            {spotlights
                                .sort(
                                    (a, b) =>
                                        moment(b.end, 'YYYY-MM-DD hh:mm:ss') - moment(a.end, 'YYYY-MM-DD hh:mm:ss'),
                                )
                                .map(s => {
                                    const dateDuringHour = 'ddd D MMM YYYY h.mma';
                                    const dateOnTheHour = dateDuringHour.replace('h.mma', 'ha');
                                    const startDateDisplay = moment(s.start).format(
                                        moment(s.start).format('m') === '0' ? dateOnTheHour : dateDuringHour,
                                    );
                                    const endDateDisplay = moment(s.end).format(
                                        moment(s.end).format('m') === '0' ? dateOnTheHour : dateDuringHour,
                                    );

                                    return (
                                        <li
                                            key={`${s.id}-viewhistory-lightbox`}
                                            className={`${
                                                spotlights.length > 1 && focussedElement.id === s.id
                                                    ? classes.thisEntry
                                                    : classes.entry
                                            }`}
                                        >
                                            <p>
                                                <strong>{locale.viewByHistory.linkTitle}</strong>: {s.title}
                                                <div style={{ float: 'right' }}>
                                                    <SpotlightSplitButton
                                                        mainButtonLabel="Clone"
                                                        extendedNavigateToCloneForm={navigateToCloneForm}
                                                        extendedNavigateToView={navigateToView}
                                                        spotlight={s}
                                                        history={history}
                                                    />
                                                    {isPastSpotlight(s) ? (
                                                        <Button
                                                            children={locale.form.splitButton.labels.view}
                                                            color="secondary"
                                                            data-testid={`spotlight-list-item-view-${s.id}`}
                                                            id={`spotlight-list-item-view-${s.id}`}
                                                            onClick={() => navigateToCloneForm(s.id, history)}
                                                            className={classes.editButton}
                                                            variant="contained"
                                                            style={{ float: 'right' }}
                                                        />
                                                    ) : (
                                                        <Button
                                                            children={locale.form.splitButton.labels.edit}
                                                            color="secondary"
                                                            data-testid={`spotlight-list-item-edit-${s.id}`}
                                                            id={`spotlight-list-item-edit-${s.id}`}
                                                            onClick={() => navigateToEditForm(s.id, history)}
                                                            className={classes.editButton}
                                                            variant="contained"
                                                            style={{ float: 'right' }}
                                                        />
                                                    )}
                                                </div>
                                            </p>
                                            <p>
                                                <strong>{locale.viewByHistory.datePrefix}</strong>: {startDateDisplay}
                                                {locale.viewByHistory.dateDivider}
                                                {endDateDisplay}
                                            </p>
                                            <div style={{ paddingRight: 100 }}>
                                                <p>
                                                    <strong>{locale.viewByHistory.ariaLabel}</strong>: {s.img_alt}
                                                </p>
                                                <p>
                                                    <strong>{locale.viewByHistory.link}</strong>: {s.url}
                                                </p>
                                                <p>
                                                    <strong>{locale.viewByHistory.publicationStatus}</strong>:{' '}
                                                    {s.active ? 'yes' : 'no'}
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })}
                        </ul>
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

SpotlightViewHistory.propTypes = {
    focussedElement: PropTypes.any,
    helpButtonLabel: PropTypes.string,
    helpContent: PropTypes.any,
    isViewHistoryLightboxOpen: PropTypes.bool,
    handleViewHistoryLightboxClose: PropTypes.func,
    spotlights: PropTypes.array,
    history: PropTypes.any,
};

SpotlightViewHistory.defaultProps = {
    spotlights: [],
    helpButtonLabel: 'Help',
};

export default React.memo(SpotlightViewHistory);
