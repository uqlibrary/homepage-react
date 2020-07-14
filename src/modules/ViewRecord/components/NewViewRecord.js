import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';
import { SocialShare } from 'modules/SharedComponents/SocialShare';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import AdditionalInformation from './AdditionalInformation';
import AvailableVersions from './AvailableVersions';
import Files from './Files';
import GrantInformation from './GrantInformation';
import Links from './Links';
import NtroDetails from './NtroDetails';
import PublicationDetails from './PublicationDetails';
import RelatedPublications from './RelatedPublications';

import { userIsAdmin, userIsAuthor } from 'hooks';
import { general } from 'config';
import locale from 'locale/pages';
import { loadRecordToView, clearRecordToView, setHideCulturalSensitivityStatement } from 'actions';

export const NewViewRecord = ({
    account,
    author,
    hideCulturalSensitivityStatement,
    isDeleted,
    loadingRecordToView,
    recordToViewError,
    recordToView,
}) => {
    const dispatch = useDispatch();
    const { pid } = useParams();
    const isAdmin = userIsAdmin();
    const isAuthor = userIsAuthor();

    const txt = locale.pages.viewRecord;
    const isNtro = recordToView && !!general.NTRO_SUBTYPES.includes(recordToView.rek_subtype);

    const handleSetHideCulturalSensitivityStatement = React.useCallback(
        () => dispatch(setHideCulturalSensitivityStatement()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    React.useEffect(() => {
        if (!!pid) {
            dispatch(loadRecordToView(pid));
        }

        return () => dispatch(clearRecordToView());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pid]);

    if (isDeleted) {
        return (
            <StandardPage className="viewRecord" title={locale.pages.viewRecord.notFound.title}>
                <Grid container style={{ marginTop: -24 }}>
                    <Grid item xs={12}>
                        {locale.pages.viewRecord.notFound.message}
                    </Grid>
                </Grid>
                {recordToViewError && (
                    <Typography variant={'caption'} style={{ opacity: 0.5 }}>
                        {`(${recordToViewError.status} - ${recordToViewError.message})`}
                    </Typography>
                )}
            </StandardPage>
        );
    }

    if (loadingRecordToView) {
        return <InlineLoader message={txt.loadingMessage} />;
    } else if (recordToViewError) {
        return (
            <StandardPage>
                <Alert message={recordToViewError} />
            </StandardPage>
        );
    } else if (!recordToView || !recordToView.rek_pid) {
        return <div className="empty" />;
    }

    return (
        <StandardPage className="viewRecord" title={ReactHtmlParser(recordToView.rek_title)}>
            <Grid container style={{ marginTop: -24 }}>
                <Grid item xs={12}>
                    <PublicationCitation
                        publication={recordToView}
                        hideTitle
                        hideContentIndicators
                        showAdminActions={isAdmin}
                        isPublicationDeleted={isDeleted}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2} style={{ marginBottom: 4 }}>
                        <Grid item xs>
                            {isAdmin && recordToView.rek_status !== general.PUBLISHED && (
                                <Chip label={recordToView.rek_status_lookup} variant="outlined" />
                            )}
                        </Grid>
                        <Grid item>
                            <SocialShare
                                publication={recordToView}
                                services={[
                                    'facebook',
                                    'twitter',
                                    'linkedin',
                                    'researchgate',
                                    'mendeley',
                                    'email',
                                    'print',
                                ]}
                                spaceBetween={4}
                                round
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <React.Fragment>
                    <Files
                        author={author}
                        publication={recordToView}
                        hideCulturalSensitivityStatement={hideCulturalSensitivityStatement}
                        setHideCulturalSensitivityStatement={handleSetHideCulturalSensitivityStatement}
                        isAdmin={!!isAdmin}
                        isAuthor={!!isAuthor}
                    />
                    <Links publication={recordToView} />
                    <RelatedPublications publication={recordToView} />
                    <AdditionalInformation publication={recordToView} account={account} isNtro={isNtro} />
                    {isNtro && <NtroDetails publication={recordToView} account={account} />}
                    <GrantInformation publication={recordToView} />
                </React.Fragment>
                <PublicationDetails publication={recordToView} />
                <AvailableVersions publication={recordToView} />
            </Grid>
        </StandardPage>
    );
};

NewViewRecord.propTypes = {
    account: PropTypes.object,
    author: PropTypes.object,
    hideCulturalSensitivityStatement: PropTypes.bool,
    isDeleted: PropTypes.bool,
    loadingRecordToView: PropTypes.bool,
    recordToView: PropTypes.object,
    recordToViewError: PropTypes.object,
};

export default React.memo(
    NewViewRecord,
    (prevProps, nextProps) => prevProps.loadingRecordToView === nextProps.loadingRecordToView,
);
