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
import { getTimeMondayMidnightNext, getTimeSundayNextFormatted } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

export const PromoPanelEdit = ({
    actions,
    promoPanelList,
    promoPanelListLoading,
    promoPanelUserTypesLoading,
    promoPanelUserTypeList,
    history,
}) => {
    const { promopanelid } = useParams();

    const [scheduleList, setScheduleList] = React.useState([]);
    const [userList, setUserList] = React.useState([]);
    const [knownGroups, setKnownGroups] = React.useState([]);
    const [currentPanel, setCurrentPanel] = React.useState(null);
    const [isDefault, setIsDefault] = React.useState(false);

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
        is_default_panel: isDefault,
        scheduledGroups: userList,
    };

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
        if (promoPanelUserTypeList.length > 0) {
            const known = [];
            promoPanelUserTypeList.map(item => !known.includes(item.user_group) && known.push(item.user_group));
            setKnownGroups(known);
        }
        if (promoPanelList.length > 0) {
            const userlist = [];
            const schedule = [];
            setCurrentPanel(...promoPanelList.filter(item => `${item.panel_id}` === `${promopanelid}`));
            promoPanelList.map(item => {
                if (`${item.panel_id}` === `${promopanelid}`) {
                    item.user_groups.map(element => {
                        console.log('ELEMENT', element, element.is_panel_default_for_this_user);
                        if (element.is_panel_default_for_this_user === 'Y' && !isDefault) {
                            setIsDefault(true);
                        }

                        !userlist.includes(element.user_group) && userlist.push(element.user_group);

                        if (schedule.length < 1) {
                            schedule.push({
                                startDate: element.panel_schedule_start_time,
                                endDate: element.panel_schedule_end_time,
                                groupNames: [element.user_group],
                            });
                        } else {
                            schedule.push({
                                startDate: element.panel_schedule_start_time,
                                endDate: element.panel_schedule_end_time,
                                groupNames: [element.user_group],
                            });
                            // schedule.map((scheduleItem, index) => {
                            //     if (
                            //         scheduleItem.startDate === element.panel_schedule_start_time &&
                            //         scheduleItem.endDate === element.panel_schedule_end_time
                            //     ) {
                            //         schedule[index].groupNames.push(element.user_group);
                            //     } else {
                            //         schedule.push({
                            //             startDate: element.panel_schedule_start_time,
                            //             endDate: element.panel_schedule_end_time,
                            //             groupNames: [element.user_group],
                            //         });
                            //     }
                            // });
                        }
                    });
                }
                setUserList(userlist);
                setScheduleList(schedule);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [promoPanelList, promoPanelUserTypeList]);

    React.useEffect(() => {
        /* istanbul ignore else */
        if (!!promoPanelList && promoPanelList.length > 0) {
            const activePanel = promoPanelList.filter(item => `${item.panel_id}` === `${promopanelid}`);
            defaults.id = activePanel.id;
            // defaults.startDateDefault = activePanel.
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [promoPanelList]);
    return (
        <StandardPage title="Promo Panel Management">
            <section aria-live="assertive">
                <StandardCard title="Edit a promo panel">
                    {!!currentPanel && (
                        <PromoPanelForm
                            scheduledList={scheduleList}
                            scheduledGroupNames={userList}
                            fullPromoPanelList={promoPanelList}
                            fullPromoPanelUserTypeList={promoPanelUserTypeList}
                            currentPanel={currentPanel}
                            knownGroups={knownGroups}
                            defaults={defaults}
                            actions={actions}
                            history={history}
                            isDefaultPanel={isDefault}
                        />
                    )}
                </StandardCard>
            </section>
        </StandardPage>
    );
};

PromoPanelEdit.propTypes = {
    actions: PropTypes.any,
    promoPanelListLoading: PropTypes.bool,
    promoPanelUserTypesLoading: PropTypes.bool,
    promoPanelList: PropTypes.array,
    promoPanelUserTypeList: PropTypes.array,

    history: PropTypes.object,
};

export default PromoPanelEdit;
