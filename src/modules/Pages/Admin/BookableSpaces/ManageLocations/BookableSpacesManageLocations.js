import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

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
        '& li': {
            paddingBlock: '0.5rem',
            '& input[type="radio"], & label': {
                display: 'inline',
            },
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
    '&.alert': {
        backgroundColor: '#d62929',
        borderColor: '#d62929',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#fff',
            color: '#d62929',
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

    function displayToastMessage(message, isError = true) {
        const backgroundColor = isError ? '#D62929' : '#4aa74e';
        const icon = isError
            ? 'url("data:image/svg+xml,%3csvg viewBox=%270 0 24 24%27 fill=%27none%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M20.127 18.545a1.18 1.18 0 0 1-1.055 1.706H4.929a1.18 1.18 0 0 1-1.055-1.706l7.072-14.143a1.179 1.179 0 0 1 2.109 0l7.072 14.143Z%27 stroke=%27%23fff%27 stroke-width=%271.5%27%3e%3c/path%3e%3cpath d=%27M12 9v4%27 stroke=%27%23fff%27 stroke-width=%271.5%27 stroke-linecap=%27round%27%3e%3c/path%3e%3ccircle cx=%2711.9%27 cy=%2716.601%27 r=%271.1%27 fill=%27%23fff%27%3e%3c/circle%3e%3c/svg%3e")'
            : 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27%23fff%27 viewBox=%270 0 16 16%27%3E%3Cg stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%27.75%27%3E%3Cpath fill=%27none%27 d=%27M9.258 10.516h-.43A.829.829 0 0 1 8 9.687V7.602c0-.23-.2-.43-.43-.43h-.425%27/%3E%3Cpath d=%27M7.8 5.059a.194.194 0 0 0-.198.199c0 .113.085.199.199.199a.195.195 0 0 0 .199-.2.195.195 0 0 0-.2-.198zm0 0%27/%3E%3Cpath fill=%27none%27 d=%27M8 1.715c3.457 0 6.285 2.828 6.285 6.285 0 3.457-2.828 6.285-6.285 6.285-3.457 0-6.285-2.828-6.285-6.285 0-3.457 2.828-6.285 6.285-6.285zm0 0%27/%3E%3C/g%3E%3C/svg%3E")';
        const html = `
            <style>
                body {
                    position: relative;
                }
                .toast {
                    background-color: ${backgroundColor};
                    color: #fff;
                    padding: .5rem 1.5rem .5rem 2.5rem;
                    background-image: ${icon};
                    background-repeat: no-repeat;
                    background-size: 1.5rem;
                    background-position: 0.75rem center;
                    position: fixed;
                    bottom: 0.5rem;
                    left: 0.5rem;
                    transition: opacity 500ms ease-out;
                    p {
                        font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        font-size: 1rem;
                        font-weight: 400;
                        letter-spacing: 0.16px;
                        line-height: 25.6px;
                    }
                }
            </style>
            <div id="toast-corner-message" class="toast" data-testid="toast">
                <p>${message}</p>
            </div>
        `;

        const template = document.createElement('template');
        !!html && !!template && (template.innerHTML = html);
        const body = document.querySelector('body');
        !!body && !!template && body.appendChild(template.content.cloneNode(true));
        const hideDelay = 3000;
        setTimeout(() => {
            const toast = document.getElementById('toast-corner-message');
            !!toast && (toast.style.opacity = 0);
        }, hideDelay);
        setTimeout(() => {
            const toast = document.getElementById('toast-corner-message');
            !!toast && toast.remove();
        }, hideDelay + 1000);
    }

    function editSite(siteId) {
        const siteDetails = siteId > 0 && siteList.find(s => s.site_id === siteId);
        const formBody =
            !!siteDetails &&
            `<h2>Edit site details</h2>
            <input  name="siteId" type="hidden" value="${siteDetails.site_id}" />
            <input  name="locationType" type="hidden" value="site" />
            <div class="dialogRow">
                <label for="siteName">Site name</label>
                <input id="siteName" name="site_name" type="text" value="${siteDetails.site_name}" />
            </div>
            <div class="dialogRow">
                <label for="siteNumber">Site number</label>
                <input id="siteNumber" name="site_id_displayed" type="text" value="${siteDetails.site_id_displayed}" />
            </div>
            <div class="dialogRow">
                <label>Buildings</label>
                ${siteDetails?.buildings?.length > 0 &&
                    '<ul>' +
                        siteDetails.buildings.map(building => `<li>${building.building_id_displayed} </li>`).join('') +
                        '</ul>'}
                ${siteDetails?.buildings?.length === 0 ? '<p>No buildings</p>' : ''}
            </div>`;

        if (!!formBody) {
            const dialogBodyElement = document.getElementById('dialogBody');
            !!dialogBodyElement && (dialogBodyElement.innerHTML = formBody);

            const dialog = document.getElementById('popupDialog');
            !!dialog && dialog.showModal();
        } else {
            console.log(`Cant get find site with site_id = "${siteId}" in sitelist from api`);
            displayToastMessage('Sorry, something went wrong');
        }
    }

    function editBuilding(buildingId) {
        const buildingDetails =
            buildingId > 0 &&
            siteList.flatMap(site => site.buildings).find(building => building.building_id === buildingId);

        const formBody = `
    <h2>Edit building details</h2>
    <input name="buildingId" type="hidden" value="${buildingDetails?.building_id}" />
    <input name="locationType" type="hidden" value="building" />
    <div class="dialogRow">
        <label for="buildingName">Building name</label>
        <input id="buildingName" name="building_name" type="text" value="${buildingDetails?.building_name}" />
    </div>
    <div class="dialogRow">
        <label for="buildingNumber">Building number</label>
        <input id="buildingNumber" name="building_id_displayed" type="text" value="${
            buildingDetails?.building_id_displayed
        }" />
    </div>
    <div class="dialogRow">
        <label>Floors - Choose ground floor</label>
        ${buildingDetails?.floors?.length > 0 &&
            '<ul>' +
                buildingDetails.floors
                    .map(floor => {
                        const checked = floor.floor_id === buildingDetails.ground_floor_id ? ' checked' : '';
                        return `<li>
                                    <input type="radio" id="groundFloor-${floor.floor_id}" name="groundFloor" ${checked} />
                                    <label for="groundFloor-${floor.floor_id}">Floor ${floor.floor_id_displayed}</label> 
                                </li>`;
                    })
                    .join('') +
                `<li>
                    <input type="radio" id="groundFloor-none}" name="groundFloor" ${
                        !buildingDetails.ground_floor_id ? ' checked' : ''
                    } />
                    <label for="groundFloor-none">None</label> 
                </li>
                </ul>`}
                
        ${buildingDetails?.floors?.length === 0 ? '<p>No floors</p>' : ''}
    </div>`;

        if (!!formBody) {
            const dialogBodyElement = document.getElementById('dialogBody');
            !!dialogBodyElement && (dialogBodyElement.innerHTML = formBody);

            const dialog = document.getElementById('popupDialog');
            !!dialog && dialog.showModal();
        } else {
            console.log(`Cant get find building with building_id = "${buildingId}" in sitelist from api`);
            displayToastMessage('Sorry, something went wrong');
        }
    }

    function closeDialog(e) {
        e.target.closest('dialog').close();

        const dialogBodyElement = document.getElementById('dialogBody');
        !!dialogBodyElement && (dialogBodyElement.innerHTML = '');
    }

    function saveChange(e) {
        const form = e.target.closest('form');

        const formData = new FormData(form);
        const data = !!formData && Object.fromEntries(formData);
        const locationType = data?.locationType;
        const locationid = data[`${locationType}Id`];
        !!locationType &&
            !!locationid &&
            actions
                .updateBookableSpaceLocation(Object.fromEntries(formData))
                .then(() => {
                    closeDialog(e);
                    displayToastMessage('Location changes saved', false);
                    let element;
                    switch (locationType) {
                        case 'site':
                            element = document.getElementById(`site-${locationid}`);
                            !!element && (element.innerText = data?.site_name);
                            break;
                        case 'building':
                            element = document.getElementById(`building-${locationid}`);
                            !!element && (element.innerText = data?.building_name);
                            break;
                        default:
                    }
                })
                .catch(e => {
                    console.log('catch: saving site ', locationid, 'failed:', e);
                    displayToastMessage('An error occurred');
                });
    }

    function getLocationLayout(siteList) {
        return (
            <>
                {siteList.map(site => [
                    <StyledRow key={`site-${site.site_id}`}>
                        <div style={{ paddingLeft: '4rem' }}>
                            <StyledDiv>
                                <span id={`site-${site.site_id}`}>{site.site_name}</span>
                                <StyledEditButton
                                    size="small"
                                    onClick={() => editSite(site.site_id)}
                                    aria-label={`Edit ${site.site_name} campus details`}
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
                                    <span id={`building-${building.building_id}`}>{`${building.building_name}`}</span>
                                    <span style={{ marginLeft: '0.5rem' }}>{`(${building.floors.length} ${pluralise(
                                        'Floor',
                                        building.floors.length,
                                    )})`}</span>
                                    <StyledEditButton
                                        color="primary"
                                        size="small"
                                        onClick={() => editBuilding(building.building_id)}
                                        aria-label={`Edit ${building.building_name} details`}
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
                <StyledDialog id={'popupDialog'} closedby="any">
                    <form>
                        <div id="dialogBody" />
                        <div id="dialogFooter" className={'dialogFooter'}>
                            <div>
                                <StyledButton
                                    className={'alert'}
                                    children={'Delete'}
                                    // onClick={}
                                />
                            </div>
                            <div>
                                <StyledButton
                                    className={'secondary'}
                                    style={{ marginRight: '0.5rem' }}
                                    // onClick={}
                                >
                                    Add new
                                </StyledButton>
                                <StyledButton
                                    className={'secondary'}
                                    style={{ marginRight: '0.5rem' }}
                                    children={'Cancel'}
                                    onClick={closeDialog}
                                />
                                <StyledButton className={'primary'} children={'Save'} onClick={saveChange} />
                            </div>
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
