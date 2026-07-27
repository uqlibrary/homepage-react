import React from 'react';
import BookableSpacesListContainer from './BookableSpacesListContainer';
import BookableSpacesPageLayout from './Shared/BookableSpacesPageLayout';

const BookableSpacesDetailPage = props => (
    <BookableSpacesPageLayout>
        <BookableSpacesListContainer {...props} />
    </BookableSpacesPageLayout>
);

export default BookableSpacesDetailPage;
