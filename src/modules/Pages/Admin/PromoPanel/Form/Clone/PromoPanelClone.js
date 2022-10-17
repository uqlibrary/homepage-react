import React from 'react';
import PropTypes from 'prop-types';
// import { useParams } from 'react-router';

// import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
// import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

// import { SpotlightsUtilityArea } from 'modules/Pages/Admin/Spotlights/SpotlightsUtilityArea';
// import { SpotlightForm } from 'modules/Pages/Admin/Spotlights/Form/SpotlightForm';
// import { getTimeMondayMidnightNext, getTimeSundayNextFormatted }
// from 'modules/Pages/Admin/Spotlights/spotlighthelpers';
// import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';

export const PromoPanelClone = (
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
    // const { spotlightid } = useParams();

    // const [defaults, setDefaults] = React.useState({});

    // React.useEffect(() => {
    //     /* istanbul ignore else */
    //     if (!!spotlightid) {
    //         actions.loadASpotlight(spotlightid);
    //         actions.loadAllSpotlights();
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [spotlightid]);

    // React.useEffect(() => {
    //     if (!!spotlightid && spotlight?.id === spotlightid) {
    //         setDefaults({
    //             id: spotlight?.id || /* istanbul ignore next */ '',
    //             startDateDefault: getTimeMondayMidnightNext(),
    //             endDateDefault: getTimeSundayNextFormatted(),
    //             title: spotlight?.title || /* istanbul ignore next */ '',
    //             url: spotlight?.url || /* istanbul ignore next */ '',
    //             // eslint-disable-next-line camelcase
    //             img_url: spotlight?.img_url || /* istanbul ignore next */ '',
    //             // eslint-disable-next-line camelcase
    //             img_alt: spotlight?.img_alt || /* istanbul ignore next */ '',
    //             weight: spotlight?.weight || 1000,
    //             active: spotlight?.active || 0,
    //             // minimumDate: getStartOfDayFormatted(),
    //             type: 'clone',
    //             // eslint-disable-next-line camelcase
    //             admin_notes: spotlight?.admin_notes || /* istanbul ignore next */ '',
    //         });
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [spotlight]);

    // if (
    //     spotlightStatus === 'loading' ||
    //     spotlightStatus === null ||
    //     !!publicFileUploading ||
    //     !defaults ||
    //     !defaults.id
    // ) {
    //     return (
    //         <div style={{ minHeight: 600 }}>
    //             <InlineLoader message="Loading" />
    //         </div>
    //     );
    // }

    return (
        <StandardPage title="Spotlights Management">
            <h1>Promo Panel Clone</h1>
        </StandardPage>
    );
};

PromoPanelClone.propTypes = {
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

export default PromoPanelClone;
