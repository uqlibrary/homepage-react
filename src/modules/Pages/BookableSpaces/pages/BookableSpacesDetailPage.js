import React from 'react';
import BookableSpacesListContainer from 'modules/Pages/BookableSpaces/BookableSpacesListContainer';
import BookableSpacesPageLayout from './BookableSpacesPageLayout';

const BookableSpacesDetailPage = props => (
	<BookableSpacesPageLayout>
		<BookableSpacesListContainer {...props} />
	</BookableSpacesPageLayout>
);

export default BookableSpacesDetailPage;
