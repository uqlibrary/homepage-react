import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router';

import { Grid } from '@mui/material';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { HeaderBar } from 'modules/Pages/Admin/BookableSpaces/HeaderBar';
import { EditSpaceForm } from '../EditSpaceForm';
import { addBreadcrumbsToSiteHeader, displayToastMessage } from 'modules/Pages/Admin/BookableSpaces/helpers';

const PageWrapper = ({ children }) => {
    return (
        <StandardPage title="Spaces">
            <HeaderBar pageTitle="Edit Space" currentPage="edit-space" />
            <section aria-live="assertive">
                <StandardCard standardCardId="location-list-card" noPadding noHeader style={{ border: 'none' }}>
                    {children}
                </StandardCard>
            </section>
        </StandardPage>
    );
};

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
    console.log('bookableSpaceGet:', bookableSpaceGetting, bookableSpaceGetError, bookableSpaceGetResult);

    // "spaceUuid" matching the param passed in pathConfig.js and config/routes.js
    const { spaceUuid } = useParams();

    const [cookies, setCookie] = useCookies();
    const [formValues, setFormValues2] = useState([]);
    const setFormValues = newValues => {
        setFormValues2(newValues);
    };

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                space_opening_hours_id: bookableSpaceGetResult?.data?.space_opening_hours_id,
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

        actions
            .updateBookableSpaceLocation(valuesToSend, 'space', formValues.space_id)
            .then(() => {})
            .catch(e => {
                console.log('catch: adding new space failed:', e);
                displayToastMessage(
                    '[BSAS-001] Sorry, an error occurred - Saving the changed Space failed. The admins have been informed.',
                );
            });
    };

    if (
        bookableSpaceGetting === false &&
        bookableSpaceGetError === false &&
        !!bookableSpaceGetResult?.data &&
        Object.keys(bookableSpaceGetResult?.data).length === 0
    ) {
        return (
            <PageWrapper>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <p data-testid="missing-record">There is no Space with ID "{spaceUuid}".</p>
                    </Grid>
                </Grid>
            </PageWrapper>
        );
    }
    return (
        <EditSpaceForm
            actions={actions}
            bookableSpacesRoomUpdating={bookableSpacesRoomUpdating}
            bookableSpacesRoomUpdateError={bookableSpacesRoomUpdateError}
            bookableSpacesRoomUpdateResult={bookableSpacesRoomUpdateResult}
            campusList={campusList}
            campusListLoading={campusListLoading}
            campusListError={campusListError}
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
            PageWrapper={PageWrapper}
            bookableSpaceGetError={bookableSpaceGetError}
            mode="edit"
        />
    );
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
PageWrapper.propTypes = {
    children: PropTypes.node,
};

export default React.memo(BookableSpacesEditSpace);
