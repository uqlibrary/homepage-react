import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import SingleLinkCard from './SingleLinkCard';
import { linkToDrupal } from 'helpers/general';

const StyledNav = styled('nav')(() => ({
    marginTop: '28px',
    marginLeft: '-32px',
    '@media (max-width: 1200px)': {
        marginLeft: '-24px',
    },
}));

const StyledGridContainer = styled(Grid)(() => ({
    paddingRight: '8px',
    paddingLeft: 0,
    margin: 0,
}));

const StyledHeading = styled(Typography)(() => ({
    fontSize: '32px',
    fontWeight: 500,
    marginTop: '1rem',
}));

// inspect specific icons at https://design-system.ads-staging.aws.uq.edu.au/?path=/story/components-icon--icon and extract the backgroundimage value from the :before on the span
const bookBackgroundImage =
    'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg fill=%27none%27 stroke=%27%2351247A%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%27.75%27%3e%3cpath d=%27M7.97 14.29V4.14s-1.43-1.6-6.26-1.66a.26.26 0 0 0-.2.09c-.05.09-.08.14-.08.23v9.54c0 .18.11.29.28.32 4.83.03 6.26 1.63 6.26 1.63zM6.23 7.91c-1-.34-2.03-.54-3.06-.6m3.06 3.06c-1-.34-2.03-.54-3.06-.6m6.54-1.86c1-.34 2.03-.54 3.06-.6m-3.06 3.06c1-.34 2.03-.54 3.06-.6%27%3e%3c/path%3e%3cpath d=%27M12.77 2.57c.43-.03.92-.05 1.43-.05.09 0 .14.02.2.08a.3.3 0 0 1 .08.23v9.54c0 .17-.1.29-.28.32-4.8 0-6.23 1.6-6.23 1.6%27%3e%3c/path%3e%3cpath d=%27M7.97 14.29V4.14s.66-.74 2.63-1.23m2.17 2.63V1.71c-.74.06-1.46.18-2.17.35v3.48l1.09-.88zm0 0%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")';
const toolboxBackgroundImage =
    'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg fill=%27none%27 stroke=%27%2351247A%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-miterlimit=%278%27 stroke-width=%27.75%27%3e%3cpath d=%27M2.29 4.86h11.14c.46 0 .86.4.86.85v6.86c0 .46-.4.86-.86.86H2.29a.88.88 0 0 1-.86-.86V5.71c.05-.51.4-.85.86-.85zm8.17 0a2.56 2.56 0 0 0-2.57-2.57A2.56 2.56 0 0 0 5.3 4.86M1.43 8.29h5.28m2.15 0H14%27%3e%3c/path%3e%3cpath d=%27M7.89 9.54a.88.88 0 0 1-.86-.85v-.86c0-.46.4-.86.86-.86.45 0 .85.4.85.86v.86c0 .45-.4.85-.85.85zm0 0%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")';
const schoolBuildingBackgroundimage =
    'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg fill=%27none%27 stroke=%27%2351247A%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%27.75%27%3e%3cpath d=%27M5.48 14.29H1.71v-4.6c0-.46.38-.83.83-.83h2.94m5.04-.03h2.94c.45 0 .83.37.83.83v4.63h-3.77m-1.69-2.2a.79.79 0 0 0-.83-.75.79.79 0 0 0-.83.75v2.2h1.69v-2.2zM8 5.06V1.7m0 .01h2.23a.3.3 0 0 1 .29.29v1.11c0 .15-.12.29-.29.29H8zm0 5.06a.83.83 0 0 1 0 1.66.83.83 0 0 1 0-1.66zm0 0%27%3e%3c/path%3e%3cpath d=%27M10.52 7.52A2.47 2.47 0 0 0 8 5.09a2.49 2.49 0 0 0-2.52 2.43v6.77h5.04zm-7.12 3h.43M3.4 12.6h.43m8.37-2.08h.43m-.43 2.08h.43%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")';
const scienceMoleculeBackgroundImage =
    'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg fill=%27none%27 stroke=%27%2351247A%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%27.75%27%3e%3cpath d=%27M8 6.74c.69 0 1.26.57 1.26 1.26 0 .69-.57 1.26-1.26 1.26-.69 0-1.26-.57-1.26-1.26 0-.69.57-1.26 1.26-1.26zm0 0%27%3e%3c/path%3e%3cpath d=%27M5.91 5.91c3.29-3.28 6.86-5 8-3.85 1.15 1.14-.57 4.74-3.85 8-3.29 3.28-6.86 5-8 3.85-1.15-1.14.6-4.71 3.85-8zm0 0%27%3e%3c/path%3e%3cpath d=%27M2.06 2.06c1.14-1.15 4.74.57 8 3.85 3.28 3.29 5 6.86 3.85 8-1.14 1.15-4.74-.57-8-3.85-3.25-3.29-5-6.83-3.85-8zm0 0%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")';

const NavigationCardWrapper = ({ account, accountLoading }) => {
    return (
        <StandardPage>
            {accountLoading === false && !!account && (
                // if they are not logged in, we don't need to waste space on a heading as there is nothing above
                <StyledHeading component={'h2'}>Library navigation</StyledHeading>
            )}
            <StyledNav>
                <StyledGridContainer component={'ul'} container data-testid="help-navigation-panel">
                    <SingleLinkCard
                        cardHeading="Study and learning support"
                        landingUrl={linkToDrupal('/study-and-learning-support')}
                        iconBackgroundImage={toolboxBackgroundImage}
                        shortParagraph="Lorem ipsum odor amet, consectetuer adipiscing elit. Pulvinar finibus lectus semper volutpat orci congue vitae justo cubilia molestie accumsan maximus semper varius rutrum mauris augue."
                        loggedIn={accountLoading === false && !!account}
                    />
                    {/* minimum length for shortParagraph string: 66 char,
                        or the wrapping is off at widest tablet 2 column width :( */}
                    <SingleLinkCard
                        cardHeading="AskUs and student IT support"
                        landingUrl={linkToDrupal('/askus-and-it-support')}
                        iconBackgroundImage={toolboxBackgroundImage}
                        shortParagraph="Lorem ipsum odor amet, consectetuer adipiscing elit. Lectus. finibus finibus finibus"
                        loggedIn={accountLoading === false && !!account}
                    />
                    <SingleLinkCard
                        cardHeading="Research and publish"
                        landingUrl={linkToDrupal('/research-and-publish')}
                        iconBackgroundImage={scienceMoleculeBackgroundImage}
                        shortParagraph="Lorem ipsum odor amet, consectetuer adipiscing elit. Dolor adipiscing ante nullam accumsan volutpat; fermentum etiam sodales tempor natoque."
                        loggedIn={accountLoading === false && !!account}
                    />
                    <SingleLinkCard
                        cardHeading="Find and borrow"
                        landingUrl={linkToDrupal('/find-and-borrow')}
                        iconBackgroundImage={bookBackgroundImage}
                        shortParagraph="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquet felis quis urna posuere, ac ornare justo vulputate. Nulla dictum."
                        loggedIn={accountLoading === false && !!account}
                    />
                    <SingleLinkCard
                        cardHeading="Visit"
                        landingUrl={linkToDrupal('/visit-our-spaces')}
                        iconBackgroundImage={schoolBuildingBackgroundimage}
                        shortParagraph="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi placerat erat scelerisque nulla vehicula, quis finibus nibh egestas. Cras sapien."
                        loggedIn={accountLoading === false && !!account}
                    />
                    <SingleLinkCard
                        cardHeading="About"
                        landingUrl={linkToDrupal('/about-us')}
                        iconBackgroundImage={schoolBuildingBackgroundimage}
                        shortParagraph="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam non ultrices mi. Etiam lobortis nunc non elementum sodales. Fusce turpis."
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
