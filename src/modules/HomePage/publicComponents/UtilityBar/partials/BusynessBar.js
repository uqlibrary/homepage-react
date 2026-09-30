import React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';

import { ASKUS_SPRINGSHARE_ID, FRYER_SPRINGSHARE_ID } from 'config/locale';
import { VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING, getTextForBusyness } from '../helpers';

const BusynessBar = ({ location }) => {
    if (location?.lid === ASKUS_SPRINGSHARE_ID) {
        return null;
    }
    if (location?.lid === FRYER_SPRINGSHARE_ID) {
        return <div className="occupancyText has-ellipsis">By appointment</div>;
    }
    if (!location?.isCurrentlyOpen) {
        return <div className="occupancyText has-ellipsis">Closed</div>;
    }
    if (location.busyness === null) {
        return null;
    }
    if (location.busyness === VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING) {
        return <div className="occupancyText has-ellipsis has-exclamation-icon">Data not available</div>;
    }
    return (
        <LinearProgress
            className="occupancyBar"
            variant="determinate"
            value={location.busyness}
            aria-label={getTextForBusyness(location, {
                1: 'Not busy',
                2: 'Moderately busy',
                3: 'Quite busy',
                4: 'Very busy',
            })}
        />
    );
};

BusynessBar.propTypes = {
    location: PropTypes.object,
};

export default BusynessBar;
