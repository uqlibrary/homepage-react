import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';

import { Grid } from '@mui/material';

import { useAccountContext } from 'context';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { SpacesAdminPage } from 'modules/Pages/Admin/BookableSpaces/SpacesAdminPage';
import { EditSpaceForm } from '../EditSpaceForm';
import {
    addBreadcrumbsToSiteHeader,
    initialisedSpringshareList,
    spacesAdminLink,
    validCampusList,
    weeklyHoursLoaded,
} from 'modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers';
import { locale } from 'modules/Pages/Admin/BookableSpaces/bookablespaces.locale';

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

    const pageTitle = 'Add a new Space';
    const currentPageSlug = 'add-space';

    useEffect(() => {
        addBreadcrumbsToSiteHeader([
            '<li class="uq-breadcrumb__item"><span class="uq-breadcrumb__link">Add a Space</span></li>',
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log(
            'useEffect campusList',
            campusListLoading,
            campusListError,
            campusList,
            'bookableSpacesRoomListReducer',
        );
        if (campusListLoading === null && campusListError === null && campusList === null) {
            actions.loadBookableSpaceCampusChildren(); // get list of campuses, buildings and floors
            console.log('should start bookableSpacesRoomListReducer');
            actions.loadAllBookableSpacesRooms(); // get list of Spaces
            actions.loadWeeklyHours(); // get weeklyHours for each library from springshare
            actions.loadAllFacilityTypes(); // get list of facility types
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [currentCampusList, setCurrentCampusList2] = useState({});
    const setCurrentCampusList = x => {
        console.log(setCurrentCampusList, x);
        setCurrentCampusList2(x);
    };
    const [mostRecentSpace, setMostRecentSpace] = useState(0);
    useEffect(() => {
        if (campusListLoading === false && campusListError === false && campusList?.length > 0) {
            const _currentCampusList = validCampusList(campusList);
            setCurrentCampusList(_currentCampusList);
        }
    }, [campusList, campusListError, campusListLoading]);

    useEffect(() => {
        console.log(
            'mostRecentSpace bookableSpacesRoomList',
            bookableSpacesRoomListLoading,
            bookableSpacesRoomListError,
            bookableSpacesRoomList,
        );
        if (
            bookableSpacesRoomListLoading === false &&
            bookableSpacesRoomListError === false &&
            bookableSpacesRoomList?.data?.locations?.length > 0
        ) {
            const _mostRecentSpace = bookableSpacesRoomList?.data?.locations
                .filter(s => !!s.space_latitude && !!s.space_longitude)
                .reduce((prev, current) => {
                    if (+current.space_id > +prev.space_id) {
                        return current;
                    } else {
                        return prev;
                    }
                });
            setMostRecentSpace(_mostRecentSpace);
            console.log('_mostRecentSpace', _mostRecentSpace);
            const newValues = {
                ['campus_id']: _mostRecentSpace?.space_campus_id,
                ['library_id']: _mostRecentSpace?.space_library_id,
                ['floor_id']: _mostRecentSpace?.space_floor_id,
                ['space_opening_hours_id']: _mostRecentSpace?.space_opening_hours_id,
                ['space_latitude']: _mostRecentSpace?.space_latitude,
                ['space_longitude']: _mostRecentSpace?.space_longitude,
            };
            console.log('set form values 0', newValues);
            setFormValues(newValues);
        }
    }, [bookableSpacesRoomListLoading, bookableSpacesRoomListError, bookableSpacesRoomList]);

    const [springshareList, setSpringshareList] = useState({});
    useEffect(() => {
        if (weeklyHoursLoaded(weeklyHoursLoading, weeklyHoursError, weeklyHours)) {
            setSpringshareList(initialisedSpringshareList(locale, weeklyHours));
        }
    }, [weeklyHoursLoading, weeklyHoursError, weeklyHours]);

    const createNewSpace = valuesToSend => {
        console.log('createNewSpace valuesToSend=', valuesToSend);
        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && window.location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', valuesToSend);
        }

        actions.createBookableSpaceWithNewImage(valuesToSend);
    };

    if (!!campusListLoading || !!bookableSpacesRoomListLoading || !!facilityTypeListLoading || !!weeklyHoursLoading) {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <InlineLoader message="Loading" />
                </Grid>
            </Grid>
        );
    } else if (!!campusListError || !!bookableSpacesRoomListError || !!facilityTypeListError || !!weeklyHoursError) {
        return (
            <SpacesAdminPage systemTitle="Spaces" pageTitle={pageTitle} currentPageSlug={currentPageSlug}>
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
            </SpacesAdminPage>
        );
    } else if (
        !currentCampusList ||
        currentCampusList?.length === 0 ||
        (bookableSpacesRoomListLoading === false &&
            bookableSpacesRoomListError === false &&
            (!bookableSpacesRoomList?.data?.locations || bookableSpacesRoomList?.data?.locations.length === 0))
    ) {
        return (
            <SpacesAdminPage systemTitle="Spaces" pageTitle={pageTitle} currentPageSlug={currentPageSlug}>
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
            </SpacesAdminPage>
        );
    } else {
        console.log('currentCampusList=', currentCampusList);
        return (
            <>
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
                    pageTitle={pageTitle}
                    currentPageSlug={currentPageSlug}
                    springshareList={springshareList}
                    currentCampusList={currentCampusList}
                    initialCampus={
                        !!currentCampusList && currentCampusList.length > 0
                            ? currentCampusList?.findIndex(c => c.campus_id === formValues.campus_id)
                            : null
                    }
                    mode="add"
                />
            </>
        );
    }
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
