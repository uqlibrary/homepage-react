import React from 'react';

import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import SingleLinkCard from './SingleLinkCard';

const StyledNav = styled('nav')(() => ({
    marginTop: '24px',
    marginRight: '24px',
    marginLeft: '-24px',
}));

const StyledGridContainer = styled(Grid)(() => ({
    paddingRight: '8px',
    paddingLeft: 0,
    margin: 0,
}));

const NavigationCardWrapper = () => {
    return (
        <StandardPage>
            <StyledNav>
                <StyledGridContainer container component="ul" spacing={4} data-testid="help-navigation-panel">
                    <SingleLinkCard
                        cardLabel="Find and borrow"
                        landingUrl="https://web.library.uq.edu.au/find-and-borrow"
                    />
                    <SingleLinkCard
                        cardLabel="Study and learning support"
                        landingUrl="https://web.library.uq.edu.au/study-and-learning-support"
                    />
                    <SingleLinkCard cardLabel="Visit" landingUrl="https://web.library.uq.edu.au/visit" />
                    <SingleLinkCard
                        cardLabel="Research and publish"
                        landingUrl="https://web.library.uq.edu.au/research-and-publish"
                    />
                    <SingleLinkCard
                        cardLabel="AskUs and student IT support"
                        landingUrl="https://web.library.uq.edu.au/askus-and-it-support"
                    />
                    <SingleLinkCard cardLabel="About" landingUrl="https://web.library.uq.edu.au/about-us" />
                </StyledGridContainer>
            </StyledNav>
        </StandardPage>
    );
};

export default NavigationCardWrapper;
