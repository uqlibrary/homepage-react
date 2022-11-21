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
    promoPanelList,
    promoPanelListLoading,
    promoPanelUserTypesLoading,
    promoPanelUserTypeList,
    history,
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
        scheduleList: [],
        scheduledGroups: [],
    };
    const [knownGroups, setKnownGroups] = React.useState([]);

    React.useEffect(() => {
        /* istanbul ignore else */
        if (
            !!!promoPanelListLoading &&
            !!!promoPanelUserTypesLoading &&
            (promoPanelList.length < 1 || promoPanelUserTypeList.length < 1)
        ) {
            actions.loadPromoPanelList();
            actions.loadPromoPanelUserList();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        // do something with the promo Panel List and the user type here.
        if (promoPanelUserTypeList.length > 0) {
            const known = [];
            promoPanelUserTypeList.map(item => {
                !known.some(e => e.group === item.usergroup_group) &&
                    known.push({ group: item.usergroup_group, name: item.usergroup_group_name });
            });
            setKnownGroups(known);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [promoPanelList, promoPanelUserTypeList]);

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
                    <PromoPanelForm
                        scheduledList={[]}
                        scheduledGroupNames={[]}
                        fullPromoPanelList={promoPanelList}
                        fullPromoPanelUserTypeList={promoPanelUserTypeList}
                        defaults={defaults}
                        actions={actions}
                        history={history}
                        knownGroups={knownGroups}
                    />
                </StandardCard>
            </section>
        </StandardPage>
    );
};

PromoPanelAdd.propTypes = {
    actions: PropTypes.any,
    promoPanelList: PropTypes.array,
    promoPanelListLoading: PropTypes.bool,
    promoPanelUserTypesLoading: PropTypes.bool,
    promoPanelUserTypeList: PropTypes.array,
    promoPanelLoading: PropTypes.bool,
    history: PropTypes.object,
    publicFileUploading: PropTypes.any,
    publicFileUploadError: PropTypes.any,
    publicFileUploadResult: PropTypes.any,
    spotlights: PropTypes.any,
    spotlightsLoading: PropTypes.any,
};

export default PromoPanelAdd;
