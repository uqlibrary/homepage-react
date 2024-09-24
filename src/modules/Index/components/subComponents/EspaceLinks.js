import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SvgIcon from '@mui/material/SvgIcon'; // use an empty icon to force matching spacing between items

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { pluralise } from 'helpers/general';

const StyledGridItem = styled(Grid)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    paddingBottom: '10px',
    paddingLeft: '10px',
    position: 'relative',
    '&::before': {
        content: '"•"', // Bullet character
        position: 'absolute',
        left: 0,
        fontSize: '1em',
        lineHeight: 1,
        color: 'currentColor',
        top: '35%',
    },
    '& a': {
        marginRight: -16,
        marginTop: '12px',
    },
}));
const StyledLabel = styled(Typography)(() => ({
    color: '#19151c',
    fontSize: '16px',
    fontWeight: 500,
    marginTop: '24px',
    textWrap: 'nowrap',
    whiteSpaceCollapse: 'collapse',
}));
const StyledHighlightIcon = styled(StarBorderIcon)(() => ({
    color: 'red',
    paddingLeft: '15px',
    height: '1em',
}));

/*
 * ALWAYS refer to espace as "UQ eSpace"
 */

const EspacePossible = ({ recordCount }) => {
    return (
        <StyledGridItem component={'li'} item xs={12}>
            <Link
                to={'https://espace.library.uq.edu.au/records/possible'}
                id="espace-possible"
                data-testid="espace-possible"
            >
                {'Claim [totalRecords] [records]'
                    .replace('[totalRecords]', recordCount)
                    .replace('[records]', pluralise('record', recordCount))}
            </Link>
            <StyledHighlightIcon />
        </StyledGridItem>
    );
};
const EspaceUpdateWorks = () => {
    return (
        <StyledGridItem component={'li'} item xs={12}>
            <Link
                to={'https://espace.library.uq.edu.au/dashboard'}
                id="espace-updateworks"
                data-testid="espace-updateworks"
            >
                Update UQ eSpace records
            </Link>
            <SvgIcon />
        </StyledGridItem>
    );
};
const EspaceJournalSearch = () => {
    return (
        <StyledGridItem component={'li'} item xs={12}>
            <Link
                to={'https://espace.library.uq.edu.au/journals/search/'}
                id="espace-journalsearch"
                data-testid="espace-journalsearch"
            >
                Publish in the right journal
            </Link>
            <SvgIcon />
        </StyledGridItem>
    );
};

const EspaceEditorialAppointments = () => {
    return (
        <StyledGridItem component={'li'} item xs={12}>
            <Link
                to={'https://espace.library.uq.edu.au/editorial-appointments'}
                id="espace-editorialAppointments"
                data-testid="espace-editorialAppointments"
            >
                Update Editorial appointments
            </Link>
            <SvgIcon />
        </StyledGridItem>
    );
};
const EspaceOrcid = () => {
    return (
        <StyledGridItem component={'li'} item xs={12}>
            <Link
                to={'https://espace.library.uq.edu.au/author-identifiers/orcid/link'}
                id="espace-orcid"
                data-testid="espace-orcid"
            >
                Link ORCiD account
            </Link>
            <StyledHighlightIcon />
        </StyledGridItem>
    );
};
const EspaceNTROs = ({ recordCount }) => {
    return (
        <StyledGridItem component={'li'} item xs={12}>
            <Link to={'https://espace.library.uq.edu.au/records/incomplete'} id="espace-ntro" data-testid="espace-ntro">
                {'Complete [totalRecords] NTRO [records]'
                    .replace('[totalRecords]', recordCount)
                    .replace('[records]', pluralise('record', recordCount))}
            </Link>
            <StyledHighlightIcon />
        </StyledGridItem>
    );
};

export const EspaceLinks = ({ author, possibleRecords, incompleteNTRORecords }) => {
    return (
        <StandardCard subCard fullHeight primaryHeader noPadding standardCardId="espace-panel" title={'UQ eSpace'}>
            <Grid container spacing={0} style={{ paddingInline: '24px' }}>
                <Grid item xs={12} style={{ margin: '20px 0 0 0' }}>
                    <Link to="https://espace.library.uq.edu.au/dashboard">Access UQ eSpace dashboard</Link>
                </Grid>
                <Grid item>
                    <StyledLabel component={'h4'} variant={'h6'}>
                        Actions:
                    </StyledLabel>
                </Grid>

                <Grid item xs={12}>
                    <Grid container component={'ul'} style={{ paddingLeft: 0, marginTop: 0, marginLeft: 0 }}>
                        {!author.aut_orcid_id && <EspaceOrcid />}
                        {!!possibleRecords &&
                            (!!possibleRecords.total && possibleRecords.total > 0 ? (
                                <EspacePossible recordCount={possibleRecords.total} />
                            ) : (
                                <EspaceUpdateWorks />
                            ))}
                        {!!incompleteNTRORecords &&
                            !!incompleteNTRORecords.total &&
                            incompleteNTRORecords.total > 0 && (
                                <EspaceNTROs recordCount={incompleteNTRORecords.total} />
                            )}
                        <EspaceJournalSearch />
                        <EspaceEditorialAppointments />
                    </Grid>
                </Grid>
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
