import React from 'react';
import BookableSpacesListContainer from 'modules/Pages/BookableSpaces/BookableSpacesListContainer';
import BookableSpacesPageLayout from 'modules/Pages/BookableSpaces/Shared/BookableSpacesPageLayout';

const BookableSpacesLandingPage = props => (
    <BookableSpacesPageLayout>
        <BookableSpacesListContainer {...props} />
    </BookableSpacesPageLayout>
);

export default BookableSpacesLandingPage;
