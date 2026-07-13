import React from 'react';
import BookableSpacesListContainer from 'modules/Pages/BookableSpaces/BookableSpacesListContainer';
import BookableSpacesPageLayout from './BookableSpacesPageLayout';

const BookableSpacesMapPage = props => (
	<BookableSpacesPageLayout>
		<BookableSpacesListContainer {...props} forceAdvanced />
	</BookableSpacesPageLayout>
);

export default BookableSpacesMapPage;
