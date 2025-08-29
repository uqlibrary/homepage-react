import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { breadcrumbs } from 'config/routes';
import { pluralise } from 'helpers/general';

const StyledStandardCard = styled(StandardCard)(() => ({
    '& .MuiCardHeader-root': {
        paddingBottom: 0,
    },
    '& .MuiCardContent-root': {
        paddingBlock: 0,
    },
}));
const StyledDialog = styled('dialog')(({ theme }) => ({
    width: '80%',
    height: '80%',
    border: '1px solid rgba(38, 85, 115, 0.15)',
    '& .dialogRow': {
        padding: '1rem',
        '& label': {
            fontWeight: 500,
            display: 'block',
        },
        '& input[type="text"]': {
            padding: '0.5rem',
            width: '90%',
        },
        '& :focus-visible': {
            outlineColor: theme.palette.primary.light,
        },
    },
    '& .dialogFooter': {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '1rem',
    },
}));
const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: theme.palette.primary.light,
    borderRadius: '.25rem',
    boxSizing: 'border-box',
    color: '#fff',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '.5rem',
    fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1,
    padding: '1rem 1.5rem',
    position: 'relative',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'background-color 200ms ease-out, color 200ms ease-out, border 200ms ease-out',
    '&.secondary': {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: theme.palette.primary.light,
        color: theme.palette.primary.light,
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
            borderColor: theme.palette.primary.light,
            color: '#fff',
        },
    },
    '&.primary': {
        '&:hover': {
            backgroundColor: '#fff',
            borderColor: '#51247a',
            color: '#51247a',
            textDecoration: 'underline',
        },
    },
}));
const StyledGridItem = styled(Grid)(() => ({
    marginTop: '12px',
}));
const StyledEditButton = styled(Button)(() => ({
    '& svg': {
        color: 'grey',
        height: '1rem',
    },
    marginLeft: '0.5rem',
    '&:hover, &:focus': {
        backgroundColor: 'transparent',
        '& svg': {
            color: 'black',
        },
    },
}));
const StyledDiv = styled('div')(() => ({
    display: 'flex',
    textAlign: 'center',
}));
const StyledRow = styled('div')(() => ({
    marginBlock: '1rem',
}));
export const BookableSpacesManageLocations = ({ actions, siteList, siteListLoading, siteListError }) => {
    React.useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.bookablespacesadmin.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.bookablespacesadmin.pathname);

        // actions.clearSites();

        if (siteListError === null && siteListLoading === null && siteList === null) {
            actions.loadBookableSpaceSites();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function editSite(siteId) {
        console.log('editSite', siteId);
        const siteDetails = siteList.find(s => s.site_id === siteId);
        console.log('siteDetails=', siteDetails);
        const formBody = `<h2>Edit site details</h2>
                                <div class="dialogRow">
                                    <label for="siteName">Site name</label>
                                    <input id="siteName" type="text" value="${siteDetails.site_name}" />
                                </div>
                                <div class="dialogRow">
                                    <label for="siteNumber">Site number</label>
                                    <input id="siteNumber" type="text" value=${siteDetails.site_id_displayed} />
                                </div>`;

        const dialogBodyElement = document.getElementById('dialogBody');
        !!dialogBodyElement && (dialogBodyElement.innerHTML = formBody);

        const dialog = document.getElementById('siteDialog');
        !!dialog && dialog.showModal();
    }

    function closeDialog(e) {
        e.target.closest('dialog').close();

        const dialogBodyElement = document.getElementById('dialogBody');
        !!dialogBodyElement && (dialogBodyElement.innerHTML = '');
    }

    function getLocationLayout(siteList) {
        return (
            <>
                {siteList.map(site => [
                    <StyledRow key={`site-${site.site_id}`}>
                        <div style={{ paddingLeft: '4rem' }}>
                            <StyledDiv>
                                <span>{site.site_name}</span>
                                <StyledEditButton
                                    size="small"
                                    onClick={() => editSite(site.site_id)}
                                    aria-label={`Edit ${site.site_name} site details`}
                                >
                                    <EditIcon />
                                </StyledEditButton>
                            </StyledDiv>
                        </div>
                    </StyledRow>,
                    ...site.buildings.flatMap(building => [
                        <StyledRow key={`building-${building.building_id}`}>
                            <div style={{ paddingLeft: '8rem' }}>
                                <StyledDiv>
                                    <span>{`${building.building_name}`}</span>
                                    <span style={{ marginLeft: '0.5rem' }}>{`(${building.floors.length} ${pluralise(
                                        'Floor',
                                        building.floors.length,
                                    )})`}</span>
                                    <StyledEditButton
                                        color="primary"
                                        size="small"
                                        // onClick={() => editSite(site.site_id)}
                                        aria-label={`Edit ${building.building_name}`}
                                    >
                                        <EditIcon />
                                    </StyledEditButton>
                                </StyledDiv>
                            </div>
                        </StyledRow>,
                        ...building.floors.map(floor => (
                            <StyledRow key={`location-floor-${floor.floor_id}`}>
                                <div style={{ paddingLeft: '12rem' }}>
                                    <StyledDiv>
                                        {floor.floor_id_displayed}
                                        {building.ground_floor_id === floor.floor_id && ' [Ground]'}
                                        <StyledEditButton
                                            color="primary"
                                            size="small"
                                            // onClick={() => editSite(site.site_id)}
                                            aria-label={`Edit ${floor.floor_id_displayed}`}
                                        >
                                            <EditIcon />
                                        </StyledEditButton>
                                    </StyledDiv>
                                </div>
                            </StyledRow>
                        )),
                    ]),
                ])}
            </>
        );
    }

    return (
        <StandardPage title="Library bookable spaces Location management">
            <section aria-live="assertive">
                <StandardCard standardCardId="location-list-card" noPadding noHeader style={{ border: 'none' }}>
                    <Grid container spacing={3}>
                        {(() => {
                            if (!!siteListLoading) {
                                return (
                                    <StyledGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <InlineLoader message="Loading" />
                                        </StyledStandardCard>
                                    </StyledGridItem>
                                );
                            } else if (!!siteListError) {
                                return (
                                    <StyledGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <p>Something went wrong - please try again later.</p>
                                        </StyledStandardCard>
                                    </StyledGridItem>
                                );
                            } else if (!siteList || siteList.length === 0) {
                                return (
                                    <StyledGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <p>No spaces currently in system - please try again soon.</p>
                                        </StyledStandardCard>
                                    </StyledGridItem>
                                );
                            } else {
                                return <StyledGridItem>{getLocationLayout(siteList)}</StyledGridItem>;
                            }
                        })()}
                    </Grid>
                </StandardCard>
                <StyledDialog id={'siteDialog'} closedby="any">
                    <form>
                        <div id="dialogBody" />
                        <div id="dialogFooter" className={'dialogFooter'}>
                            <StyledButton
                                className={'secondary'}
                                // variant="contained"
                                children={'Cancel'}
                                // disabled={!isFormValid}
                                onClick={closeDialog}
                            />
                            <StyledButton
                                className={'primary'}
                                // variant="contained"
                                children={'Save'}
                                // children={defaults.type === 'edit' ? 'Save' : 'Create'}
                                // disabled={!isFormValid}
                                // onClick={saveChange}
                            />
                        </div>
                    </form>
                </StyledDialog>
            </section>
        </StandardPage>
    );
};

BookableSpacesManageLocations.propTypes = {
    actions: PropTypes.any,
    siteList: PropTypes.any,
    siteListLoading: PropTypes.any,
    siteListError: PropTypes.any,
};

export default React.memo(BookableSpacesManageLocations);
