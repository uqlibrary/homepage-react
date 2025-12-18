import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router';

import { Grid } from '@mui/material';

import { useAccountContext } from 'context';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { locale } from 'modules/Pages/Admin/BookableSpaces/bookablespaces.locale';
import { SpacesAdminPage } from 'modules/Pages/Admin/BookableSpaces/SpacesAdminPage';
import { EditSpaceForm } from 'modules/Pages/Admin/BookableSpaces/Form/EditSpaceForm';
import {
    addBreadcrumbsToSiteHeader,
    initialisedSpringshareList,
    spacesAdminLink,
    validCampusList,
    weeklyHoursLoaded,
} from 'modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers';

export const BookableSpacesEditSpace = ({
    actions,
    bookableSpacesRoomUpdating,
    bookableSpacesRoomUpdateError,
    bookableSpacesRoomUpdateResult,
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
    bookableSpaceGetting,
    bookableSpaceGetError,
    bookableSpaceGetResult,
}) => {
    console.log('Edit bookableSpaceGet:', bookableSpaceGetting, bookableSpaceGetError, bookableSpaceGetResult);
    console.log('Edit campusList:', campusListLoading, campusListError, campusList);
    console.log('Edit weeklyHours:', weeklyHoursLoading, weeklyHoursError, weeklyHours, weeklyHours?.locations);
    console.log('Edit facilityTypeList:', facilityTypeListLoading, facilityTypeListError, facilityTypeList);
    console.log(
        'Edit bookableSpacesRoomList:',
        bookableSpacesRoomListLoading,
        bookableSpacesRoomListError,
        bookableSpacesRoomList,
    );

    const { account } = useAccountContext();

    // "spaceUuid" matching the param passed in pathConfig.js and config/routes.js
    const { spaceUuid } = useParams();

    const [cookies, setCookie] = useCookies();
    const [formValues, setFormValues2] = useState([]);
    const setFormValues = newValues => {
        console.log('BookableSpacesEditSpace setFormValues', newValues);
        setFormValues2(newValues);
    };

    const pageTitle = 'Edit Space';
    const currentPageSlug = 'edit-space';

    useEffect(() => {
        addBreadcrumbsToSiteHeader([
            '<li class="uq-breadcrumb__item"><span class="uq-breadcrumb__link">Add a Space</span></li>',
        ]);

        if (
            !!spaceUuid &&
            bookableSpaceGetting === null &&
            bookableSpaceGetError === null &&
            bookableSpaceGetResult === null
        ) {
            actions.loadABookableSpacesRoom(spaceUuid);
        }
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
        }
    }, [campusList, campusListError, campusListLoading]);

    const [springshareList, setSpringshareList] = useState({});
    useEffect(() => {
        if (weeklyHoursLoaded(weeklyHoursLoading, weeklyHoursError, weeklyHours)) {
            setSpringshareList(initialisedSpringshareList(locale, weeklyHours));
        }
    }, [weeklyHoursLoading, weeklyHoursError, weeklyHours]);

    useEffect(() => {
        if (bookableSpaceGetting === false && bookableSpaceGetError === false && !!bookableSpaceGetResult?.data) {
            setFormValues({
                facility_types: bookableSpaceGetResult?.data?.facility_types,
                building_name: bookableSpaceGetResult?.data?.space_building_name,
                building_number: bookableSpaceGetResult?.data?.space_building_number,
                library_name: bookableSpaceGetResult?.data?.space_library_name,
                library_id: bookableSpaceGetResult?.data?.space_library_id,
                floor_name: bookableSpaceGetResult?.data?.space_floor_name,
                floor_id: bookableSpaceGetResult?.data?.space_floor_id,
                campus_name: bookableSpaceGetResult?.data?.space_campus_name,
                campus_id: bookableSpaceGetResult?.data?.space_campus_id,
                space_description: bookableSpaceGetResult?.data?.space_description,
                space_id: bookableSpaceGetResult?.data?.space_id,
                space_is_ground_floor: bookableSpaceGetResult?.data?.space_is_ground_floor,
                space_latitude: bookableSpaceGetResult?.data?.space_latitude,
                space_longitude: bookableSpaceGetResult?.data?.space_longitude,
                space_name: bookableSpaceGetResult?.data?.space_name,
                space_opening_hours_id: bookableSpaceGetResult?.data?.space_opening_hours_id || -1,
                space_opening_hours_override: bookableSpaceGetResult?.data?.space_opening_hours_override,
                space_photo_description: bookableSpaceGetResult?.data?.space_photo_description,
                space_photo_url: bookableSpaceGetResult?.data?.space_photo_url,
                space_precise: bookableSpaceGetResult?.data?.space_precise,
                space_services_page: bookableSpaceGetResult?.data?.space_services_page,
                space_type: bookableSpaceGetResult?.data?.space_type,
                space_uuid: bookableSpaceGetResult?.data?.space_uuid,
            });
        }
    }, [bookableSpaceGetting, bookableSpaceGetError, bookableSpaceGetResult]);

    const updateSpace = valuesToSend => {
        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && window.location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', valuesToSend);
        }
        console.log('updateSpace valuesToSend=', valuesToSend);
        console.log('updateSpace valuesToSend.uploadedFile=', valuesToSend.uploadedFile);

        !!valuesToSend?.uploadedFile
            ? actions.updateBookableSpaceWithNewImage(valuesToSend)
            : actions.updateBookableSpaceWithExistingImage(valuesToSend, 'update');
    };

    if (
        bookableSpaceGetting === false &&
        bookableSpaceGetError === false &&
        !!bookableSpaceGetResult?.data &&
        Object.keys(bookableSpaceGetResult?.data).length === 0
    ) {
        return (
            <SpacesAdminPage systemTitle="Spaces" pageTitle={pageTitle} currentPageSlug={currentPageSlug}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <p data-testid="missing-record">There is no Space with ID "{spaceUuid}".</p>
                    </Grid>
                </Grid>
            </SpacesAdminPage>
        );
    }
    if (!!bookableSpaceGetting || !!bookableSpacesRoomListLoading || !!campusListLoading) {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <InlineLoader message="Loading" />
                </Grid>
            </Grid>
        );
    } else if (
        !!campusListError ||
        !!bookableSpacesRoomListError ||
        !!bookableSpaceGetError ||
        !bookableSpaceGetResult?.data ||
        !!facilityTypeListError ||
        !!weeklyHoursError ||
        !formValues?.campus_id
    ) {
        return (
            <SpacesAdminPage systemTitle="Spaces" pageTitle={pageTitle} currentPageSlug={currentPageSlug}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div data-testid="load-space-form-error">
                            <p>Something went wrong - please try again later.</p>
                            {!!campusListError && <p>Campus-building data had a problem.</p>}
                            {!!bookableSpacesRoomListError && <p>Space types list had a problem.</p>}
                            {!!bookableSpaceGetError && <p>Space details had a problem.</p>}
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
        console.log('No Libraries currentCampusList=', currentCampusList);
        console.log('No Libraries bookableSpacesRoomListLoading=', bookableSpacesRoomListLoading);
        console.log('No Libraries bookableSpacesRoomListError=', bookableSpacesRoomListError);
        console.log('No Libraries bookableSpacesRoomList=', bookableSpacesRoomList);
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
        return (
            <EditSpaceForm
                actions={actions}
                bookableSpacesRoomUpdating={bookableSpacesRoomUpdating}
                bookableSpacesRoomUpdateError={bookableSpacesRoomUpdateError}
                bookableSpacesRoomUpdateResult={bookableSpacesRoomUpdateResult}
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
                saveToDb={updateSpace}
                pageTitle={pageTitle}
                currentPageSlug={currentPageSlug}
                bookableSpaceGetError={bookableSpaceGetError}
                springshareList={springshareList}
                currentCampusList={currentCampusList}
                mode="edit"
            />
        );
    }
};

BookableSpacesEditSpace.propTypes = {
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
    bookableSpaceGetting: PropTypes.any,
    bookableSpaceGetError: PropTypes.any,
    bookableSpaceGetResult: PropTypes.any,
    bookableSpacesRoomUpdating: PropTypes.any,
    bookableSpacesRoomUpdateError: PropTypes.any,
    bookableSpacesRoomUpdateResult: PropTypes.any,
};

export default React.memo(BookableSpacesEditSpace);
