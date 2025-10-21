import React from 'react';
import PropTypes from 'prop-types';

export const BookableSpacesEditSpace = ({ actions }) => {
    React.useEffect(() => {
        console.log('empty BookableSpacesEditSpace');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div>empty BookableSpacesEditSpace</div>;
};

BookableSpacesEditSpace.propTypes = {
    actions: PropTypes.any,
};

export default React.memo(BookableSpacesEditSpace);
