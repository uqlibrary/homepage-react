import React from 'react';

import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import NavCard from './NavCard';

const StyledGridContainer = styled(Grid)(() => ({
    '& li': {
        listStyleType: 'none',
        height: '6em',
        marginBottom: '32px',
        paddingLeft: '24px !important',
        paddingTop: '24px !important',
    },
    paddingRight: '8px',
    paddingLeft: 0,
    marginTop: '1em',
    marginLeft: '-24px',
}));

const NavPanelBlock = () => {
    return (
        <StandardPage>
            <nav>
                <StyledGridContainer container component="ul" spacing={4} data-testid="help-navigation-panel">
                    <NavCard cardLabel="Find and borrow" landingUrl="https://web.library.uq.edu.au/find-and-borrow" />
                    <NavCard
                        cardLabel="Study and learning support"
                        landingUrl="https://web.library.uq.edu.au/study-and-learning-support"
                    />
                    <NavCard cardLabel="Visit" landingUrl="https://web.library.uq.edu.au/visit" />
                    <NavCard
                        cardLabel="Research and publish"
                        landingUrl="https://web.library.uq.edu.au/research-and-publish"
                    />
                    <NavCard
                        cardLabel="AskUs and student IT support"
                        landingUrl="https://web.library.uq.edu.au/askus-and-it-support"
                    />
                    <NavCard cardLabel="About" landingUrl="https://web.library.uq.edu.au/about-us" />
                </StyledGridContainer>
            </nav>
        </StandardPage>
    );
};

export default NavPanelBlock;
