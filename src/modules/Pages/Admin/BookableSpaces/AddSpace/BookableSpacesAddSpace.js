import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';

import { Grid } from '@mui/material';

import { useAccountContext } from 'context';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { HeaderBar } from 'modules/Pages/Admin/BookableSpaces/HeaderBar';
import { EditSpaceForm } from '../EditSpaceForm';
import {
    addBreadcrumbsToSiteHeader,
    displayToastErrorMessage,
    initialisedSpringshareList,
    spacesAdminLink,
    validCampusList,
    validLibraryList,
    weeklyHoursLoaded,
} from '../bookableSpacesAdminHelpers';
import { locale } from '../bookablespaces.locale';

const PageWrapper = ({ children }) => {
    return (
        <StandardPage title="Spaces">
            <HeaderBar pageTitle="Add a new Space" currentPage="add-space" />
            <section aria-live="assertive">
                <StandardCard standardCardId="location-list-card" noPadding noHeader style={{ border: 'none' }}>
                    {children}
                </StandardCard>
            </section>
        </StandardPage>
    );
};

export const BookableSpacesAddSpace = ({
    actions,
    bookableSpacesRoomAdding,
    bookableSpacesRoomAddError,
    bookableSpacesRoomAddResult,
    campusList,
    campusListLoading,
    campusListError,
    bookableSpacesRoomList,
    bookableSpacesRoomListLoading,
    bookableSpacesRoomListError,
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
    facilityTypeList,
    facilityTypeListLoading,
    facilityTypeListError,
}) => {
    console.log(
        'addBookableSpaceLocation',
        bookableSpacesRoomAdding,
        bookableSpacesRoomAddError,
        bookableSpacesRoomAddResult,
    );
    console.log('BookableSpacesAddSpace campusList', campusListLoading, campusListError, campusList);
    console.log(
        'BookableSpacesAddSpace xspacesRoomList',
        bookableSpacesRoomListLoading,
        bookableSpacesRoomListError,
        bookableSpacesRoomList,
    );
    console.log('BookableSpacesAddSpace weeklyHours', weeklyHoursLoading, weeklyHoursError, weeklyHours);
    console.log(
        'BookableSpacesAddSpace facilityTypeList',
        facilityTypeListLoading,
        facilityTypeListError,
        facilityTypeList,
    );

    const { account } = useAccountContext();
    const [cookies, setCookie] = useCookies();

    const [formValues, setFormValues2] = useState([]);
    const setFormValues = newValues => {
        console.log('BookableSpacesAddSpace setFormValues', newValues);
        setFormValues2(newValues);
    };

    useEffect(() => {
        addBreadcrumbsToSiteHeader([
            '<li class="uq-breadcrumb__item"><span class="uq-breadcrumb__link">Add a Space</span></li>',
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (campusListLoading === null && campusListError === null && campusList === null) {
            actions.loadBookableSpaceCampusChildren(); // get list of campuses, buildings and floors
            actions.loadAllBookableSpacesRooms(); // get list of Spaces
            actions.loadWeeklyHours(); // get weeklyHours for each library from springshare
            actions.loadAllFacilityTypes(); // get list of facility types
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [currentCampusList, setCurrentCampusList] = useState({});
    useEffect(() => {
        if (campusListLoading === false && campusListError === false && campusList?.length > 0) {
            const _currentCampusList = validCampusList(campusList);
            setCurrentCampusList(_currentCampusList);

            const currentCampus = _currentCampusList?.at(0) || {};
            const campusId = currentCampus?.campus_id;

            const currentCampusLibraries = validLibraryList(currentCampus?.libraries || []);
            const currentLibrary = currentCampusLibraries?.at(0) || {};
            const libraryId = currentLibrary?.library_id;

            const currentLibraryFloors = currentLibrary?.floors || [];
            const currentFloor = currentLibraryFloors?.at(0) || {};
            const floorId = currentFloor?.floor_id;

            const newValues = {
                ['campus_id']: campusId,
                ['library_id']: libraryId,
                ['floor_id']: floorId,
                ['space_opening_hours_id']: currentLibrary?.library_springshare_id,
                // ['currentCampusList']: currentCampusList,
                // ['currentCampusLibraries']: currentCampusLibraries,
                // ['currentLibraryFloors']: currentLibraryFloors,
            };
            setFormValues(newValues);
        }
    }, [campusList, campusListError, campusListLoading]);

    const [springshareList, setSpringshareList] = useState({});
    useEffect(() => {
        if (weeklyHoursLoaded(weeklyHoursLoading, weeklyHoursError, weeklyHours)) {
            setSpringshareList(initialisedSpringshareList(locale, weeklyHours));
        }
    }, [weeklyHoursLoading, weeklyHoursError, weeklyHours]);

    const createNewSpace = valuesToSend => {
        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && window.location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', valuesToSend);
        }

        actions
            .addBookableSpaceLocation(valuesToSend, 'space')
            .then(() => {
                // a pop up confirmation is displayed, because this is a big change!
            })
            .catch(e => {
                console.log('catch: adding new space failed:', e);
                displayToastErrorMessage(
                    '[BSAS-001] Sorry, an error occurred - Saving the new Space failed. The admins have been informed.',
                );
            });
    };

    if (!!bookableSpacesRoomListLoading || !!campusListLoading || !formValues?.campus_id) {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <InlineLoader message="Loading" />
                </Grid>
            </Grid>
        );
    } else if (!!campusListError || !!bookableSpacesRoomListError || !!facilityTypeListError || !!weeklyHoursError) {
        return (
            <PageWrapper>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div data-testid="load-space-form-error">
                            <p>Something went wrong - please try again later.</p>
                            {!!campusListError && <p>Campus-building data had a problem.</p>}
                            {!!bookableSpacesRoomListError && <p>Space types list had a problem.</p>}
                            {!!facilityTypeListError && <p>Facility type details had a problem.</p>}
                            {!!weeklyHoursError && <p>Opening hours details had a problem.</p>}
                        </div>
                    </Grid>
                </Grid>
            </PageWrapper>
        );
    } else if (
        !currentCampusList ||
        currentCampusList?.length === 0 ||
        (bookableSpacesRoomListLoading === false &&
            bookableSpacesRoomListError === false &&
            (!bookableSpacesRoomList?.data?.locations || bookableSpacesRoomList?.data?.locations.length === 0))
    ) {
        return (
            <PageWrapper>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <p data-testid="add-space-no-locations">
                            No Libraries currently in system - please{' '}
                            <a href={spacesAdminLink('/admin/spaces/manage/locations', account)}>
                                create campus locations
                            </a>{' '}
                            and then try again.
                        </p>
                    </Grid>
                </Grid>
            </PageWrapper>
        );
    } else {
        return (
            <EditSpaceForm
                actions={actions}
                bookableSpacesRoomAdding={bookableSpacesRoomAdding}
                bookableSpacesRoomAddError={bookableSpacesRoomAddError}
                bookableSpacesRoomAddResult={bookableSpacesRoomAddResult}
                campusList={campusList}
                bookableSpacesRoomList={bookableSpacesRoomList}
                bookableSpacesRoomListLoading={bookableSpacesRoomListLoading}
                bookableSpacesRoomListError={bookableSpacesRoomListError}
                weeklyHours={weeklyHours}
                weeklyHoursLoading={weeklyHoursLoading}
                weeklyHoursError={weeklyHoursError}
                facilityTypeList={facilityTypeList}
                facilityTypeListLoading={facilityTypeListLoading}
                facilityTypeListError={facilityTypeListError}
                formValues={formValues}
                setFormValues={setFormValues}
                saveToDb={createNewSpace}
                PageWrapper={PageWrapper}
                springshareList={springshareList}
                currentCampusList={currentCampusList}
                mode="add"
            />
        );
    }
};

PageWrapper.propTypes = {
    children: PropTypes.node,
};

BookableSpacesAddSpace.propTypes = {
    actions: PropTypes.any,
    bookableSpacesRoomAdding: PropTypes.any,
    bookableSpacesRoomAddError: PropTypes.any,
    bookableSpacesRoomAddResult: PropTypes.any,
    campusList: PropTypes.any,
    campusListLoading: PropTypes.any,
    campusListError: PropTypes.any,
    bookableSpacesRoomList: PropTypes.any,
    bookableSpacesRoomListLoading: PropTypes.any,
    bookableSpacesRoomListError: PropTypes.any,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.any,
    weeklyHoursError: PropTypes.any,
    facilityTypeList: PropTypes.any,
    facilityTypeListLoading: PropTypes.any,
    facilityTypeListError: PropTypes.any,
};

export default React.memo(BookableSpacesAddSpace);
