import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { HeaderBar } from 'modules/Pages/Admin/BookableSpaces/HeaderBar';
import { EditSpaceForm } from '../EditSpaceForm';
import { addBreadcrumbsToSiteHeader, displayToastMessage } from 'modules/Pages/Admin/BookableSpaces/helpers';

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

    const [cookies, setCookie] = useCookies();

    const [formValues, setFormValues2] = useState([]);
    const setFormValues = newValues => {
        setFormValues2(newValues);
    };

    useEffect(() => {
        addBreadcrumbsToSiteHeader([
            '<li class="uq-breadcrumb__item"><span class="uq-breadcrumb__link">Add a Space</span></li>',
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createNewSpace = valuesToSend => {
        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && window.location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', valuesToSend);
        }

        actions
            .addBookableSpaceLocation(valuesToSend, 'space')
            .then(() => {})
            .catch(e => {
                console.log('catch: adding new space failed:', e);
                displayToastMessage(
                    '[BSAS-001] Sorry, an error occurred - Saving the new Space failed. The admins have been informed.',
                );
            });
    };

    return (
        <EditSpaceForm
            actions={actions}
            bookableSpacesRoomAdding={bookableSpacesRoomAdding}
            bookableSpacesRoomAddError={bookableSpacesRoomAddError}
            bookableSpacesRoomAddResult={bookableSpacesRoomAddResult}
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
            saveToDb={createNewSpace}
            PageWrapper={PageWrapper}
            mode="add"
        />
    );
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
