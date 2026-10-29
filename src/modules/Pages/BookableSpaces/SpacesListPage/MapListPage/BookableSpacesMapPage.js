import React from 'react';
import { useTitle } from 'hooks';
import BookableSpacesListContainer from 'modules/Pages/BookableSpaces/BookableSpacesListContainer';
import BookableSpacesPageLayout from 'modules/Pages/BookableSpaces/Shared/BookableSpacesPageLayout';

const BookableSpacesMapPage = props => {
    const [pageAnnouncement, setPageAnnouncement] = React.useState('');
    useTitle('Bookable Spaces map - UQ Library');

    React.useEffect(() => {
        setPageAnnouncement('Bookable Spaces map');
    }, []);

    return (
        <BookableSpacesPageLayout>
            {pageAnnouncement && (
                <div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', left: '-9999px' }}>
                    {pageAnnouncement}
                </div>
            )}
            <BookableSpacesListContainer {...props} forceAdvanced />
        </BookableSpacesPageLayout>
    );
};

export default BookableSpacesMapPage;
