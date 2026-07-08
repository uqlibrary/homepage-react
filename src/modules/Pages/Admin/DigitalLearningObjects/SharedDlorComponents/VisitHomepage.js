import React from 'react';
import { Link } from 'react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';

const VisitHomepage = () => {
    return (
        <Link to={'/digital-learning-hub'} title="Visit public pages" data-testid="dlor-admin-public-homepage-link">
            <VisibilityIcon sx={{ color: 'black' }} />
        </Link>
    );
};

export default VisitHomepage;
