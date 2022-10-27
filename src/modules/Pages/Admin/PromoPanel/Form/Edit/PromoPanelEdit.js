import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
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

export const PromoPanelEdit = ({
    actions,
    promoPanelList,
    promoPanelUserTypeList,
    currentPromoPanel,
    promoPanelLoading,
    // spotlight,
    // spotlightError,
    // spotlightStatus,
    // history,
    // publicFileUploading,
    // publicFileUploadError,
    // publicFileUploadResult,
    // spotlights,
    // spotlightsLoading,
}) => {
    const { panelID } = useParams();
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

    React.useEffect(() => {
        /* istanbul ignore else */
        if (!promoPanelLoading && !currentPromoPanel) {
            actions.loadAllSpotlights();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    console.log('PANEL ID', panelID);
    return (
        <StandardPage title="Promo Panel Management">
            <section aria-live="assertive">
                <StandardCard title="Edit a new Promo Panel">
                    <PromoPanelForm defaults={defaults} actions={actions} history={history} />
                </StandardCard>
            </section>
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
