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

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { PromoPanelForm } from 'modules/Pages/Admin/PromoPanel/PromoPanelForm';

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
    const { promopanelid } = useParams();
    console.log('Current Promo Panel', currentPromoPanel);

    const defaults = {
        id: '',
        startDateDefault: null,
        endDateDefault: null,
        title: '',
        name: '',
        content: '',
        group: 'Public',
        admin_notes: '',
        isPreviewOpen: false,
        is_default_panel: 0,
        allocatedGroups: [],
        defaultFromParent: 'test',
    };

    React.useEffect(() => {
        /* istanbul ignore else */
        console.log('currrent promo panel list', promoPanelList, `${!promoPanelList}`);
        if (!!!promoPanelList || promoPanelList.length < 1) {
            console.log('THE PROMO PANEL LIST');
            actions.loadPromoPanelList();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        /* istanbul ignore else */
        if (!!promoPanelList && promoPanelList.length > 0) {
            const activePanel = promoPanelList.filter(item => `${item.panel_id}` === `${promopanelid}`);
            defaults.id = activePanel.id;
            // defaults.startDateDefault = activePanel.
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [promoPanelList]);
    console.log('PROMO PANEL LIST', promoPanelList);
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
    promoPanelList: PropTypes.array,
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
