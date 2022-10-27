import React from 'react';
import PropTypes from 'prop-types';

// import { SpotlightsUtilityArea } from 'modules/Pages/Admin/Spotlights/SpotlightsUtilityArea';
import { PromoPanelForm } from 'modules/Pages/Admin/PromoPanel/PromoPanelForm';
// import {
//    getStartOfDayFormatted,
//    getTimeMondayMidnightNext,
//    getTimeSundayNextFormatted,
// } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { getTimeMondayMidnightNext, getTimeSundayNextFormatted } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';
// import { default as locale } from 'modules/Pages/Admin/PromoPanel/promopaneladmin.locale';

export const PromoPanelAdd = ({
    actions,
    // promoPanel,
    // promoPanelError,
    // promoPanelStatus,
    history,
    // promoPanels,
    // promoPanelsLoading,
}) => {
    const defaults = {
        id: '',
        startDateDefault: getTimeMondayMidnightNext(),
        endDateDefault: getTimeSundayNextFormatted(),
        title: '',
        name: '',
        content: '',
        group: 'Public',
        admin_notes: '',
        isPreviewOpen: false,
        is_default_panel: 0,
    };

    // React.useEffect(() => {
    //     /* istanbul ignore else */
    //     if (!spotlightsLoading && !spotlights) {
    //         actions.loadAllSpotlights();
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    return (
        <StandardPage title="Promo Panel Management">
            <section aria-live="assertive">
                <StandardCard title="Create a new Promo Panel">
                    <PromoPanelForm defaults={defaults} actions={actions} history={history} />
                </StandardCard>
            </section>
        </StandardPage>
    );
};

PromoPanelAdd.propTypes = {
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

export default PromoPanelAdd;
