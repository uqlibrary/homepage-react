import React from 'react';

import VisibilityIcon from '@mui/icons-material/Visibility';

import { getPathRoot } from 'modules/Pages/DigitalLearningObjects/dlorHelpers';

const VisitHomepage = () => {
    return (
        <a
            href={`${getPathRoot()}/digital-learning-hub`}
            title="Visit public pages"
            data-testid="dlor-admin-public-homepage-link"
        >
            <VisibilityIcon sx={{ color: 'black' }} />
        </a>
    );
};

export default VisitHomepage;
