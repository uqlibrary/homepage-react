import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import SingleLinkCard from './SingleLinkCard';
import { linkToDrupal } from 'helpers/general';
import {
    bookOpenBookmarkBackgroundImage,
    schoolBuildingBackgroundimage,
    scienceMoleculeBackgroundImage,
    conversationChatBackgroundimage,
    researchExperienceBackgroundImage,
    pinBackgroundImage,
} from './icons';

const StyledNav = styled('nav')(() => ({
    marginTop: '28px',
    marginLeft: '-32px',
    '@media (max-width: 1200px)': {
        marginLeft: '-24px',
    },
}));

const StyledGridContainer = styled(Grid)(({ theme }) => ({
    paddingRight: '8px',
    paddingLeft: 0,
    margin: 0,
    marginBottom: '-32px',
    marginTop: '64px',
    [theme.breakpoints.down('uqDsTablet')]: {
        marginRight: '24px',
    },
}));

const NavigationCardWrapper = ({ account, accountLoading }) => {
    return (
        <StandardPage>
            <StyledNav>
                <StyledGridContainer component={'ul'} container data-testid="help-navigation-panel">
                    <SingleLinkCard
                        cardHeading="Study and learning support"
                        landingUrl={linkToDrupal('/study-and-learning-support')}
                        iconBackgroundImage={bookOpenBookmarkBackgroundImage}
                        shortParagraph="Course materials, assignments, training, referencing, teaching and copyright."
                        loggedIn={accountLoading === false && !!account}
                    />
                    {/* minimum length for shortParagraph string: 66 char,
                        or the wrapping is off at widest tablet 2 column width :( */}
                    <SingleLinkCard
                        cardHeading="Library and student IT help"
                        landingUrl={linkToDrupal('/library-and-student-it-help')}
                        iconBackgroundImage={conversationChatBackgroundimage}
                        shortParagraph="Contact or visit AskUs for help with using your devices, printing and online exams."
                        loggedIn={accountLoading === false && !!account}
                    />
                    <SingleLinkCard
                        cardHeading="Research and publish"
                        landingUrl={linkToDrupal('/research-and-publish')}
                        iconBackgroundImage={scienceMoleculeBackgroundImage}
                        shortParagraph="Open research, funding, metrics, impact, data and UQ eSpace."
                        loggedIn={accountLoading === false && !!account}
                    />
                    <SingleLinkCard
                        cardHeading="Find and borrow"
                        landingUrl={linkToDrupal('/find-and-borrow')}
                        iconBackgroundImage={researchExperienceBackgroundImage}
                        shortParagraph="Discover library collections, how to search, memberships and UQ Archives."
                        loggedIn={accountLoading === false && !!account}
                    />
                    <SingleLinkCard
                        cardHeading="Visit"
                        landingUrl={linkToDrupal('/visit')}
                        iconBackgroundImage={pinBackgroundImage}
                        shortParagraph="Explore our libraries and find spaces where you can study, meet and relax."
                        loggedIn={accountLoading === false && !!account}
                    />
                    <SingleLinkCard
                        cardHeading="About"
                        landingUrl={linkToDrupal('/about')}
                        iconBackgroundImage={schoolBuildingBackgroundimage}
                        shortParagraph="Learn about the Library - our people, purpose and news."
                        loggedIn={accountLoading === false && !!account}
                    />
                </StyledGridContainer>
            </StyledNav>
        </StandardPage>
    );
};

NavigationCardWrapper.propTypes = {
    account: PropTypes.object,
    accountLoading: PropTypes.bool,
};

export default NavigationCardWrapper;
