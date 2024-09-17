import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LinkIcon from '@mui/icons-material/Link';
import PostAddIcon from '@mui/icons-material/PostAdd';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { isEspaceAuthor } from 'helpers/access';

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
            <a
                className={'menuItemRootAnchor'}
                href={'https://espace.library.uq.edu.au/records/possible'}
                id="pp-espace-possible-menu-button"
                data-testid="pp-espace-possible-menu-button"
            >
                {!!possibleRecords &&
                    'Claim [totalRecords] UQ eSpace records'.replace('[totalRecords]', possibleRecords.total)}
            </a>
        </StyledGridItem>
    );
};
const EspaceOrcid = () => {
    return (
        <StyledGridItem item xs={12}>
            <a
                className={'menuItemRootAnchor'}
                href={'https://espace.library.uq.edu.au/author-identifiers/orcid/link'}
                id="pp-espace-orcid-menu-button"
                data-testid="pp-espace-orcid-menu-button"
            >
                Link ORCiD account to UQ eSpace
            </a>
        </StyledGridItem>
    );
};
const EspaceNTROs = ({ incompleteNTRORecords }) => {
    console.log('EspaceNTROs incompleteNTRORecords=', incompleteNTRORecords);
    return (
        <StyledGridItem item xs={12}>
            <a
                className={'menuItemRootAnchor'}
                href={'https://espace.library.uq.edu.au/records/incomplete'}
                id="pp-espace-ntro-menu-button"
                data-testid="pp-espace-ntro-menu-button"
            >
                {!!incompleteNTRORecords &&
                    !!incompleteNTRORecords.total &&
                    'Complete [total] NTRO records in UQ eSpace'.replace('[total]', incompleteNTRORecords.total)}
            </a>
        </StyledGridItem>
    );
};

export const EspaceLinks = ({ account, author, possibleRecords, incompleteNTRORecords }) => {
    !!account && console.log('EspaceLinks account=', account);
    !!author && console.log('EspaceLinks author=', author);
    !!possibleRecords && console.log('EspaceLinks possibleRecords=', possibleRecords);
    !!incompleteNTRORecords && console.log('EspaceLinks incompleteNTRORecords=', incompleteNTRORecords);
    // const pageLocation = useLocation();
    // const navigate = useNavigate();
    //
    // const pageId = 'homepage-espacelinks';

    return (
        <StandardCard
            subCard
            fullHeight
            primaryHeader
            noPadding
            standardCardId="espace-links-homepage-panel"
            title={'eSpace'}
            // style={{ paddingLeft: '40px' }}
        >
            <Grid container spacing={0} style={{ paddingLeft: '24px' }}>
                <Grid item xs={12}>
                    <Link to="https://espace.library.uq.edu.au/dashboard" style={{ padding: 0 }}>
                        Access UQ eSpace dashboard
                    </Link>
                </Grid>
                {((!!possibleRecords && !!possibleRecords.total) ||
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
                        Things you need to do in eSpace:
                    </Typography>
                )}

                {isEspaceAuthor(account, author) && !author.aut_orcid_id && <EspaceOrcid />}
                {isEspaceAuthor(account, author) && !!possibleRecords && (
                    <EspacePossible possibleRecords={possibleRecords} />
                )}
                {isEspaceAuthor(account, author) && !!incompleteNTRORecords && !!incompleteNTRORecords.total && (
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
