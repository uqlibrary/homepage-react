import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

const StyledGridItem = styled(Grid)(() => ({
    paddingBottom: '24px',
    '& a': {
        marginRight: -16,
        marginTop: '12px',
    },
}));

const EspacePossible = ({ possibleRecords }) => {
    return (
        <StyledGridItem item xs={12}>
            <Link
                to={'https://espace.library.uq.edu.au/records/possible'}
                id="espace-possible"
                data-testid="espace-possible"
            >
                {!!possibleRecords &&
                    !!possibleRecords.total &&
                    possibleRecords.total > 0 &&
                    'Claim [totalRecords] UQ eSpace records'.replace('[totalRecords]', possibleRecords.total)}
            </Link>
        </StyledGridItem>
    );
};
const EspaceOrcid = () => {
    return (
        <StyledGridItem item xs={12}>
            <Link
                to={'https://espace.library.uq.edu.au/author-identifiers/orcid/link'}
                id="espace-orcid"
                data-testid="espace-orcid"
            >
                Link ORCiD account to UQ eSpace
            </Link>
        </StyledGridItem>
    );
};
const EspaceNTROs = ({ incompleteNTRORecords }) => {
    console.log('EspaceNTROs incompleteNTRORecords=', incompleteNTRORecords);
    return (
        <StyledGridItem item xs={12}>
            <Link to={'https://espace.library.uq.edu.au/records/incomplete'} id="espace-ntro" data-testid="espace-ntro">
                {!!incompleteNTRORecords &&
                    !!incompleteNTRORecords.total &&
                    incompleteNTRORecords.total > 0 &&
                    'Complete [total] NTRO records in UQ eSpace'.replace('[total]', incompleteNTRORecords.total)}
            </Link>
        </StyledGridItem>
    );
};

export const EspaceLinks = ({ account, author, possibleRecords, incompleteNTRORecords }) => {
    !!account && console.log('EspaceLinks account=', account);
    !!author && console.log('EspaceLinks author=', author);
    !!possibleRecords && console.log('EspaceLinks possibleRecords=', possibleRecords);
    !!incompleteNTRORecords && console.log('EspaceLinks incompleteNTRORecords=', incompleteNTRORecords);

    return (
        <StandardCard
            subCard
            fullHeight
            primaryHeader
            noPadding
            standardCardId="espace-panel"
            title={'UQ eSpace'}
            // style={{ paddingLeft: '40px' }}
        >
            <Grid container spacing={0} style={{ paddingLeft: '24px' }}>
                <Grid item xs={12}>
                    <Link to="https://espace.library.uq.edu.au/dashboard" style={{ padding: 0 }}>
                        Access UQ eSpace dashboard
                    </Link>
                </Grid>
                {((!!possibleRecords && !!possibleRecords.total && possibleRecords.total > 0) ||
                    !author.aut_orcid_id ||
                    (!!incompleteNTRORecords && !!incompleteNTRORecords.total)) && (
                    <Typography
                        component={'h4'}
                        variant={'h6'}
                        style={{
                            color: '#19151c',
                            fontSize: '16px',
                            fontWeight: 500,
                            marginBlock: '24px',
                            textWrap: 'nowrap',
                            whiteSpaceCollapse: 'collapse',
                        }}
                    >
                        Things you need to do in UQ eSpace:
                    </Typography>
                )}

                {!author.aut_orcid_id && <EspaceOrcid />}
                {!!possibleRecords && <EspacePossible possibleRecords={possibleRecords} />}
                {!!incompleteNTRORecords && !!incompleteNTRORecords.total && incompleteNTRORecords.total > 0 && (
                    <EspaceNTROs incompleteNTRORecords={incompleteNTRORecords} />
                )}
            </Grid>
        </StandardCard>
    );
};

EspacePossible.propTypes = {
    possibleRecords: PropTypes.object,
};

EspaceNTROs.propTypes = {
    incompleteNTRORecords: PropTypes.object,
};

EspaceLinks.propTypes = {
    account: PropTypes.object,
    author: PropTypes.object,
    possibleRecords: PropTypes.object,
    incompleteNTRORecords: PropTypes.object,
};

export default EspaceLinks;
