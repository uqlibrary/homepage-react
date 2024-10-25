import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { pluralise } from 'helpers/general';
import UqDsExclamationCircle from '../../../SharedComponents/Icons/UqDsExclamationCircle';

const StyledGridListItem = styled(Grid)(() => ({
    marginLeft: '8px',
    listStyleType: 'square',
}));
const StyledGridItem = styled(Grid)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    paddingBottom: '16px',
    paddingLeft: 0,
    position: 'relative',
    '& a': {
        marginRight: -16,
    },
}));
const StyledActionsGrid = styled(Grid)(() => ({
    paddingLeft: '10px',
    marginTop: 0,
    marginLeft: '30px',
    marginBottom: 0,
    maxWidth: 'calc(100% - 18px)',
    '& li': {
        marginTop: '8px',
    },
}));
const StyledSubtitleTypography = styled(Typography)(() => ({
    fontStyle: 'normal',
    fontWeight: 500,
    letterSpacing: '0.16px',
    lineHeight: '160%', // 25.6px
    display: 'flex',
    alignItems: 'flex-start',
    '& span': {
        marginLeft: '8px',
    },
}));

/*
 * ALWAYS refer to espace as "UQ eSpace"
 */

const EspacePossible = ({ recordCount }) => {
    return (
        <StyledGridListItem component={'li'} item xs={12}>
            <Link
                to={'https://espace.library.uq.edu.au/records/possible'}
                id="espace-possible"
                data-testid="espace-possible"
            >
                {'Claim [totalRecords] [records]'
                    .replace('[totalRecords]', recordCount)
                    .replace('[records]', pluralise('record', recordCount))}
            </Link>
        </StyledGridListItem>
    );
};
const EspaceUpdateWorks = () => {
    return (
        <StyledGridItem component={'div'} item xs={12}>
            <Link
                to={'https://espace.library.uq.edu.au/dashboard'}
                id="espace-updateworks"
                data-testid="espace-updateworks"
            >
                Update UQ eSpace records
            </Link>
        </StyledGridItem>
    );
};

const EspaceEditorialAppointments = () => {
    return (
        <StyledGridItem component={'div'} item xs={12}>
            <Link
                to={'https://espace.library.uq.edu.au/editorial-appointments'}
                id="espace-editorialAppointments"
                data-testid="espace-editorialAppointments"
            >
                Update editorial appointments
            </Link>
        </StyledGridItem>
    );
};
const EspaceOrcid = () => {
    return (
        <StyledGridListItem component={'li'} item xs={12}>
            <Link
                to={'https://espace.library.uq.edu.au/author-identifiers/orcid/link'}
                id="espace-orcid"
                data-testid="espace-orcid"
            >
                Link ORCiD account
            </Link>
        </StyledGridListItem>
    );
};
const EspaceNTROs = ({ recordCount }) => {
    return (
        <StyledGridListItem component={'li'} item xs={12}>
            <Link to={'https://espace.library.uq.edu.au/records/incomplete'} id="espace-ntro" data-testid="espace-ntro">
                {'Complete [totalRecords] NTRO [records]'
                    .replace('[totalRecords]', recordCount)
                    .replace('[records]', pluralise('record', recordCount))}
            </Link>
        </StyledGridListItem>
    );
};

export const EspaceLinks = ({ author, possibleRecords, incompleteNTRORecords }) => {
    const authorIsMissingOrcid = !author.aut_orcid_id;
    const authorNeedsToUpdateRecords = !!possibleRecords && !!possibleRecords.total && possibleRecords.total > 0;
    const authorHasIncompleteNtro =
        !!incompleteNTRORecords && !!incompleteNTRORecords.total && incompleteNTRORecords.total > 0;
    const uqDsWarningYellow = '#fef8e8';
    return (
        <StandardCard subCard fullHeight primaryHeader noPadding standardCardId="espace-panel" title={'UQ eSpace'}>
            <Grid container spacing={0} style={{ paddingInline: '24px', marginTop: '24px' }}>
                <StyledGridItem component={'li'} item xs={12}>
                    <Link to={'https://espace.library.uq.edu.au/dashboard'}>UQ eSpace dashboard</Link>
                </StyledGridItem>
                <EspaceEditorialAppointments />
                {!authorNeedsToUpdateRecords && <EspaceUpdateWorks />}
                {(authorIsMissingOrcid || authorNeedsToUpdateRecords || authorHasIncompleteNtro) && (
                    <Grid
                        item
                        xs={12}
                        style={{
                            backgroundColor: uqDsWarningYellow,
                            padding: '16px',
                            margin: '16px 0',
                        }}
                    >
                        <StyledSubtitleTypography component={'h4'}>
                            <UqDsExclamationCircle style={{ height: '22px' }} />{' '}
                            <span>Update the following items:</span>
                        </StyledSubtitleTypography>
                        <StyledActionsGrid container component={'ul'}>
                            {authorIsMissingOrcid && <EspaceOrcid />}
                            {authorNeedsToUpdateRecords && <EspacePossible recordCount={possibleRecords.total} />}
                            {authorHasIncompleteNtro && <EspaceNTROs recordCount={incompleteNTRORecords.total} />}
                        </StyledActionsGrid>
                    </Grid>
                )}
            </Grid>
        </StandardCard>
    );
};

EspacePossible.propTypes = {
    recordCount: PropTypes.number,
};

EspaceNTROs.propTypes = {
    recordCount: PropTypes.number,
};

EspaceLinks.propTypes = {
    author: PropTypes.object,
    possibleRecords: PropTypes.object,
    incompleteNTRORecords: PropTypes.object,
};

export default EspaceLinks;
