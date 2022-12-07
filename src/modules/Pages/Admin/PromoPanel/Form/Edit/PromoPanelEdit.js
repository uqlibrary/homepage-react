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

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { PromoPanelForm } from 'modules/Pages/Admin/PromoPanel/Form/PromoPanelForm';

// import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';
import { getTimeMondayMidnightNext, getTimeSundayNextFormatted } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';
import { remapScheduleList } from '../../promoPanelHelpers';

export const PromoPanelEdit = ({
    actions,
    promoPanelList,
    promoPanelListLoading,
    promoPanelUserTypesLoading,
    promoPanelUserTypeList,
    promoPanelSaving,
    history,
    panelUpdated,
    queueLength,
    promoPanelListError,
    promoPanelUserTypesError,
    promoPanelActionError,
}) => {
    const { promopanelid } = useParams();

    const [scheduleList, setScheduleList] = React.useState([]);
    const [userList, setUserList] = React.useState([]);
    const [knownGroups, setKnownGroups] = React.useState([]);
    const [currentPanel, setCurrentPanel] = React.useState(null);
    const [isDefault, setIsDefault] = React.useState(false);

    const defaults = {
        id: promopanelid,
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
            promoPanelUserTypeList.map(item => {
                !known.some(e => e.group === item.usergroup_group) &&
                    known.push({ group: item.usergroup_group, name: item.usergroup_group_name });
            });
            setKnownGroups(known);
        }

        if (promoPanelList.length > 0) {
            //    const userlist = [];
            //    const schedule = [];
            setCurrentPanel(...promoPanelList.filter(item => `${item.panel_id}` === `${promopanelid}`));

            // remapScheduleList(promoPanelList, promopanelid, setIsDefault);
            // promoPanelList.map(item => {
            //     if (`${item.panel_id}` === `${promopanelid}`) {
            //         if (item.default_panels_for.length > 0) {
            //             setIsDefault(true);
            //             item.default_panels_for.map(element => {
            //                 !userlist.includes(element.usergroup_group) && userlist.push(element.usergroup_group);
            //                 schedule.push({
            //                     startDate: element.panel_schedule_start_time,
            //                     endDate: element.panel_schedule_end_time,
            //                     groupNames: element.usergroup_group,
            //                     existing: true,
            //                 });
            //             });
            //         } else {
            //             setIsDefault(false);
            //             item.panel_schedule.map(element => {
            //                 !userlist.includes(element.usergroup_group_name) &&
            //                     userlist.push(element.usergroup_group_name);
            //                 element.user_group_schedule.map(panelSchedule => {
            //                     schedule.push({
            //                         startDate: panelSchedule.panel_schedule_start_time,
            //                         endDate: panelSchedule.panel_schedule_end_time,
            //                         groupNames: element.usergroup_group,
            //                         existing: true,
            //                     });
            //                 });
            //             });
            //         }
            //         // item.user_groups.map(element => {
            //         //     // if (element.is_panel_default_for_this_user === 'Y' && !isDefault) {
            //         //     //     setIsDefault(true);
            //         //     // }

            //         //     if (item.default_panels_for.length > 0) setIsDefault(true);

            //         //     !userlist.includes(element.user_group) && userlist.push(element.user_group);

            //         //     if (schedule.length < 1) {
            //         //         schedule.push({
            //         //             startDate: element.panel_schedule_start_time,
            //         //             endDate: element.panel_schedule_end_time,
            //         //             groupNames: element.user_group,
            //         //             existing: true,
            //         //         });
            //         //     } else {
            //         //         schedule.push({
            //         //             startDate: element.panel_schedule_start_time,
            //         //             endDate: element.panel_schedule_end_time,
            //         //             groupNames: element.user_group,
            //         //             existing: true,
            //         //         });
            //         //         // schedule.map((scheduleItem, index) => {
            //         //         //     if (
            //         //         //         scheduleItem.startDate === element.panel_schedule_start_time &&
            //         //         //         scheduleItem.endDate === element.panel_schedule_end_time
            //         //         //     ) {
            //         //         //         schedule[index].groupNames.push(element.user_group);
            //         //         //     } else {
            //         //         //         schedule.push({
            //         //         //             startDate: element.panel_schedule_start_time,
            //         //         //             endDate: element.panel_schedule_end_time,
            //         //         //             groupNames: [element.user_group],
            //         //         //         });
            //         //         //     }
            //         //         // });
            //         //     }
            //         // });
            //     }
            const [userlist, schedulelist] = remapScheduleList(promoPanelList, promopanelid, setIsDefault);
            setUserList(userlist);
            setScheduleList(schedulelist);
            // };
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
            {(!!promoPanelListError || !!promoPanelUserTypesError) && (
                <div style={{ backgroundColor: '#933', padding: 10, textAlign: 'center', color: 'white' }}>
                    <p>There was an error loading data from the server. Please refresh and try again.</p>
                    <p>{promoPanelListError || promoPanelUserTypesError}</p>
                </div>
            )}
            <section aria-live="assertive">
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
                        isEdit
                        promoPanelSaving={promoPanelSaving}
                        isDefaultPanel={isDefault}
                        panelUpdated={panelUpdated}
                        queueLength={queueLength}
                    />
                )}
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
    panelUpdated: PropTypes.bool,
    promoPanelSaving: PropTypes.bool,
    history: PropTypes.object,
    queueLength: PropTypes.number,
    promoPanelListError: PropTypes.string,
    promoPanelUserTypesError: PropTypes.string,
    promoPanelActionError: PropTypes.string,
};

export default PromoPanelEdit;