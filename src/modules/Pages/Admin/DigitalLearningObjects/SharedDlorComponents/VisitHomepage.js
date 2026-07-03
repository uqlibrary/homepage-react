import React from 'react';
import { Link } from 'react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { getPathRoot } from 'modules/Pages/DigitalLearningObjects/dlorHelpers';

const VisitHomepage = () => {
    return (
        <Link
            to={`${getPathRoot()}/digital-learning-hub`}
            title="Visit public pages"
            data-testid="dlor-admin-public-homepage-link"
        >
            <VisibilityIcon sx={{ color: 'black' }} />
        </Link>
    );
};

export default VisitHomepage;
