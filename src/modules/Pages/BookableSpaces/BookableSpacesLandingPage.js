import React from 'react';
import BookableSpacesListContainer from './BookableSpacesListContainer';
import BookableSpacesPageLayout from './Shared/BookableSpacesPageLayout';

const BookableSpacesHomePage = props => (
    <BookableSpacesPageLayout>
        <BookableSpacesListContainer {...props} />
    </BookableSpacesPageLayout>
);

export default BookableSpacesHomePage;
