import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import { Link as MuiLink } from '@mui/material';
import { styled } from '@mui/material/styles';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { pluralise } from 'helpers/general';
import UserAttention from 'modules/SharedComponents/Toolbox/UserAttention';

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
const StyledActionsUl = styled('ul')(() => ({
    paddingLeft: '10px',
    marginTop: 0,
    marginLeft: '30px',
    marginBottom: 0,
    maxWidth: 'calc(100% - 18px)',
    '& li': {
        marginTop: '8px',
    },
}));

/*
 * ALWAYS refer to espace as "UQ eSpace"
 */

const EspacePossible = ({ recordCount }) => {
    return (
        <StyledGridListItem component={'li'} item xs={12}>
            <MuiLink
                component={RouterLink}
                to={'https://espace.library.uq.edu.au/records/possible'}
                id="espace-possible"
                data-testid="espace-possible"
                target="_blank"
                rel="noopener noreferrer"
            >
                {'Claim [totalRecords] [records]'
                    .replace('[totalRecords]', recordCount)
                    .replace('[records]', pluralise('record', recordCount))}
            </MuiLink>
        </StyledGridListItem>
    );
};
const EspaceUpdateWorks = () => {
    return (
        <StyledGridItem component={'div'} item xs={12}>
            <MuiLink
                component={RouterLink}
                to={'https://espace.library.uq.edu.au/dashboard'}
                id="espace-updateworks"
                data-testid="espace-updateworks"
                target="_blank"
                rel="noopener noreferrer"
            >
                Update UQ eSpace records
            </MuiLink>
        </StyledGridItem>
    );
};

const EspaceEditorialAppointments = () => {
    return (
        <StyledGridItem component={'div'} item xs={12}>
            <MuiLink
                component={RouterLink}
                to={'https://espace.library.uq.edu.au/editorial-appointments'}
                id="espace-editorialAppointments"
                data-testid="espace-editorialAppointments"
                target="_blank"
                rel="noopener noreferrer"
            >
                Update editorial appointments
            </MuiLink>
        </StyledGridItem>
    );
};
const EspaceOrcid = () => {
    return (
        <StyledGridListItem component={'li'} item xs={12}>
            <MuiLink
                component={RouterLink}
                to={'https://espace.library.uq.edu.au/author-identifiers/orcid/link'}
                id="espace-orcid"
                data-testid="espace-orcid"
                target="_blank"
                rel="noopener noreferrer"
            >
                Link ORCiD account
            </MuiLink>
        </StyledGridListItem>
    );
};
const EspaceNTROs = ({ recordCount }) => {
    return (
        <StyledGridListItem component={'li'} item xs={12}>
            <MuiLink
                component={RouterLink}
                to={'https://espace.library.uq.edu.au/records/incomplete'}
                id="espace-ntro"
                data-testid="espace-ntro"
                target="_blank"
                rel="noopener noreferrer"
            >
                {'Complete [totalRecords] NTRO [records]'
                    .replace('[totalRecords]', recordCount)
                    .replace('[records]', pluralise('record', recordCount))}
            </MuiLink>
        </StyledGridListItem>
    );
};

export const EspaceLinks = ({ author, possibleRecords, incompleteNTRORecords }) => {
    const authorIsMissingOrcid = !author.aut_orcid_id;
    const authorNeedsToUpdateRecords = !!possibleRecords && !!possibleRecords.total && possibleRecords.total > 0;
    const authorHasIncompleteNtro =
        !!incompleteNTRORecords && !!incompleteNTRORecords.total && incompleteNTRORecords.total > 0;
    return (
        <StandardCard subCard fullHeight primaryHeader noPadding standardCardId="espace-panel" title={'UQ eSpace'}>
            <Grid container component={'ul'} spacing={0} style={{ paddingInline: '24px', marginTop: '24px' }}>
                <StyledGridItem component={'li'} item xs={12}>
                    <MuiLink
                        component={RouterLink}
                        to={'https://espace.library.uq.edu.au/dashboard'}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        UQ eSpace dashboard
                    </MuiLink>
                </StyledGridItem>
                <EspaceEditorialAppointments />
                {!authorNeedsToUpdateRecords && <EspaceUpdateWorks />}
                {(authorIsMissingOrcid || authorNeedsToUpdateRecords || authorHasIncompleteNtro) && (
                    <Grid item xs={12} style={{ margin: '16px 0' }}>
                        <UserAttention titleText="Update the following items:">
                            <StyledActionsUl>
                                {authorIsMissingOrcid && <EspaceOrcid />}
                                {authorNeedsToUpdateRecords && <EspacePossible recordCount={possibleRecords.total} />}
                                {authorHasIncompleteNtro && <EspaceNTROs recordCount={incompleteNTRORecords.total} />}
                            </StyledActionsUl>
                        </UserAttention>
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
