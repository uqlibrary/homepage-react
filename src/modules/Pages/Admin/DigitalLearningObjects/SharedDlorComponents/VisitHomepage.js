import React from 'react';

import VisibilityIcon from '@mui/icons-material/Visibility';

import { fullPath } from 'config/routes';

const VisitHomepage = () => {
    return (
        <a
            href={`${fullPath}/digital-learning-hub`}
            title="Visit public pages"
            data-testid="dlor-admin-public-homepage-link"
        >
            <VisibilityIcon style={{ color: 'black' }} />
        </a>
    );
};

export default VisitHomepage;
