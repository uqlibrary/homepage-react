import React from 'react';
import PropTypes from 'prop-types';

// import { SpotlightsUtilityArea } from 'modules/Pages/Admin/Spotlights/SpotlightsUtilityArea';
// import { SpotlightForm } from 'modules/Pages/Admin/Spotlights/Form/SpotlightForm';
// import {
//     getStartOfDayFormatted,
//     getTimeMondayMidnightNext,
//     getTimeSundayNextFormatted,
// } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

// import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
// import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';

export const PromoPanelEdit = (
    {
        // actions,
        // spotlight,
        // spotlightError,
        // spotlightStatus,
        // history,
        // publicFileUploading,
        // publicFileUploadError,
        // publicFileUploadResult,
        // spotlights,
        // spotlightsLoading,
    },
) => {
    // const defaults = {
    //     id: '',
    //     startDateDefault: getTimeMondayMidnightNext(),
    //     endDateDefault: getTimeSundayNextFormatted(),
    //     title: '',
    //     url: '',
    //     img_url: '',
    //     img_alt: '',
    //     weight: 1000,
    //     active: 0,
    //     type: 'add',
    //     minimumDate: getStartOfDayFormatted(),
    //     admin_notes: '',
    // };

    // React.useEffect(() => {
    //     /* istanbul ignore else */
    //     if (!spotlightsLoading && !spotlights) {
    //         actions.loadAllSpotlights();
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    return (
        <StandardPage title="PromoPanel Management">
            <h1>PromoPanel Edit</h1>
        </StandardPage>
    );
};

PromoPanelEdit.propTypes = {
    actions: PropTypes.any,
    spotlight: PropTypes.any,
    spotlightError: PropTypes.any,
    spotlightStatus: PropTypes.any,
    history: PropTypes.object,
    publicFileUploading: PropTypes.any,
    publicFileUploadError: PropTypes.any,
    publicFileUploadResult: PropTypes.any,
    spotlights: PropTypes.any,
    spotlightsLoading: PropTypes.any,
};

export default PromoPanelEdit;
