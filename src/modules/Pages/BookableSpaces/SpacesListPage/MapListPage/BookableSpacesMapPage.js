import React from 'react';
import { useLocation } from 'react-router';
import { useTitle } from 'hooks';
import BookableSpacesListContainer from 'modules/Pages/BookableSpaces/BookableSpacesListContainer';
import BookableSpacesPageLayout from 'modules/Pages/BookableSpaces/Shared/BookableSpacesPageLayout';
import { trackSpacesPageView } from 'modules/Pages/BookableSpaces/Shared/spacesAnalytics';

const BookableSpacesMapPage = props => {
    const [pageAnnouncement, setPageAnnouncement] = React.useState('');
    const location = useLocation();
    const pageTitle = 'Bookable Spaces map - UQ Library';
    useTitle(pageTitle);

    React.useEffect(() => {
        setPageAnnouncement('Bookable Spaces map');
    }, []);

    React.useEffect(() => {
        trackSpacesPageView(pageTitle, location.key);
    }, [location.key, pageTitle]);

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
